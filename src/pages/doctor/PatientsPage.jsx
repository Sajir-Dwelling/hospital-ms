import { useState, useEffect } from 'react';
import { appointmentAPI } from '../../services/api';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Get all appointments for this doctor and extract unique patients
    appointmentAPI.getAll().then(res => {
      const appts = res.data.appointments;
      const seen = new Set();
      const unique = [];
      appts.forEach(a => {
        if (a.patient && !seen.has(a.patient._id)) {
          seen.add(a.patient._id);
          // Attach last appointment info
          unique.push({
            ...a.patient,
            lastVisit: a.date,
            lastStatus: a.status,
            totalVisits: appts.filter(x => x.patient?._id === a.patient._id).length,
          });
        }
      });
      setPatients(unique);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.bloodGroup?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'start' }}>

      {/* Patient list */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          style={{ height: 40, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0 14px', fontSize: 14, fontFamily: 'var(--font-sans)', background: 'white', outline: 'none', width: '100%' }}
          placeholder="Search patient, email, blood group…"
          value={search} onChange={e => setSearch(e.target.value)}
        />

        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  {['Name', 'Age', 'Blood', 'Phone', 'Last Visit', 'Visits', 'Status'].map(h => (
                    <th key={h} style={{ background: 'var(--surface)', padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>Loading...</td></tr>}
                {!loading && filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>No patients found.</td></tr>}
                {filtered.map((p, i) => (
                  <tr key={p._id}
                    onClick={() => setSelected(p)}
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', background: selected?._id === p._id ? 'var(--surface)' : 'white' }}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: '14px 16px' }}>{p.age || '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {p.bloodGroup
                        ? <span style={{ background: '#EFF6FF', color: '#1D4ED8', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{p.bloodGroup}</span>
                        : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>{p.phone || '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>{p.lastVisit || '—'}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--blue)' }}>{p.totalVisits}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: p.isActive ? '#ECFDF5' : '#FEF2F2', color: p.isActive ? '#059669' : '#DC2626', padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patient detail panel */}
      {selected && (
        <div style={{ width: 300, background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: 24, position: 'sticky', top: 80, boxShadow: '0 1px 4px rgba(11,20,55,.06)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', fontSize: '1.1rem' }}>Patient Info</h3>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--muted)', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--blue)', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700, fontSize: 18 }}>
              {selected.avatar || selected.name?.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 16 }}>{selected.name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{selected.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { label: 'Age',         value: selected.age || '—' },
              { label: 'Blood Group', value: selected.bloodGroup || '—' },
              { label: 'Phone',       value: selected.phone || '—' },
              { label: 'Address',     value: selected.address || '—' },
              { label: 'Total Visits',value: selected.totalVisits },
              { label: 'Last Visit',  value: selected.lastVisit || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', textAlign: 'right', maxWidth: 160 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
