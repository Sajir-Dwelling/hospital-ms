import { useState } from 'react';
import AdminLayout from './AdminLayout';
import OverviewPage from './OverviewPage';
import AppointmentsPage from './AppointmentsPage';
import DoctorsPage from './DoctorsPage';
import PatientsPage from './PatientsPage';
import BillingPage from './BillingPage';
import SettingsPage from './SettingsPage';

const PAGES = {
  overview:     <OverviewPage />,
  appointments: <AppointmentsPage />,
  doctors:      <DoctorsPage />,
  patients:     <PatientsPage />,
  billing:      <BillingPage />,
  settings:     <SettingsPage />,
};

export default function AdminDashboard() {
  const [page, setPage] = useState('overview');
  return (
    <AdminLayout page={page} onNavigate={setPage}>
      {PAGES[page] || PAGES.overview}
    </AdminLayout>
  );
}
