import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Loader2
} from 'lucide-react';
import { investigateIncident } from '../../services/api';
import { useToast } from '../../context/ToastContext';

// 5 Prepared Demo Incidents
export const DEMO_INCIDENTS = [
  {
    title: 'Payment API database timeout',
    service: 'Payment API',
    severity: 'Critical',
    environment: 'Production',
    symptoms: 'Payment requests are returning HTTP 500 errors and database connection timeouts.',
    logs: 'Database connection pool exhausted. Timeout while acquiring database connection.'
  },
  {
    title: 'Authentication service Redis connection failure',
    service: 'Auth Service',
    severity: 'High',
    environment: 'Production',
    symptoms: 'Users are being logged out unexpectedly and new login attempts are failing.',
    logs: 'Redis clients unavailable. Authentication session store connection limit exceeded.'
  },
  {
    title: 'Order service database deadlock',
    service: 'Order Service',
    severity: 'High',
    environment: 'Production',
    symptoms: 'Some orders fail while multiple customers are placing orders at the same time.',
    logs: 'Database transaction deadlock detected. Multiple transactions are waiting for locked rows.'
  },
  {
    title: 'Notification API rate limit exceeded',
    service: 'Notification Service',
    severity: 'High',
    environment: 'Production',
    symptoms: 'Large numbers of notification requests are failing and delivery is delayed.',
    logs: 'External messaging provider returned HTTP 429 rate limit exceeded errors.'
  },
  {
    title: 'File upload service storage failure',
    service: 'File Upload Service',
    severity: 'Medium',
    environment: 'Production',
    symptoms: 'File uploads are failing even though the application is running normally.',
    logs: 'Storage bucket capacity limit reached. Upload operation rejected due to insufficient storage capacity.'
  }
];

const COMMON_SERVICES = [
  'Payment API',
  'Auth Service',
  'Order Service',
  'Notification Service',
  'File Upload Service',
  'Authentication',
  'Inventory API',
  'Search Service',
  'Cache Service',
  'API Gateway'
];

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];
const ENVIRONMENTS = ['Production', 'Staging', 'Development'];

const PROGRESS_SEQUENCE = [
  { step: '01', label: 'Reading incident telemetry & logs' },
  { step: '02', label: 'Searching Hindsight incident memory' },
  { step: '03', label: 'Comparing previous incident resolutions' },
  { step: '04', label: 'Generating Groq AI investigation' },
  { step: '05', label: 'Preparing recommendations & caution steps' }
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function IncidentForm({ onInvestigationComplete }) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    service: 'Payment API',
    severity: 'Critical',
    environment: 'Production',
    symptoms: '',
    logs: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Shuffle-bag state (Phase 12)
  const shuffleBagRef = useRef([]);
  const [demoIndex, setDemoIndex] = useState(0);
  const [demoBanner, setDemoBanner] = useState(null);

  // Investigation progress state (Phase 5)
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [activeProgressStep, setActiveProgressStep] = useState(0);

  useEffect(() => {
    shuffleBagRef.current = shuffleArray(DEMO_INCIDENTS);
  }, []);

  const validateField = (name, value) => {
    if (name === 'title' && !value.trim()) return 'Incident title is required';
    if (name === 'symptoms' && !value.trim()) return 'Symptoms are required for memory retrieval';
    if (name === 'service' && !value.trim()) return 'Service name is required';
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    if (err) {
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  /**
   * Mode 1: Demo Incident handler using Shuffle-Bag
   * Fills form without auto-submitting.
   */
  const handleDemoIncident = () => {
    if (shuffleBagRef.current.length === 0) {
      shuffleBagRef.current = shuffleArray(DEMO_INCIDENTS);
    }

    const nextIncident = shuffleBagRef.current.pop();
    const currentNumber = 5 - shuffleBagRef.current.length;
    setDemoIndex(currentNumber);

    setFormData({
      title: nextIncident.title,
      service: nextIncident.service,
      severity: nextIncident.severity,
      environment: nextIncident.environment,
      symptoms: nextIncident.symptoms,
      logs: nextIncident.logs
    });

    setErrors({});
    setDemoBanner(`Demo Incident ${currentNumber} / 5 loaded. Review or edit details below.`);
    addToast({
      title: `Demo Incident ${currentNumber} / 5 Loaded`,
      message: `${nextIncident.service}: ${nextIncident.title}`,
      type: 'info'
    });
  };

  const handleReset = () => {
    setFormData({
      title: '',
      service: 'Payment API',
      severity: 'Critical',
      environment: 'Production',
      symptoms: '',
      logs: ''
    });
    setErrors({});
    setTouched({});
    setDemoBanner(null);
    addToast({
      title: 'Form Reset',
      message: 'Incident input cleared.',
      type: 'info'
    });
  };

  const handleInvestigate = async (e) => {
    if (e) e.preventDefault();

    const newErrors = {};
    const titleErr = validateField('title', formData.title);
    const sympErr = validateField('symptoms', formData.symptoms);
    const servErr = validateField('service', formData.service);

    if (titleErr) newErrors.title = titleErr;
    if (sympErr) newErrors.symptoms = sympErr;
    if (servErr) newErrors.service = servErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ title: true, symptoms: true, service: true });
      addToast({
        title: 'Validation Incomplete',
        message: 'Please provide an incident title, service, and symptoms.',
        type: 'warning'
      });
      return;
    }

    setIsInvestigating(true);
    setActiveProgressStep(0);

    const progressInterval = setInterval(() => {
      setActiveProgressStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 700);

    try {
      const result = await investigateIncident(formData);
      clearInterval(progressInterval);
      setActiveProgressStep(4);

      addToast({
        title: 'Investigation Complete',
        message: `Hindsight found ${result.memories_found ?? result.relevant_memories?.length ?? 0} memories.`,
        type: 'success'
      });

      if (onInvestigationComplete) {
        onInvestigationComplete(result);
      } else {
        navigate(`/incidents/${result.incident?.id || 'INC-084'}`, {
          state: { investigation: result }
        });
      }
    } catch (err) {
      clearInterval(progressInterval);
      addToast({
        title: 'Investigation Failed',
        message: err.message || 'Could not connect to FastAPI backend.',
        type: 'error'
      });
    } finally {
      setIsInvestigating(false);
    }
  };

  return (
    <div
      id="incident-console-form"
      className="relative w-full rounded-2xl bg-[#0d0d11] border border-white/[0.08] shadow-xl overflow-hidden font-sans"
    >
      {/* Investigation Progress Sequence Overlay (Hero-unified monochrome design) */}
      {isInvestigating && (
        <div className="absolute inset-0 z-30 bg-[#050505]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0d0d11] border border-white/20 shadow-2xl space-y-6">
            <div className="flex items-center justify-center gap-2.5">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
              <span className="font-mono text-sm font-bold text-white tracking-tight">
                Investigating Incident
              </span>
            </div>

            <div className="space-y-2 text-left font-mono">
              {PROGRESS_SEQUENCE.map((seq, idx) => {
                const isCurrent = idx === activeProgressStep;
                const isDone = idx < activeProgressStep;

                return (
                  <div
                    key={seq.step}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 ${
                      isCurrent
                        ? 'bg-white/[0.08] border-white/40 text-white font-semibold'
                        : isDone
                        ? 'bg-white/[0.03] border-white/10 text-[#949aa3]'
                        : 'bg-transparent border-transparent text-[#454c59]'
                    }`}
                  >
                    <span className={`text-xs ${isCurrent ? 'text-white' : isDone ? 'text-white/80' : 'text-[#454c59]'}`}>
                      {isDone ? '✓' : seq.step}
                    </span>
                    <span className="text-xs">{seq.label}</span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-[#949aa3] font-sans">
              Connecting live to FastAPI, Hindsight vector engine, and Groq AI...
            </p>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="px-5 sm:px-6 py-4 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-4 h-4 text-white/80" />
            <span>Incident Investigation Console</span>
          </h2>
          <p className="text-xs text-[#949aa3] mt-0.5 font-sans">
            Submit telemetry symptoms to recall historical resolutions and synthesize root cause.
          </p>
        </div>

        {/* Action Controls: [ ✦ Demo Incident ] and Reset */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDemoIncident}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-white transition-all cursor-pointer shadow-xs active:scale-95"
            title="Cycle through 5 prepared demo incidents using shuffle-bag (Press D)"
          >
            <span>✦ Demo Incident</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/10 border border-white/15">
              {demoIndex > 0 ? `${demoIndex}/5` : '1-5'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg text-[#949aa3] hover:text-white border border-white/10 hover:border-white/25 transition-colors cursor-pointer"
            title="Reset incident form"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Demo Banner */}
      {demoBanner && (
        <div className="px-5 sm:px-6 py-2 bg-white/[0.03] border-b border-white/[0.08] text-xs font-mono text-white/90 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-white/80" />
            <span className="truncate">{demoBanner}</span>
          </div>
          <span className="text-[10px] text-[#949aa3] shrink-0 hidden sm:inline">
            Editable before submission
          </span>
        </div>
      )}

      {/* Form Inputs */}
      <form onSubmit={handleInvestigate} className="p-5 sm:p-6 space-y-5">
        {/* Row 1: Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="title" className="font-medium text-white flex items-center gap-1">
              <span>Incident Title</span>
              <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] font-mono text-[#5a606b]">
              {formData.title.length}/100 chars
            </span>
          </div>
          <input
            id="title"
            name="title"
            type="text"
            maxLength={100}
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Payment API database timeout under burst traffic"
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#121216] text-[#EDEDED] placeholder-[#52525B] border transition-colors focus:outline-none ${
              errors.title && touched.title
                ? 'border-rose-500/80 focus:border-rose-500'
                : 'border-white/[0.08] focus:border-white/40 focus:ring-1 focus:ring-white/20'
            }`}
          />
          {errors.title && touched.title && (
            <p className="text-[11px] text-rose-400 font-mono flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* Row 2: Service, Severity, Environment */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Service */}
          <div className="space-y-1.5">
            <label htmlFor="service" className="text-xs font-medium text-white flex items-center gap-1">
              <span>Service</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              id="service"
              name="service"
              list="service-options"
              type="text"
              value={formData.service}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Payment API"
              className={`w-full px-3 py-2 rounded-xl text-xs bg-[#121216] text-[#EDEDED] border transition-colors focus:outline-none ${
                errors.service && touched.service
                  ? 'border-rose-500/80 focus:border-rose-500'
                  : 'border-white/[0.08] focus:border-white/40 focus:ring-1 focus:ring-white/20'
              }`}
            />
            <datalist id="service-options">
              {COMMON_SERVICES.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          {/* Severity */}
          <div className="space-y-1.5">
            <label htmlFor="severity" className="text-xs font-medium text-white">
              Severity
            </label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#121216] text-[#EDEDED] border border-white/[0.08] focus:border-white/40 focus:outline-none transition-colors"
            >
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Environment */}
          <div className="space-y-1.5">
            <label htmlFor="environment" className="text-xs font-medium text-white">
              Environment
            </label>
            <select
              id="environment"
              name="environment"
              value={formData.environment}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#121216] text-[#EDEDED] border border-white/[0.08] focus:border-white/40 focus:outline-none transition-colors"
            >
              {ENVIRONMENTS.map((env) => (
                <option key={env} value={env}>
                  {env}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Symptoms */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="symptoms" className="font-medium text-white flex items-center gap-1">
              <span>Symptoms &amp; Impact</span>
              <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] font-mono text-[#5a606b]">
              Used for Hindsight semantic search
            </span>
          </div>
          <textarea
            id="symptoms"
            name="symptoms"
            rows={3}
            value={formData.symptoms}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe customer impact, HTTP codes, latency spikes, or failed transactions..."
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#121216] text-[#EDEDED] placeholder-[#52525B] border transition-colors focus:outline-none leading-relaxed resize-y ${
              errors.symptoms && touched.symptoms
                ? 'border-rose-500/80 focus:border-rose-500'
                : 'border-white/[0.08] focus:border-white/40 focus:ring-1 focus:ring-white/20'
            }`}
          />
          {errors.symptoms && touched.symptoms && (
            <p className="text-[11px] text-rose-400 font-mono flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.symptoms}</span>
            </p>
          )}
        </div>

        {/* Row 4: Application Logs */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="logs" className="font-medium text-white flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#949aa3]" />
              <span>Application Logs &amp; Stacktraces</span>
            </label>
            <span className="text-[11px] font-mono text-[#5a606b]">
              Optional telemetry excerpt
            </span>
          </div>
          <div className="relative rounded-xl border border-white/[0.08] bg-[#08080a] overflow-hidden focus-within:border-white/40 transition-colors">
            <div className="px-3 py-1 bg-[#101014] border-b border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-[#949aa3]">
              <span>stderr / stacktrace</span>
              <span>{formData.logs ? `${formData.logs.split('\n').length} lines` : 'empty'}</span>
            </div>
            <textarea
              id="logs"
              name="logs"
              rows={4}
              value={formData.logs}
              onChange={handleChange}
              placeholder="Paste exception traces, connection pool stats, or error logs..."
              className="w-full p-3 text-xs font-mono text-white/90 placeholder-[#454c59] bg-transparent focus:outline-none leading-relaxed resize-y"
            />
          </div>
        </div>

        {/* Footer Actions: Primary CTA [ 🔍 Investigate Incident ] matching Hero */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#5a606b]">
            <kbd>I</kbd>
            <span>Investigate</span>
            <span>·</span>
            <kbd>D</kbd>
            <span>Demo</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={isInvestigating}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-mono font-bold bg-white text-black hover:bg-neutral-200 border border-white/30 shadow-lg shadow-white/5 transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Investigate Incident</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
