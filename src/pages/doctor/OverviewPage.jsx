import { useState, useEffect } from 'react';
import { appointmentAPI, authAPI } from '../../services/api';

function Badge({ status }) {
  const map = {
    Confirmed:     { bg: '#ECFDF5', color: '#059669' },
    Completed:     { bg: '#EFF6FF', color: '#1D4ED8' },
    Pending:       { bg: '#FFFBEB', color: '#D97706' },
    Cancelled:     { bg: '#FEF2F2', color: '#DC2626' },
    'In Progress': { bg: '#F3E8FF', color: '#7C3AED' },
  };
  const s = map[status] || { bg: '#F3F4F6', color: '#6B7280' };
  return <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{status}</span>;
}

export default function OverviewPage({ onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [todayAppts, setTodayAppts] = useState([]);
  const [allAppts, setAllAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      authAPI.getMe(),
      appointmentAPI.getToday(),
      appointmentAPI.getAll(),
    ]).then(([profileRes, todayRes, allRes]) => {
      setProfile(profileRes.data.user);
      setTodayAppts(todayRes.data.appointments);
      setAllAppts(allRes.data.appointments);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>Loading...</div>;

  const completed  = allAppts.filter(a => a.status === 'Completed').length;
  const pending    = todayAppts.filter(a => a.status === 'Pending').length;
  const inProgress = todayAppts.filter(a => a.status === 'In Progress').length;

  const stats = [
    { label: "Today's Patients", value: todayAppts.length,  icon: '📅', color: '#1B4FD8' },
    { label: 'Completed',        value: completed,           icon: '✅', color: '#059669' },
    { label: 'Pending',          value: pending,             icon: '⏳', color: '#F59E0B' },
    { label: 'In Progress',      value: inProgress,          icon: '🔄', color: '#7C3AED' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1B4FD8 100%)',
        borderRadius: 16, padding: '28px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 13, marginBottom: 6 }}>Welcome back 👋</p>
          <h2 style={{ color: 'white', fontFamily: 'var(--font-serif)', fontSize: '1.7rem', marginBottom: 8 }}>
            {profile?.name || 'Doctor'}
          </h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {profile?.department && <span style={{ color: 'rgba(255,255,255,.75)', fontSize: 13 }}>🏥 {profile.department}</span>}
            {profile?.qualification && <span style={{ color: 'rgba(255,255,255,.75)', fontSize: 13 }}>🎓 {profile.qualification}</span>}
            {profile?.experience && <span style={{ color: 'rgba(255,255,255,.75)', fontSize: 13 }}>⏱ {profile.experience}</span>}
          </div>
        </div>
        <button onClick={() => onNavigate('schedule')}
          style={{ padding: '10px 22px', background: 'var(--accent)', color: 'var(--navy)', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          View Today's Schedule
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
        {stats.map(c => (
          <div key={c.label} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c.color}18`, color: c.color, display: 'grid', placeItems: 'center', fontSize: 20, marginBottom: 12 }}>{c.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--navy)', fontFamily: 'var(--font-serif)' }}>{c.value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Today's schedule preview */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--navy)' }}>Today's Schedule</span>
          <button onClick={() => onNavigate('schedule')} style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
        </div>
        {todayAppts.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: '48px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 14, boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
            No appointments today.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {todayAppts.slice(0, 5).map(appt => (
              <div key={appt._id} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--blue)', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                  {appt.patient?.avatar || appt.patient?.name?.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{appt.patient?.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{appt.type} · {appt.reason || 'No reason provided'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{appt.time}</div>
                </div>
                <Badge status={appt.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
