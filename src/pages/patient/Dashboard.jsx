import { useState } from 'react';
import PatientLayout from './PatientLayout';
import OverviewPage from './OverviewPage';
import AppointmentsPage from './AppointmentsPage';
import BookPage from './BookPage';
import PrescriptionsPage from './PrescriptionsPage';
import BillingPage from './BillingPage';
import ProfilePage from './ProfilePage';

export default function PatientDashboard() {
  const [page, setPage] = useState('overview');

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
      {pages[page] || pages.overview}
    </PatientLayout>
  );
}
