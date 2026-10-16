import { useState, useCallback, useRef } from 'react';
import PatientLayout from './PatientLayout';
import OverviewPage from './OverviewPage';
import AppointmentsPage from './AppointmentsPage';
import BookPage from './BookPage';
import PrescriptionsPage from './PrescriptionsPage';
import BillingPage from './BillingPage';
import ProfilePage from './ProfilePage';
import useRealtime from '../../hooks/useRealtime';

const STATUS_TEXT = {
  Confirmed: 'Your appointment was confirmed',
  Cancelled: 'Your appointment was cancelled',
  Completed: 'Your appointment is complete',
  'In Progress': 'Your consultation has started',
};

export default function PatientDashboard() {
  const [page, setPage] = useState('overview');
  const [tick, setTick] = useState(0);      // bump -> the open page reloads its data
  const [toast, setToast] = useState('');
  const pageRef = useRef(page);
  pageRef.current = page;
  const timer = useRef(null);

  const refresh = useCallback(() => {
    // don't wipe a booking form the patient is filling in
    if (pageRef.current !== 'book') setTick(t => t + 1);
  }, []);

  const showToast = useCallback((msg) => {
    if (!msg) return;
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 5000);
  }, []);

  useRealtime({
    'appointment:updated': (p) => { refresh(); showToast(STATUS_TEXT[p?.status] || 'Your appointment was updated'); },
    'invoice:updated':     (p) => { refresh(); showToast(p?.reason === 'paid' ? 'Payment received' : 'A new bill was added'); },
    reconnect:             refresh,
  });

  const pages = {
    overview:      <OverviewPage      onNavigate={setPage} />,
    appointments:  <AppointmentsPage  onNavigate={setPage} />,
    book:          <BookPage          onNavigate={setPage} />,
    prescriptions: <PrescriptionsPage />,
    billing:       <BillingPage />,
    profile:       <ProfilePage />,
  };

  return (
    <PatientLayout page={page} onNavigate={setPage}>
      <div key={`${page}-${tick}`}>{pages[page] || pages.overview}</div>
      {toast && (
        <div style={{
          position: 'fixed', right: 24, bottom: 24, zIndex: 100,
          background: '#0B1437', color: 'white', padding: '12px 18px', borderRadius: 12,
          fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-sans)',
          boxShadow: '0 8px 24px rgba(11,20,55,.25)',
        }}>🔔 {toast}</div>
      )}
    </PatientLayout>
  );
}
