import { useState, useEffect } from 'react';
import { appointmentAPI } from '../../services/api';

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

const TABS = ['All', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export default function SchedulePage({ onNavigate }) {
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    appointmentAPI.getToday().then(res => {
      setAppointments(res.data.appointments);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = tab === 'All' ? appointments : appointments.filter(a => a.status === tab);

  const handleStatus = async (id, status) => {
    await appointmentAPI.updateStatus(id, status);
    setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
  };

  const handleCancel = async (id) => {
    await appointmentAPI.cancel(id);
    setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'Cancelled' } : a));
    if (selected?._id === id) setSelected(prev => ({ ...prev, status: 'Cancelled' }));
  };

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'start' }}>

      {/* Left — appointment list */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '7px 16px', borderRadius: 8, border: 'none',
              background: tab === t ? 'var(--blue)' : 'white',
              color: tab === t ? 'white' : 'var(--muted)',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              border: tab === t ? 'none' : '1px solid var(--border)',
            }}>{t}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: '48px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            No {tab !== 'All' ? tab.toLowerCase() : ''} appointments today.
          </div>
        ) : (
          filtered.map(appt => (
            <div key={appt._id}
              onClick={() => setSelected(appt)}
              style={{
                background: 'white', border: `1.5px solid ${selected?._id === appt._id ? 'var(--blue)' : 'var(--border)'}`,
                borderRadius: 14, padding: '18px 20px', cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(11,20,55,.06)', transition: 'border-color .15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--blue)', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {appt.patient?.avatar || appt.patient?.name?.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 15 }}>{appt.patient?.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{appt.type} · Age {appt.patient?.age || '—'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{appt.time}</div>
                  <div style={{ marginTop: 4 }}><Badge status={appt.status} /></div>
                </div>
              </div>
              {appt.reason && (
                <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--surface)', borderRadius: 8, fontSize: 13, color: 'var(--muted)' }}>
                  {appt.reason}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Right — patient detail panel */}
      {selected && (
        <div style={{ width: 320, background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: 24, position: 'sticky', top: 80, boxShadow: '0 1px 4px rgba(11,20,55,.06)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', fontSize: '1.1rem' }}>Patient Details</h3>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--muted)', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--blue)', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700, fontSize: 18 }}>
              {selected.patient?.avatar || selected.patient?.name?.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 16 }}>{selected.patient?.name}</div>
              <Badge status={selected.status} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Age',         value: selected.patient?.age || '—' },
              { label: 'Blood Group', value: selected.patient?.bloodGroup || '—' },
              { label: 'Phone',       value: selected.patient?.phone || '—' },
              { label: 'Time',        value: selected.time },
              { label: 'Type',        value: selected.type },
              { label: 'Reason',      value: selected.reason || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {selected.status === 'Pending' && (
              <button onClick={() => handleStatus(selected._id, 'In Progress')}
                style={actionBtn('var(--blue)', 'white')}>Start Consultation</button>
            )}
            {selected.status === 'In Progress' && (
              <>
                <button onClick={() => { handleStatus(selected._id, 'Completed'); onNavigate('prescriptions'); }}
                  style={actionBtn('var(--accent)', 'var(--navy)')}>Complete & Prescribe</button>
                <button onClick={() => handleStatus(selected._id, 'Completed')}
                  style={actionBtn('#ECFDF5', '#059669')}>Mark Completed</button>
              </>
            )}
            {!['Cancelled', 'Completed'].includes(selected.status) && (
              <button onClick={() => handleCancel(selected._id)}
                style={actionBtn('#FEF2F2', '#DC2626')}>Cancel Appointment</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const actionBtn = (bg, color) => ({
  width: '100%', height: 40, background: bg, color,
  border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'opacity .15s',
});
