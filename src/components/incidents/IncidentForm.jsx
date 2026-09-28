import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  AlertCircle,
  Brain,
  Check,
  Copy,
  Loader2
} from 'lucide-react';
import Button from '../ui/Button';
import { createIncident } from '../../services/api';

const SERVICES = [
  'Payment API',
  'Order Service',
  'Authentication',
  'Inventory API',
  'Search Service',
  'Notification Service',
  'Cache',
  'API Gateway',
  'Other'
];

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];
const ENVIRONMENTS = ['Production', 'Staging', 'Development'];

export default function IncidentForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    service: 'Payment API',
    severity: 'Critical',
    environment: 'Production',
    logs: '',
    symptoms: '',
    affected_users: '',
    first_detected: '',
    recent_change: ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const steps = [
    '🧠 Searching incident memory...',
    '✓ Reviewing historical incidents',
    '✓ Found 4 relevant experiences',
    '✓ Building recommendation'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuickFill = () => {
    setFormData({
      title: 'Database connection timeout',
      service: 'Payment API',
      severity: 'Critical',
      environment: 'Production',
      logs: `2026-09-27 21:41:02 ERROR database connection timeout
pool exhausted: active=100 max=100
request_id=pay_84a92
HTTP 500 returned by /api/payment
org.postgresql.util.PSQLException: Connection to 10.0.4.12:5432 refused (socket timeout: 15000ms)
    at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:319)
    at com.zaxxer.hikari.pool.PoolBase.newConnection(PoolBase.java:359)`,
      symptoms: 'Checkout failures spiking at 84%. Users receiving 500 error when processing Stripe webhooks and payment checkout. Latency p99 > 15s.',
      affected_users: '~4,200 checkout sessions',
      first_detected: '21:39:15 UTC',
      recent_change: 'v2.14.2 deployed 35m ago (Added parallel payment verification queries)'
    });
  };

  const handleCopyCode = () => {
    if (formData.logs) {
      navigator.clipboard.writeText(formData.logs);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Incident title is required.');
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingStep(0);

    const stepTimer1 = setTimeout(() => setLoadingStep(1), 350);
    const stepTimer2 = setTimeout(() => setLoadingStep(2), 700);
    const stepTimer3 = setTimeout(() => setLoadingStep(3), 1050);

    try {
      const response = await createIncident(formData);
      setTimeout(() => {
        const incidentId = response.incident_id || response.id || 'INC-084';
        navigate(`/incidents/${incidentId}`);
      }, 1300);
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setError(
        err.message || 'Unable to submit incident to OpsMemory backend. Please verify your API status.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-[#17191C] border border-[#272A2F] relative shadow-xl">
        {/* Header slot with quick fill */}
        <div className="flex items-center justify-between pb-4 border-b border-[#272A2F] mb-6">
          <div>
            <h3 className="text-xs font-semibold text-[#EDEDED] uppercase tracking-wider font-mono">
              Incident Context
            </h3>
            <p className="text-xs text-[#8E95A0] mt-0.5">
              Specify failure telemetry, stack traces, and observed blast radius
            </p>
          </div>

          <button
            type="button"
            onClick={handleQuickFill}
            className="text-xs font-mono text-[#84E071] hover:underline flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84E071]/10 border border-[#84E071]/25 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Template</span>
          </button>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Incident Title */}
          <div>
            <label className="block text-xs font-mono font-medium text-[#8E95A0] mb-1.5 uppercase tracking-wider">
              Incident Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Database connection timeout"
              className="w-full bg-[#111214] border border-[#272A2F] rounded-xl px-3.5 py-2.5 text-xs text-[#EDEDED] placeholder-[#5A606B] focus:outline-none focus:border-[#84E071]/50 transition-colors"
              required
            />
          </div>

          {/* Row: Service, Severity, Environment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Service */}
            <div>
              <label className="block text-[11px] font-mono text-[#8E95A0] mb-1.5 uppercase tracking-wider">
                Service <span className="text-rose-400">*</span>
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full bg-[#111214] border border-[#272A2F] rounded-xl px-3 py-2 text-xs text-[#EDEDED] focus:outline-none focus:border-[#84E071]/50 font-mono"
              >
                {SERVICES.map((s) => (
                  <option key={s} value={s} className="bg-[#111214]">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-[11px] font-mono text-[#8E95A0] mb-1.5 uppercase tracking-wider">
                Severity <span className="text-rose-400">*</span>
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full bg-[#111214] border border-[#272A2F] rounded-xl px-3 py-2 text-xs text-[#EDEDED] focus:outline-none focus:border-[#84E071]/50 font-mono"
              >
                {SEVERITIES.map((sev) => (
                  <option key={sev} value={sev} className="bg-[#111214]">
                    {sev}
                  </option>
                ))}
              </select>
            </div>

            {/* Environment */}
            <div>
              <label className="block text-[11px] font-mono text-[#8E95A0] mb-1.5 uppercase tracking-wider">
                Environment <span className="text-rose-400">*</span>
              </label>
              <select
                name="environment"
                value={formData.environment}
                onChange={handleChange}
                className="w-full bg-[#111214] border border-[#272A2F] rounded-xl px-3 py-2 text-xs text-[#EDEDED] focus:outline-none focus:border-[#84E071]/50 font-mono"
              >
                {ENVIRONMENTS.map((env) => (
                  <option key={env} value={env} className="bg-[#111214]">
                    {env}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-xs font-mono font-medium text-[#8E95A0] mb-1.5 uppercase tracking-wider">
              Symptoms &amp; Blast Radius
            </label>
            <textarea
              rows={3}
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Describe what users or downstream services are experiencing..."
              className="w-full bg-[#111214] border border-[#272A2F] rounded-xl p-3 text-xs text-[#EDEDED] placeholder-[#5A606B] focus:outline-none focus:border-[#84E071]/50 transition-colors"
            />
          </div>

          {/* Error / Log Details - Styled like code editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-medium text-[#8E95A0] uppercase tracking-wider">
                Error / Log Details
              </label>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-[11px] font-mono text-[#8E95A0] hover:text-[#EDEDED] flex items-center gap-1"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3 h-3 text-[#84E071]" />
                    <span className="text-[#84E071]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Editor Container */}
            <div className="rounded-xl border border-[#272A2F] bg-[#0E1013] overflow-hidden">
              <div className="px-3.5 py-2 bg-[#14161A] border-b border-[#272A2F] flex items-center justify-between text-[11px] font-mono text-[#8E95A0]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#272A2F]"></span>
                  <span>stderr / application.log</span>
                </div>
                <span>log</span>
              </div>
              <textarea
                rows={6}
                name="logs"
                value={formData.logs}
                onChange={handleChange}
                placeholder={`2026-09-27 21:41:02 ERROR database connection timeout
pool exhausted: active=100 max=100
request_id=pay_84a92
HTTP 500 returned by /api/payment`}
                className="w-full bg-transparent p-3.5 text-xs text-[#84E071] font-mono leading-relaxed focus:outline-none resize-y placeholder-[#383C44]"
              />
            </div>
          </div>

          {/* Optional Fields Strip */}
          <div className="p-4 rounded-xl bg-[#111214] border border-[#272A2F] grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E95A0] mb-1">
                Affected Users
              </label>
              <input
                type="text"
                name="affected_users"
                value={formData.affected_users}
                onChange={handleChange}
                placeholder="e.g. ~4,200 checkout sessions"
                className="w-full bg-[#17191C] border border-[#272A2F] rounded-lg px-2.5 py-1.5 text-xs text-[#EDEDED] placeholder-[#5A606B] focus:outline-none focus:border-[#84E071]/50 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E95A0] mb-1">
                Recent Deployment / Change
              </label>
              <input
                type="text"
                name="recent_change"
                value={formData.recent_change}
                onChange={handleChange}
                placeholder="e.g. v2.14.2 deployed 35m ago"
                className="w-full bg-[#17191C] border border-[#272A2F] rounded-lg px-2.5 py-1.5 text-xs text-[#EDEDED] placeholder-[#5A606B] focus:outline-none focus:border-[#84E071]/50 font-mono"
              />
            </div>
          </div>

          {/* Loading Animation States if submitting */}
          {loading && (
            <div className="p-4 rounded-xl bg-[#111214] border border-[#84E071]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#84E071] font-semibold">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{steps[loadingStep]}</span>
              </div>
              <div className="w-full bg-[#17191C] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#84E071] h-full transition-all duration-300"
                  style={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-3 border-t border-[#272A2F] flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/incidents')}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="obsidian"
              size="lg"
              disabled={loading}
              icon={Brain}
              className="text-xs tracking-tight"
            >
              Investigate with Memory
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
