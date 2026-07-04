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

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentAPI.getAll().then(res => {
      setAppointments(res.data.appointments);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase();
    const matchSearch =
      a.patient?.name?.toLowerCase().includes(q) ||
      a.doctor?.name?.toLowerCase().includes(q) ||
      a.doctor?.department?.toLowerCase().includes(q);
    const matchFilter = filter === 'All' || a.status === filter;
    return matchSearch && matchFilter;
  });

  const handleCancel = async (id) => {
    await appointmentAPI.cancel(id);
    setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'Cancelled' } : a));
  };

  const handleConfirm = async (id) => {
    await appointmentAPI.updateStatus(id, 'Confirmed');
    setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'Confirmed' } : a));
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          style={{ flex: 1, minWidth: 200, height: 40, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0 14px', fontSize: 14, fontFamily: 'var(--font-sans)', background: 'white', outline: 'none' }}
          placeholder="Search patient, doctor, department…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select
          style={{ height: 40, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0 12px', fontSize: 14, fontFamily: 'var(--font-sans)', background: 'white', outline: 'none', cursor: 'pointer' }}
          value={filter} onChange={e => setFilter(e.target.value)}
        >
          {['All', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(v => <option key={v}>{v}</option>)}
        </select>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>
                {['Patient', 'Doctor', 'Department', 'Date', 'Time', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ background: 'var(--surface)', padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>Loading...</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>No appointments found.</td></tr>}
              {filtered.map((a, i) => (
                <tr key={a._id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{a.patient?.name}</td>
                  <td style={{ padding: '14px 16px' }}>{a.doctor?.name}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: 13 }}>{a.doctor?.department}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: 13 }}>{a.date}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: 13 }}>{a.time}</td>
                  <td style={{ padding: '14px 16px' }}><Badge status={a.status} /></td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {a.status === 'Pending' && (
                        <button onClick={() => handleConfirm(a._id)} style={btn('#ECFDF5', '#059669')}>Confirm</button>
                      )}
                      {!['Cancelled', 'Completed'].includes(a.status) && (
                        <button onClick={() => handleCancel(a._id)} style={btn('#FEF2F2', '#DC2626')}>Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const btn = (bg, color) => ({
  padding: '4px 10px', borderRadius: 6, border: 'none',
  background: bg, color, fontSize: 12, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'var(--font-sans)',
});
