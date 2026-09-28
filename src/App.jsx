import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import LoadingState from './components/ui/LoadingState';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Incidents = lazy(() => import('./pages/Incidents'));
const NewIncident = lazy(() => import('./pages/NewIncident'));
const Investigation = lazy(() => import('./pages/Investigation'));
const Memory = lazy(() => import('./pages/Memory'));
const Settings = lazy(() => import('./pages/Settings'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route
            index
            element={
              <Suspense fallback={<LoadingState title="Loading dashboard..." />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="incidents"
            element={
              <Suspense fallback={<LoadingState title="Loading incidents..." />}>
                <Incidents />
              </Suspense>
            }
          />
          <Route
            path="incidents/new"
            element={
              <Suspense fallback={<LoadingState title="Loading incident report form..." />}>
                <NewIncident />
              </Suspense>
            }
          />
          <Route
            path="incidents/:id"
            element={
              <Suspense fallback={<LoadingState title="Querying Hindsight memory bank..." isMemory={true} />}>
                <Investigation />
              </Suspense>
            }
          />
          <Route
            path="memory"
            element={
              <Suspense fallback={<LoadingState title="Accessing Hindsight memory..." isMemory={true} />}>
                <Memory />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<LoadingState title="Loading settings..." />}>
                <Settings />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
