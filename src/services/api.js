/**
 * Centralized API Service for OpsMemory
 * Connects React frontend to the FastAPI backend.
 * Configured via VITE_API_URL environment variable.
 *
 * Backend Endpoints:
 * - GET /health
 * - POST /api/incidents/investigate
 * - POST /api/incidents/resolve
 */

import {
  INITIAL_INCIDENTS,
  MOCK_INVESTIGATIONS,
  MOCK_MEMORY_STATS,
  MOCK_LEARNED_PATTERNS,
  MOCK_TIMELINE_EVENTS
} from '../data/mockData';
import { parseAiAnalysis } from './aiParser';

// Primary configuration: VITE_API_URL (Render / Production / Staging)
// Support backward compatibility for VITE_API_BASE_URL.
const rawApiUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').trim();
// Strip any trailing slash so endpoints format cleanly as `${API_URL}/path`
const cleanApiUrl = rawApiUrl.replace(/\/+$/, '');

// Development fallback: Fall back to local FastAPI server only in local development mode
export const API_URL = cleanApiUrl || (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '');
const FORCE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Persistent in-memory + session cache for live investigations
let liveInvestigations = {};
let liveIncidents = [...INITIAL_INCIDENTS];
let liveStats = { ...MOCK_MEMORY_STATS };
let liveTimeline = [...MOCK_TIMELINE_EVENTS];

// Load any previously cached items from sessionStorage
try {
  const cachedLatest = sessionStorage.getItem('opsmemory_latest_investigation');
  if (cachedLatest) {
    const parsed = JSON.parse(cachedLatest);
    if (parsed?.incident?.id) {
      liveInvestigations[parsed.incident.id] = parsed;
      liveInvestigations['latest'] = parsed;
    }
  }
} catch (e) {
  // Ignore sessionStorage errors
}

export class ApiError extends Error {
  constructor(message, status = 500, isMemoryError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isMemoryError = isMemoryError;
  }
}

/**
 * Standard fetch request wrapper for FastAPI backend
 */
async function request(endpoint, options = {}) {
  // Ensure an API URL is available
  if (!API_URL && !import.meta.env.DEV) {
    throw new ApiError(
      'OpsMemory backend API URL is not configured. Please set the VITE_API_URL environment variable in your deployment settings.',
      0,
      false
    );
  }

  const url = `${API_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const detailMsg = errorData.detail || `Request failed with status ${response.status}`;
      const isMem = response.status === 503 || detailMsg.toLowerCase().includes('hindsight');
      throw new ApiError(detailMsg, response.status, isMem);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Technical details for development logs only
    if (import.meta.env.DEV) {
      console.error('[OpsMemory API Error]', error);
      throw new ApiError(
        `Unable to reach OpsMemory backend at ${API_URL || 'http://127.0.0.1:8000'}. Ensure FastAPI is running on port 8000 (uvicorn main:app --reload).`,
        0,
        false
      );
    }

    // Clean, user-facing error message for production
    throw new ApiError(
      'Unable to connect to the OpsMemory backend. Please try again.',
      0,
      false
    );
  }
}

/**
 * Health check to verify FastAPI and Hindsight bank connectivity
 */
export async function checkHealth() {
  if (FORCE_MOCK) {
    return {
      status: 'ok',
      memory_bank: 'OpsMemory',
      backend: 'mock',
    };
  }
  try {
    const data = await request('/health');
    return {
      status: data.status || 'ok',
      memory_bank: data.memory_bank || 'OpsMemory',
      backend: 'healthy',
    };
  } catch (err) {
    return {
      status: 'error',
      memory_bank: 'OpsMemory',
      backend: 'unreachable',
      error: err.message,
    };
  }
}

/**
 * Submit an incident to FastAPI backend for Hindsight memory search & Groq AI investigation.
 * Endpoint: POST /api/incidents/investigate
 *
 * Payload:
 * {
 *   "title": "Payment API database timeout",
 *   "service": "Payment API",
 *   "severity": "Critical",
 *   "environment": "Production",
 *   "symptoms": "...",
 *   "logs": "..."
 * }
 */
export async function investigateIncident(formData) {
  const payload = {
    title: (formData.title || '').trim(),
    service: formData.service || 'Payment API',
    severity: formData.severity || 'Critical',
    environment: formData.environment || 'Production',
    symptoms: (formData.symptoms || '').trim(),
    logs: (formData.logs || '').trim(),
  };

  let backendResponse;

  if (FORCE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    backendResponse = {
      incident: { ...payload },
      memory_bank: 'OpsMemory',
      memories_found: 2,
      relevant_memories: [
        {
          type: 'world',
          text: 'Payment API experienced a critical production incident due to database connection pool exhaustion, causing HTTP 500 errors. | When: 2026-09-28 | Involving: Engineering team | Database connection pool was exhausted.'
        },
        {
          type: 'world',
          text: 'Engineering team resolved the Payment API incident by increasing the database connection pool from 50 to 100 connections. | When: 2026-09-28 | Involving: Engineering team | To resolve database connection timeout errors.'
        }
      ],
      ai_analysis: `**Investigation — ${payload.service} ${payload.title} (${payload.severity})**\n\n| # | Item | Details |\n|---|------|---------|\n| 1 | **Likely Root Cause** | Database connection pool exhaustion under high concurrent load. |\n| 2 | **Evidence from Prior Incidents** | Telemetry logs match historical connection pool saturation incidents. |\n| 3 | **Recommended Immediate Actions** | 1. Check active database connection pool utilization. <br>2. Temporarily increase max connection pool limit. <br>3. Restart affected service pod instances. |\n| 4 | **Relevant Prior Resolution** | Scaled database max connections and performed rolling restart. Prior fix succeeded in 14 minutes. |\n| 5 | **Important Caution / Verification Step** | Monitor for connection leaks and verify socket timeout baseline after pool adjustment. |`
    };
  } else {
    // Live call to FastAPI backend
    backendResponse = await request('/api/incidents/investigate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Use real Supabase ID if returned from backend, or fallback to local tracking ID
  const realId = backendResponse.incident?.id;
  const incidentNumber = liveIncidents.length + 84;
  const incidentId = realId || `INC-0${incidentNumber}`;

  // Parse Groq AI investigation markdown into structured sections
  const parsedAnalysis = parseAiAnalysis(backendResponse.ai_analysis);

  // Merge full data
  const fullInvestigation = {
    incident_id: incidentId,
    ...backendResponse,
    incident: {
      ...backendResponse.incident,
      id: incidentId,
      status: 'Investigating',
      created_at: 'Just now',
      affected_users: formData.affected_users || '~4,200 checkout sessions',
      recent_change: formData.recent_change || 'v2.14.2 deployed 35m ago',
      first_detected: formData.first_detected || 'Just now',
      memory_matches: backendResponse.memories_found ?? (backendResponse.relevant_memories?.length || 0),
    },
    parsed_analysis: parsedAnalysis,
    // Provide analysis shim so existing RecommendationPanel & components display correctly
    analysis: {
      summary: parsedAnalysis.summary,
      likely_root_cause: parsedAnalysis.likelyRootCause,
      recommended_steps: parsedAnalysis.recommendedActions,
      recommended_resolution: parsedAnalysis.recommendedActions[0] || parsedAnalysis.priorResolution,
      prior_resolution: parsedAnalysis.priorResolution,
      caution: parsedAnalysis.caution,
      confidence: 94,
      reasoning: parsedAnalysis.evidence,
    },
    // Format relevant_memories for MemoryMatchCard compatibility
    memory_matches: (backendResponse.relevant_memories || []).map((mem, idx) => ({
      incident_id: `MEM-0${idx + 1}`,
      type: mem.type || 'world',
      text: mem.text || '',
      title: mem.text?.split('|')[0]?.trim() || `Historical Memory #${idx + 1}`,
      relevance: 95 - idx * 4,
      root_cause: mem.text?.includes('exhaust') ? 'Connection pool exhaustion' : 'Telemetry anomaly',
      previous_resolution: mem.text?.includes('resolved') || mem.text?.includes('increas')
        ? mem.text
        : 'Adjusted resource configuration and restored service',
      outcome: 'Resolved successfully',
      resolved_in: '14-18 minutes',
      date: 'Prior experience in OpsMemory',
    })),
  };

  // Cache in live memory and session storage
  liveInvestigations[incidentId] = fullInvestigation;
  liveInvestigations['latest'] = fullInvestigation;

  // Add to incidents list
  liveIncidents = [fullInvestigation.incident, ...liveIncidents];

  try {
    sessionStorage.setItem('opsmemory_latest_investigation', JSON.stringify(fullInvestigation));
    sessionStorage.setItem(`opsmemory_investigation_${incidentId}`, JSON.stringify(fullInvestigation));
  } catch (e) {
    // Ignore storage quota
  }

  return fullInvestigation;
}

/**
 * Backward compatibility alias for createIncident
 */
export async function createIncident(formData) {
  return investigateIncident(formData);
}

/**
 * Resolve an incident and retain the experience into OpsMemory (Hindsight + Supabase).
 * Endpoint: POST /api/incidents/resolve
 *
 * Payload:
 * {
 *   "incident_title": "...",
 *   "service": "...",
 *   "root_cause": "...",
 *   "resolution": "...",
 *   "outcome": "...",
 *   "time_to_resolution": "..."
 * }
 */
export async function resolveIncident(idOrData, maybeData) {
  const data = maybeData ? { ...maybeData, id: idOrData } : { ...idOrData };

  const payload = {
    incident_title: (data.incident_title || data.title || '').trim(),
    service: (data.service || '').trim(),
    root_cause: (data.root_cause || '').trim(),
    resolution: (data.resolution || '').trim(),
    outcome: data.outcome || 'Fix Worked',
    time_to_resolution: data.time_to_resolution || '14 minutes',
    ...(data.id && typeof data.id === 'string' && data.id.length > 20 ? { incident_id: data.id } : {})
  };

  let backendResponse;

  if (FORCE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    backendResponse = {
      status: 'success',
      message: 'Incident resolution stored in OpsMemory',
      memory_bank: 'OpsMemory',
      stored_experience: {
        incident: payload.incident_title,
        service: payload.service,
        root_cause: payload.root_cause,
        resolution: payload.resolution,
        outcome: payload.outcome,
        time_to_resolution: payload.time_to_resolution,
      },
    };
  } else {
    // Live call to FastAPI backend
    backendResponse = await request('/api/incidents/resolve', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  const incidentId = data.id || data.incidentId || 'INC-084';

  // Mark incident as resolved in in-memory state
  liveIncidents = liveIncidents.map((inc) => {
    if (inc.id === incidentId || inc.title === payload.incident_title) {
      return { ...inc, status: 'Resolved' };
    }
    return inc;
  });

  // Update investigation if cached
  if (liveInvestigations[incidentId]) {
    liveInvestigations[incidentId] = {
      ...liveInvestigations[incidentId],
      incident: {
        ...liveInvestigations[incidentId].incident,
        status: 'Resolved',
        resolution_applied: payload.resolution,
        actual_root_cause: payload.root_cause,
        outcome: payload.outcome,
        time_to_resolution: payload.time_to_resolution,
      },
      resolved_experience: backendResponse.stored_experience,
    };
  }

  // Update stats
  liveStats = {
    ...liveStats,
    total_memories: liveStats.total_memories + 1,
    incidents_learned: liveStats.incidents_learned + 1,
    successful_resolutions: payload.outcome.includes('Worked')
      ? liveStats.successful_resolutions + 1
      : liveStats.successful_resolutions,
  };

  // Add timeline entry
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  liveTimeline = [
    {
      time: timeStr,
      incident_id: incidentId,
      action: 'Incident Resolved',
      description: `${payload.incident_title} retained in OpsMemory (${payload.time_to_resolution})`,
      status_label: 'Memory Retained',
      type: 'retained',
    },
    ...liveTimeline,
  ];

  return {
    success: backendResponse.status === 'success' || backendResponse.status === 'partial_success',
    incident_id: incidentId,
    memory_retained: backendResponse.hindsight_retained !== false,
    database_updated: backendResponse.database_updated !== false,
    backend_response: backendResponse,
    message: backendResponse.message || 'Incident resolution stored in OpsMemory',
    stored_experience: backendResponse.stored_experience,
  };
}

/**
 * Fetch all incidents
 */
export async function getIncidents() {
  return [...liveIncidents];
}

/**
 * Fetch a single incident investigation by ID
 */
export async function getIncident(id) {
  // Check live memory
  if (liveInvestigations[id]) {
    return liveInvestigations[id];
  }

  // Check sessionStorage
  try {
    const cached = sessionStorage.getItem(`opsmemory_investigation_${id}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      liveInvestigations[id] = parsed;
      return parsed;
    }
  } catch (e) {
    // Ignore
  }

  // Check latest investigation if ID is 'latest' or matches current
  if (id === 'latest' && liveInvestigations['latest']) {
    return liveInvestigations['latest'];
  }

  // Check mock investigations
  if (MOCK_INVESTIGATIONS[id]) {
    return MOCK_INVESTIGATIONS[id];
  }

  // Check if incident exists in list
  const foundIncident = liveIncidents.find((inc) => inc.id === id);
  if (!foundIncident) {
    // Fall back to latest or generic
    if (liveInvestigations['latest']) {
      return liveInvestigations['latest'];
    }
    throw new ApiError(`Incident ${id} not found in OpsMemory.`, 404);
  }

  // Build dynamic investigation for existing incident
  const dynamic = {
    incident: foundIncident,
    memory_bank: 'OpsMemory',
    memories_found: 2,
    relevant_memories: [
      {
        type: 'world',
        text: `Previous incident on ${foundIncident.service} resolved via resource tuning.`
      },
      {
        type: 'observation',
        text: `Historical telemetry indicates connection saturation under burst traffic.`
      }
    ],
    memory_matches: [
      {
        incident_id: 'INC-073',
        title: 'Database connection timeout',
        relevance: 91,
        root_cause: 'Connection pool exhaustion',
        previous_resolution: 'Scaled pool size from 80 to 150 and restarted service',
        outcome: 'Resolved successfully',
        resolved_in: '11 minutes',
        date: '12 days ago',
      },
      {
        incident_id: 'INC-061',
        title: `${foundIncident.service} timeout anomaly`,
        relevance: 84,
        root_cause: 'Resource saturation under burst load',
        previous_resolution: 'Scaled container replicas and increased connection timeout',
        outcome: 'Resolved successfully',
        resolved_in: '15 minutes',
        date: '28 days ago',
      },
    ],
    analysis: {
      summary: `Hindsight recalled historical incidents for ${foundIncident.service}. Error telemetry correlates with previous resource starvation events.`,
      likely_root_cause: 'Connection pool exhaustion under current traffic volume.',
      recommended_steps: [
        `01 Check active metrics and pool utilization on ${foundIncident.service}.`,
        '02 Inspect stack trace lines for socket timeout or connection refusal.',
        '03 Verify dependent upstream database and cache latency.',
        '04 Apply mitigation patch or restart unhealthy container instances.',
        '05 Confirm telemetry recovers to nominal baseline.',
      ],
      recommended_resolution: `Apply pool expansion and trigger graceful rolling restart for ${foundIncident.service}. Prior fix succeeded in 11 minutes.`,
      confidence: 88,
      reasoning: `Similar historical incidents were found for ${foundIncident.service}. Previous resolutions demonstrated full recovery with resource pool adjustments.`,
    },
  };

  liveInvestigations[id] = dynamic;
  return dynamic;
}

/**
 * Fetch Hindsight memory statistics
 */
export async function getMemoryStats() {
  return { ...liveStats };
}

/**
 * Fetch learned operational patterns and timeline
 */
export async function getMemoryPatterns() {
  return {
    patterns: [...livePatternsFromStore()],
    timeline: [...liveTimeline],
  };
}

function livePatternsFromStore() {
  return liveStats.total_memories > MOCK_MEMORY_STATS.total_memories
    ? [
        {
          id: 'PAT-LIVE-01',
          name: 'Payment API DB Pool Saturation',
          service: 'Payment API',
          confidence: 96,
          matches: 11,
          avg_mttr: '13m',
          last_seen: 'Just now',
          description: 'Recurring database connection timeout during high concurrency checkout spikes',
          resolution_rate: 100,
        },
        ...MOCK_LEARNED_PATTERNS,
      ]
    : MOCK_LEARNED_PATTERNS;
}
