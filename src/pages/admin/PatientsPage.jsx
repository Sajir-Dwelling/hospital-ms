import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminAPI.getUsers({ role: 'patient', search }).then(res => {
      setPatients(res.data.users);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleToggle = async (id) => {
    await adminAPI.toggleUser(id);
    setPatients(prev => prev.map(p => p._id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient? This cannot be undone.')) return;
    await adminAPI.deleteUser(id);
    setPatients(prev => prev.filter(p => p._id !== id));
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          style={{ flex: 1, minWidth: 200, height: 40, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0 14px', fontSize: 14, fontFamily: 'var(--font-sans)', background: 'white', outline: 'none' }}
          placeholder="Search patient name or email…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>
                {['Name', 'Email', 'Age', 'Blood', 'Phone', 'Registered', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ background: 'var(--surface)', padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>Loading...</td></tr>}
              {!loading && patients.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>No patients found.</td></tr>}
              {patients.map((p, i) => (
                <tr key={p._id} style={{ borderBottom: i < patients.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>{p.email}</td>
                  <td style={{ padding: '14px 16px' }}>{p.age || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    {p.bloodGroup
                      ? <span style={{ background: '#EFF6FF', color: '#1D4ED8', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{p.bloodGroup}</span>
                      : '—'}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>{p.phone || '—'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: p.isActive ? '#ECFDF5' : '#FEF2F2', color: p.isActive ? '#059669' : '#DC2626', padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleToggle(p._id)} style={btn('#EFF6FF', '#1D4ED8')}>
                        {p.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleDelete(p._id)} style={btn('#FEF2F2', '#DC2626')}>Delete</button>
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
