import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  LayoutGrid,
  Brain,
  Settings,
  Plus,
  X,
  Database,
  Radio
} from 'lucide-react';
import Button from '../ui/Button';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      name: 'Overview',
      path: '/',
      icon: Compass,
    },
    {
      name: 'Incidents',
      path: '/incidents',
      icon: LayoutGrid,
      count: '1 Active'
    },
    {
      name: 'Memory',
      path: '/memory',
      icon: Brain,
      count: '84'
    }
  ];

  const recentIncidents = [
    { id: 'INC-084', title: 'Database connection timeout', path: '/incidents/INC-084', critical: true },
    { id: 'INC-083', title: 'Redis memory pressure', path: '/incidents/INC-083' },
    { id: 'INC-082', title: 'API latency spike', path: '/incidents/INC-082' },
    { id: 'INC-081', title: 'Payment failure', path: '/incidents/INC-081' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container: 240px wide, #090A0C */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] bg-[#090A0C] border-r border-[#272A2F]/80 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* TOP Header */}
          <div className="p-4 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#17191C] border border-[#272A2F] flex items-center justify-center text-[#84E071]">
                <Radio className="w-4 h-4 text-[#84E071]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold tracking-tight text-[#EDEDED] font-sans">
                    OPSMEMORY
                  </span>
                </div>
                <p className="text-[11px] text-[#8E95A0] leading-none">Incident Intelligence</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="md:hidden text-[#8E95A0] hover:text-[#EDEDED] p-1"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* + New Incident Button (Strongest Element, Green Accent Pill) */}
          <div className="px-3 py-2">
            <Button
              variant="primary"
              size="pill"
              icon={Plus}
              onClick={() => {
                navigate('/incidents/new');
                onClose?.();
              }}
              className="w-full justify-center shadow-md shadow-[#84E071]/10 text-xs tracking-tight"
            >
              New Incident
            </Button>
          </div>

          {/* Primary Navigation */}
          <div className="px-3 py-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => onClose?.()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#17191C] text-[#EDEDED] font-semibold'
                      : 'text-[#8E95A0] hover:text-[#EDEDED] hover:bg-[#111214]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-[#84E071]' : 'text-[#8E95A0]'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.count && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        item.count.includes('Active')
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-[#1B1D21] text-[#8E95A0]'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Workspace Recent Incidents (Chat/History-style list with active green bar indicator) */}
          <div className="px-3 pt-3 flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#5A606B]">
              Recent Incidents
            </div>
            <div className="space-y-0.5 overflow-y-auto flex-1 pr-1">
              {recentIncidents.map((incident) => {
                const isActive = location.pathname === incident.path;
                return (
                  <NavLink
                    key={incident.id}
                    to={incident.path}
                    onClick={() => onClose?.()}
                    className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                      isActive
                        ? 'bg-[#17191C] text-[#EDEDED] font-medium'
                        : 'text-[#8E95A0] hover:text-[#EDEDED] hover:bg-[#111214]'
                    }`}
                  >
                    {/* Reference active indicator bar on the left */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#84E071] rounded-r-full" />
                    )}
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#8E95A0]/60 group-hover:bg-[#84E071]" />
                    <div className="truncate flex-1">
                      <span className="font-mono text-[11px] text-[#5A606B] mr-1.5">
                        {incident.id}
                      </span>
                      <span className="truncate">{incident.title}</span>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM: Hindsight Status, Settings, Avatar */}
        <div className="p-3 border-t border-[#272A2F]/80 bg-[#090A0C] space-y-2">
          {/* Hindsight Status */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#111214] border border-[#272A2F] text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84E071] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#84E071]"></span>
              </span>
              <span className="text-[#EDEDED]">Hindsight Connected</span>
            </div>
            <Database className="w-3.5 h-3.5 text-[#84E071]" />
          </div>

          {/* User profile & Settings */}
          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#1B1D21] border border-[#272A2F] flex items-center justify-center text-xs font-mono font-bold text-[#84E071]">
                S
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-[#EDEDED] leading-tight">SRE On-Call</div>
                <div className="text-[10px] text-[#8E95A0] leading-tight">Tier-1 DevOps</div>
              </div>
            </div>

            <NavLink
              to="/settings"
              onClick={() => onClose?.()}
              className="p-1.5 rounded-lg text-[#8E95A0] hover:text-[#EDEDED] hover:bg-[#17191C] transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}
