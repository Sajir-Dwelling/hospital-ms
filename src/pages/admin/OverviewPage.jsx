import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

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
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(res => {
      setStats(res.data.stats);
      setRecentAppointments(res.data.recentAppointments);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>Loading dashboard...</div>;

  const cards = [
    { label: 'Total Patients',     value: stats?.totalPatients ?? 0,      icon: '🧑‍⚕️', color: '#1B4FD8' },
    { label: 'Total Doctors',      value: stats?.totalDoctors ?? 0,        icon: '👨‍⚕️', color: '#06D6A0' },
    { label: 'Appointments Today', value: stats?.todayAppointments ?? 0,   icon: '📅',  color: '#F59E0B' },
    { label: 'Total Revenue',      value: `৳${stats?.revenue?.total ?? 0}`,icon: '💰',  color: '#8B5CF6' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: '22px', boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${c.color}18`, color: c.color, display: 'grid', placeItems: 'center', fontSize: 22, marginBottom: 14 }}>{c.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--navy)', fontFamily: 'var(--font-serif)' }}>{c.value}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Revenue', value: `৳${stats?.revenue?.total ?? 0}`,   color: '#1B4FD8' },
          { label: 'Collected',     value: `৳${stats?.revenue?.paid ?? 0}`,    color: '#059669' },
          { label: 'Pending',       value: `৳${stats?.revenue?.pending ?? 0}`, color: '#D97706' },
        ].map(c => (
          <div key={c.label} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.color, fontFamily: 'var(--font-serif)' }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Recent appointments */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--navy)' }}>Recent Appointments</span>
          <button onClick={() => onNavigate('appointments')} style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  {['Patient', 'Doctor', 'Department', 'Date', 'Time', 'Status'].map(h => (
                    <th key={h} style={{ background: 'var(--surface)', padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentAppointments.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>No appointments yet.</td></tr>
                )}
                {recentAppointments.map((a, i) => (
                  <tr key={a._id} style={{ borderBottom: i < recentAppointments.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{a.patient?.name}</td>
                    <td style={{ padding: '14px 16px' }}>{a.doctor?.name}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: 13 }}>{a.doctor?.department}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: 13 }}>{a.date}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: 13 }}>{a.time}</td>
                    <td style={{ padding: '14px 16px' }}><Badge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
