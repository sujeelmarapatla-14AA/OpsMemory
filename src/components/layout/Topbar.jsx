import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Settings,
  ChevronRight
} from 'lucide-react';

export default function Topbar({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbTitle = (part) => {
    if (part === 'incidents') return 'Incidents';
    if (part === 'new') return 'Report Incident';
    if (part === 'memory') return 'Hindsight Memory';
    if (part === 'settings') return 'Settings';
    if (part.startsWith('INC-')) return part;
    return part;
  };

  return (
    <header className="h-14 border-b border-[#272A2F]/80 bg-[#111214]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile Toggle & Page Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 rounded-lg text-[#8E95A0] hover:text-[#EDEDED] hover:bg-[#17191C]"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-sans">
          <Link
            to="/"
            className="text-[#8E95A0] hover:text-[#EDEDED] transition-colors"
          >
            OpsMemory
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#5A606B] shrink-0" />
          {pathnames.length === 0 ? (
            <span className="text-[#EDEDED] font-medium">Incident Intelligence</span>
          ) : (
            pathnames.map((part, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              const title = getBreadcrumbTitle(part);

              return (
                <React.Fragment key={routeTo}>
                  {isLast ? (
                    <span className="text-[#EDEDED] font-medium truncate max-w-[180px] sm:max-w-none">
                      {title}
                    </span>
                  ) : (
                    <>
                      <Link
                        to={routeTo}
                        className="text-[#8E95A0] hover:text-[#EDEDED] transition-colors"
                      >
                        {title}
                      </Link>
                      <ChevronRight className="w-3.5 h-3.5 text-[#5A606B] shrink-0" />
                    </>
                  )}
                </React.Fragment>
              );
            })
          )}
        </nav>
      </div>

      {/* Right: Hindsight status, Notification icon, Settings icon, User avatar */}
      <div className="flex items-center gap-3">
        {/* Hindsight Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#17191C] border border-[#272A2F] text-[11px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#84E071] animate-pulse-subtle"></span>
          <span className="text-[#EDEDED]">Hindsight Connected</span>
        </div>

        {/* Notifications Icon */}
        <button
          className="relative p-2 rounded-xl text-[#8E95A0] hover:text-[#EDEDED] hover:bg-[#17191C] transition-colors"
          title="Incident Alerts"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#84E071]"></span>
        </button>

        {/* Settings Icon */}
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-xl text-[#8E95A0] hover:text-[#EDEDED] hover:bg-[#17191C] transition-colors"
          title="Settings"
          aria-label="Open settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User avatar */}
        <div className="w-7 h-7 rounded-full bg-[#17191C] border border-[#272A2F] flex items-center justify-center text-xs font-mono font-semibold text-[#84E071]">
          S
        </div>
      </div>
    </header>
  );
}
