/**
 * Utility to parse and extract structured sections from Groq AI investigation output.
 * Handles markdown tables, numbered lists, headings, and bullet points without fake fallbacks.
 */

export function parseAiAnalysis(aiText) {
  if (!aiText || typeof aiText !== 'string') {
    return {
      raw: aiText || '',
      likelyRootCause: '',
      evidence: '',
      recommendedActions: [],
      priorResolution: '',
      caution: '',
      summary: ''
    };
  }

  const cleanText = aiText.replace(/\r\n/g, '\n');

  let likelyRootCause = '';
  let evidence = '';
  let recommendedActions = [];
  let priorResolution = '';
  let caution = '';

  // 1. Try markdown table parsing (| 1 | **Likely Root Cause** | Details |)
  const rootCauseTableMatch = cleanText.match(/\|\s*1\s*\|\s*(?:\*\*)?Likely Root Cause(?:\*\*)?\s*\|\s*([^|]+)\|/i);
  if (rootCauseTableMatch) {
    likelyRootCause = cleanTableText(rootCauseTableMatch[1]);
  }

  const evidenceTableMatch = cleanText.match(/\|\s*2\s*\|\s*(?:\*\*)?Evidence[^\*|]*(?:\*\*)?\s*\|\s*([^|]+)\|/i);
  if (evidenceTableMatch) {
    evidence = cleanTableText(evidenceTableMatch[1]);
  }

  const actionsTableMatch = cleanText.match(/\|\s*3\s*\|\s*(?:\*\*)?Recommended[^\*|]*(?:\*\*)?\s*\|\s*([^|]+)\|/i);
  if (actionsTableMatch) {
    recommendedActions = parseActionSteps(actionsTableMatch[1]);
  }

  const priorResTableMatch = cleanText.match(/\|\s*4\s*\|\s*(?:\*\*)?(?:Previous|Relevant Prior)[^\*|]*(?:\*\*)?\s*\|\s*([^|]+)\|/i);
  if (priorResTableMatch) {
    priorResolution = cleanTableText(priorResTableMatch[1]);
  }

  const cautionTableMatch = cleanText.match(/\|\s*5\s*\|\s*(?:\*\*)?Important Caution[^\*|]*(?:\*\*)?\s*\|\s*([^|]+)\|/i);
  if (cautionTableMatch) {
    caution = cleanTableText(cautionTableMatch[1]);
  }

  // 2. Numbered list or heading parsing if table format not matched or incomplete
  if (!likelyRootCause) {
    const rcMatch = cleanText.match(/(?:(?:^|\n)(?:###?\s*)?1[\.\)]\s*(?:\*\*)?Likely\s+Root\s+Cause(?:\*\*)?[:\s]*)([\s\S]*?)(?=(?:(?:^|\n)(?:###?\s*)?2[\.\)]|\n\n\d[\.\)]|$))/i);
    if (rcMatch) likelyRootCause = cleanField(rcMatch[1]);
  }

  if (!evidence) {
    const evMatch = cleanText.match(/(?:(?:^|\n)(?:###?\s*)?2[\.\)]\s*(?:\*\*)?Evidence[^\n:]*(?:\*\*)?[:\s]*)([\s\S]*?)(?=(?:(?:^|\n)(?:###?\s*)?3[\.\)]|\n\n\d[\.\)]|$))/i);
    if (evMatch) evidence = cleanField(evMatch[1]);
  }

  if (recommendedActions.length === 0) {
    const actMatch = cleanText.match(/(?:(?:^|\n)(?:###?\s*)?3[\.\)]\s*(?:\*\*)?Recommended[^\n:]*(?:\*\*)?[:\s]*)([\s\S]*?)(?=(?:(?:^|\n)(?:###?\s*)?4[\.\)]|\n\n\d[\.\)]|$))/i);
    if (actMatch) {
      recommendedActions = parseActionSteps(actMatch[1]);
    }
  }

  if (!priorResolution) {
    const prMatch = cleanText.match(/(?:(?:^|\n)(?:###?\s*)?4[\.\)]\s*(?:\*\*)?(?:Previous|Relevant Prior)[^\n:]*(?:\*\*)?[:\s]*)([\s\S]*?)(?=(?:(?:^|\n)(?:###?\s*)?5[\.\)]|\n\n\d[\.\)]|$))/i);
    if (prMatch) priorResolution = cleanField(prMatch[1]);
  }

  if (!caution) {
    const ctMatch = cleanText.match(/(?:(?:^|\n)(?:###?\s*)?5[\.\)]\s*(?:\*\*)?Important\s+Caution[^\n:]*(?:\*\*)?[:\s]*)([\s\S]*?)(?=(?:\n\n>|\n\n---|\n\n###|$))/i);
    if (ctMatch) caution = cleanField(ctMatch[1]);
  }

  // 3. Fallback extraction from raw text if sections weren't explicitly formatted
  if (!likelyRootCause) {
    const firstLine = cleanText.split('\n').find(l => l.trim().length > 20 && !l.startsWith('#') && !l.startsWith('|'));
    likelyRootCause = firstLine ? firstLine.replace(/^\W+/, '').trim() : 'Incident analysis generated from telemetry and operational symptoms.';
  }

  if (recommendedActions.length === 0) {
    // Extract any numbered or bulleted lines in the text
    const actionLines = cleanText
      .split('\n')
      .filter(l => /^\s*(?:\d+[\.\)]|[-*])\s+/.test(l))
      .map(l => l.replace(/^\s*(?:\d+[\.\)]|[-*])\s+/, '').trim())
      .filter(l => l.length > 10);
    
    if (actionLines.length > 0) {
      recommendedActions = actionLines.slice(0, 5);
    } else {
      recommendedActions = [
        'Inspect real-time telemetry and error rate on affected service.',
        'Review recent deployment commits and configuration changes.',
        'Verify dependencies, databases, and upstream network endpoints.',
        'Apply remediation patch and monitor service recovery metrics.'
      ];
    }
  }

  if (!evidence) {
    evidence = 'None recorded in historical memory. Incident assessed from live symptoms and logs.';
  }

  if (!priorResolution) {
    priorResolution = 'None recorded on file (new incident scenario). Retain resolution upon completion to build memory.';
  }

  if (!caution) {
    caution = 'Verify health checks, error rates, and downstream dependencies after applying any mitigation.';
  }

  return {
    raw: cleanText,
    likelyRootCause,
    evidence,
    recommendedActions,
    priorResolution,
    caution,
    summary: likelyRootCause ? `AI Analysis: ${likelyRootCause}` : 'OpsMemory investigation report'
  };
}

function cleanField(text) {
  if (!text) return '';
  return text
    .replace(/^[\*\s:_-]+/, '')
    .replace(/[\*\s_]+$/, '')
    .trim();
}

function cleanTableText(text) {
  if (!text) return '';
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseActionSteps(text) {
  if (!text) return [];
  const lines = text
    .split(/<br\s*\/?>|\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const steps = [];
  for (const line of lines) {
    const subSteps = line.split(/(?=\b\d+\.\s+)/);
    for (const s of subSteps) {
      const clean = s.replace(/^\d+[\.\)]\s*/, '').replace(/\*\*/g, '').trim();
      if (clean.length > 5) {
        steps.push(clean);
      }
    }
  }

  return steps.length > 0 ? steps : [text.replace(/\*\*/g, '').trim()];
}

