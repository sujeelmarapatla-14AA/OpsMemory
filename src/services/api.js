/**
 * Centralized API Service for OpsMemory
 * Interacts with FastAPI backend when VITE_USE_MOCK_DATA=false,
 * or serves realistic reactive mock data when VITE_USE_MOCK_DATA=true.
 */

import {
  INITIAL_INCIDENTS,
  MOCK_INVESTIGATIONS,
  MOCK_MEMORY_STATS,
  MOCK_LEARNED_PATTERNS,
  MOCK_TIMELINE_EVENTS
} from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

// Stateful in-memory mock store for judge demo interactivity
let mockIncidents = [...INITIAL_INCIDENTS];
let mockInvestigations = { ...MOCK_INVESTIGATIONS };
let mockStats = { ...MOCK_MEMORY_STATS };
let mockPatterns = [...MOCK_LEARNED_PATTERNS];
let mockTimeline = [...MOCK_TIMELINE_EVENTS];

export class ApiError extends Error {
  constructor(message, status = 500, isMemoryError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isMemoryError = isMemoryError;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
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
      const isMem = response.status === 503 || errorData.detail?.includes('Hindsight');
      throw new ApiError(
        errorData.detail || `Request failed with status ${response.status}`,
        response.status,
        isMem
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network failure / connection refused to backend
    throw new ApiError('Unable to reach OpsMemory backend.', 0, false);
  }
}

/**
 * Fetch all incidents
 */
export async function getIncidents() {
  if (USE_MOCK_DATA) {
    // Simulating realistic network latency for believable demo UX
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...mockIncidents];
  }
  return request('/api/incidents');
}

/**
 * Fetch a single incident investigation by ID
 */
export async function getIncident(id) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    // Check if investigation exists in mock cache
    if (mockInvestigations[id]) {
      return mockInvestigations[id];
    }

    // Check if incident exists in list
    const foundIncident = mockIncidents.find((inc) => inc.id === id);
    if (!foundIncident) {
      throw new ApiError(`Incident ${id} not found`, 404);
    }

    // Dynamic mock investigation for newly created incident during live demo
    const dynamicInvestigation = {
      incident: foundIncident,
      memory_matches: [
        {
          incident_id: "INC-073",
          title: "Database connection timeout",
          relevance: 91,
          root_cause: "Connection pool exhaustion",
          previous_resolution: "Scaled pool size from 80 to 150 and restarted service",
          outcome: "Resolved successfully",
          resolved_in: "11 minutes",
          date: "12 days ago"
        },
        {
          incident_id: "INC-061",
          title: `${foundIncident.service} timeout anomaly`,
          relevance: 84,
          root_cause: "Resource saturation under burst load",
          previous_resolution: "Scaled container replicas and increased connection timeout",
          outcome: "Resolved successfully",
          resolved_in: "15 minutes",
          date: "28 days ago"
        }
      ],
      analysis: {
        summary: `Hindsight recalled 2 historical incidents for ${foundIncident.service}. Error telemetry correlates with previous connection/resource starvation events.`,
        likely_root_cause: "Resource contention or connection pool exhaustion under current traffic volume.",
        recommended_steps: [
          `01 Check active metrics and pool utilization on ${foundIncident.service}.`,
          "02 Inspect stack trace lines for socket timeout or connection refusal.",
          "03 Verify dependent upstream database and cache latency.",
          "04 Apply mitigation patch or restart unhealthy container instances.",
          "05 Confirm telemetry recovers to nominal baseline."
        ],
        recommended_resolution: `Apply pool expansion and trigger graceful rolling restart for ${foundIncident.service}. Prior fix succeeded in 11 minutes.`,
        confidence: 88,
        reasoning: `2 similar historical incidents were found for ${foundIncident.service}. Previous successful resolutions demonstrated full recovery with resource pool adjustments.`
      }
    };

    mockInvestigations[id] = dynamicInvestigation;
    return dynamicInvestigation;
  }

  return request(`/api/incidents/${id}`);
}

/**
 * Create a new incident
 */
export async function createIncident(data) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const nextNumber = mockIncidents.length + 85;
    const newId = `INC-0${nextNumber}`;

    const newIncident = {
      id: newId,
      title: data.title,
      service: data.service,
      severity: data.severity,
      environment: data.environment || 'Production',
      status: 'Investigating',
      logs: data.logs || '',
      symptoms: data.symptoms || '',
      created_at: 'Just now',
      first_detected: data.first_detected || 'Just now',
      recent_change: data.recent_change || 'None reported',
      affected_users: data.affected_users || 'Unspecified',
      memory_matches: 2 // Recalled by Hindsight
    };

    // Prepend to incidents list
    mockIncidents = [newIncident, ...mockIncidents];

    return {
      incident_id: newId,
      incident: newIncident
    };
  }

  return request('/api/incidents', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Confirm and resolve an incident, retaining experience in Hindsight memory
 */
export async function resolveIncident(id, data) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    
    // Update incident status in list
    mockIncidents = mockIncidents.map((inc) => {
      if (inc.id === id) {
        return { ...inc, status: 'Resolved' };
      }
      return inc;
    });

    // Update investigation if present
    if (mockInvestigations[id]) {
      mockInvestigations[id] = {
        ...mockInvestigations[id],
        incident: {
          ...mockInvestigations[id].incident,
          status: 'Resolved',
          resolution_applied: data.resolution,
          actual_root_cause: data.root_cause,
          outcome: data.outcome
        }
      };
    }

    // Update memory stats
    mockStats = {
      ...mockStats,
      total_memories: mockStats.total_memories + 1,
      incidents_learned: mockStats.incidents_learned + 1,
      successful_resolutions: data.outcome === 'Fix Worked' 
        ? mockStats.successful_resolutions + 1 
        : mockStats.successful_resolutions
    };

    // Add entry to timeline
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    mockTimeline = [
      {
        time: timeStr,
        incident_id: id,
        action: 'Incident Resolved',
        description: `Root cause identified: ${data.root_cause.slice(0, 50)}...`,
        status_label: 'Memory Retained',
        type: 'retained'
      },
      ...mockTimeline
    ];

    return {
      success: true,
      incident_id: id,
      memory_retained: true,
      message: 'Experience saved to Hindsight memory'
    };
  }

  return request(`/api/incidents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Fetch Hindsight memory statistics and growth chart data
 */
export async function getMemoryStats() {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return { ...mockStats };
  }
  return request('/api/memory');
}

/**
 * Fetch learned operational patterns and timeline
 */
export async function getMemoryPatterns() {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return {
      patterns: [...mockPatterns],
      timeline: [...mockTimeline]
    };
  }
  return request('/api/memory/patterns');
}

/**
 * Check backend and Hindsight connectivity
 */
export async function checkHealth() {
  if (USE_MOCK_DATA) {
    return {
      backend: 'healthy',
      hindsight: 'connected',
      mode: 'mock'
    };
  }
  return request('/api/health');
}
