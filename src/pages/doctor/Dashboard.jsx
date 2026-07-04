import { useState } from 'react';
import DoctorLayout from './DoctorLayout';
import OverviewPage from './OverviewPage';
import SchedulePage from './SchedulePage';
import PatientsPage from './PatientsPage';
import PrescriptionsPage from './PrescriptionsPage';
import AvailabilityPage from './AvailabilityPage';
import ProfilePage from './ProfilePage';

export default function DoctorDashboard() {
  const [page, setPage] = useState('overview');

  const pages = {
    overview:      <OverviewPage      onNavigate={setPage} />,
    schedule:      <SchedulePage      onNavigate={setPage} />,
    patients:      <PatientsPage      onNavigate={setPage} />,
    prescriptions: <PrescriptionsPage />,
    availability:  <AvailabilityPage />,
    profile:       <ProfilePage />,
  };

  return (
    <DoctorLayout page={page} onNavigate={setPage}>
      {pages[page] || pages.overview}
    </DoctorLayout>
  );
}
