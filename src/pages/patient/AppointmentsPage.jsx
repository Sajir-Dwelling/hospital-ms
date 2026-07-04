import { useState, useEffect } from 'react';
import { appointmentAPI } from '../../services/api';

const AVATAR_COLORS = ['#1B4FD8', '#06D6A0', '#F59E0B', '#8B5CF6', '#EF4444'];

function Badge({ status }) {
  const map = {
    Confirmed: { bg: '#ECFDF5', color: '#059669' },
    Pending:   { bg: '#FFFBEB', color: '#D97706' },
    Completed: { bg: '#EFF6FF', color: '#1D4ED8' },
    Cancelled: { bg: '#FEF2F2', color: '#DC2626' },
    'In Progress': { bg: '#F3E8FF', color: '#7C3AED' },
  };
  const s = map[status] || { bg: '#F3F4F6', color: '#6B7280' };
  return <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{status}</span>;
}

export default function AppointmentsPage({ onNavigate }) {
  const [tab, setTab] = useState('upcoming');
  const [search, setSearch] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    appointmentAPI.getAll().then(res => {
      setAppointments(res.data.appointments);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter(a => ['Pending', 'Confirmed', 'In Progress'].includes(a.status));
  const past = appointments.filter(a => ['Completed', 'Cancelled'].includes(a.status));
  const list = tab === 'upcoming' ? upcoming : past;

  const filtered = list.filter(a =>
    a.doctor?.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor?.department?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCancel = async (id) => {
    await appointmentAPI.cancel(id);
    setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'Cancelled' } : a));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'white', borderRadius: 12, padding: 4, border: '1px solid var(--border)', width: 'fit-content' }}>
        {[['upcoming', `Upcoming (${upcoming.length})`], ['past', `Past (${past.length})`]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '8px 22px', borderRadius: 9, border: 'none',
            background: tab === key ? 'var(--blue)' : 'transparent',
            color: tab === key ? 'white' : 'var(--muted)',
            fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          style={{ flex: 1, minWidth: 180, height: 40, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0 14px', fontSize: 14, fontFamily: 'var(--font-sans)', background: 'white', outline: 'none' }}
          placeholder="Search doctor or department…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <button onClick={() => onNavigate('book')} style={{ height: 40, padding: '0 20px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
          + Book New
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: '48px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          No appointments found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((appt, i) => (
            <div key={appt._id} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {appt.doctor?.avatar || appt.doctor?.name?.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 16 }}>{appt.doctor?.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{appt.doctor?.department}</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 100 }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>Date</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{appt.date}</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 80 }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>Time</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{appt.time}</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 60 }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Status</div>
                  <Badge status={appt.status} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {tab === 'upcoming' ? (
                    <button onClick={() => handleCancel(appt._id)} style={{ padding: '4px 12px', borderRadius: 6, border: 'none', background: '#FEF2F2', color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
                  ) : (
                    <>
                      {appt.status === 'Completed' && (
                        <button onClick={() => onNavigate('book')} style={{ padding: '4px 12px', borderRadius: 6, border: 'none', background: '#ECFDF5', color: '#059669', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Book Again</button>
                      )}
                    </>
                  )}
                </div>
              </div>
              {appt.reason && (
                <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--surface)', borderRadius: 8, fontSize: 13, color: 'var(--muted)' }}>
                  Reason: {appt.reason}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
