import { useState, useEffect } from 'react';
import { adminAPI, authAPI } from '../../services/api';

const AVATAR_COLORS = ['#1B4FD8', '#06D6A0', '#F59E0B', '#8B5CF6', '#EF4444', '#0891B2'];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: 'doctor123', department: '', phone: '', qualification: '', experience: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminAPI.getUsers({ role: 'doctor', search }).then(res => {
      setDoctors(res.data.users);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleAdd = async () => {
    if (!form.name || !form.email) { alert('Name and email are required'); return; }
    setSaving(true);
    try {
      await authAPI.register({ ...form, role: 'doctor' });
      setShowModal(false);
      setForm({ name: '', email: '', password: 'doctor123', department: '', phone: '', qualification: '', experience: '' });
      load();
    } catch (err) {
      alert(err.message || 'Failed to add doctor');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    await adminAPI.toggleUser(id);
    setDoctors(prev => prev.map(d => d._id === id ? { ...d, isActive: !d.isActive } : d));
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          style={{ flex: 1, minWidth: 200, height: 40, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0 14px', fontSize: 14, fontFamily: 'var(--font-sans)', background: 'white', outline: 'none' }}
          placeholder="Search doctor or department…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <button onClick={() => setShowModal(true)} style={{ height: 40, padding: '0 20px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
          + Add Doctor
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {loading && <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>Loading...</p>}
        {!loading && doctors.length === 0 && <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>No doctors found.</p>}
        {doctors.map((doc, i) => (
          <div key={doc._id} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                {doc.avatar || doc.name?.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>{doc.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{doc.department || 'No department'}</div>
              </div>
              <span style={{ background: doc.isActive ? '#ECFDF5' : '#FEF2F2', color: doc.isActive ? '#059669' : '#DC2626', padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
                {doc.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div style={{ padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .4, marginBottom: 2 }}>Phone</div>
                <div style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 500 }}>{doc.phone || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .4, marginBottom: 2 }}>Experience</div>
                <div style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 500 }}>{doc.experience || '—'}</div>
              </div>
            </div>
            <button onClick={() => handleToggle(doc._id)}
              style={{ height: 34, background: doc.isActive ? '#FEF2F2' : '#ECFDF5', color: doc.isActive ? '#DC2626' : '#059669', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>
              {doc.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11,20,55,.45)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'grid', placeItems: 'center', padding: 20 }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'white', borderRadius: 18, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(11,20,55,.2)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'white' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--navy)' }}>Add New Doctor</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--muted)', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Full Name *',    key: 'name',          type: 'text',  ph: 'Dr. Full Name' },
                { label: 'Email *',        key: 'email',         type: 'email', ph: 'doctor@email.com' },
                { label: 'Password',       key: 'password',      type: 'text',  ph: 'Initial password' },
                { label: 'Department',     key: 'department',    type: 'text',  ph: 'e.g. Cardiology' },
                { label: 'Phone',          key: 'phone',         type: 'tel',   ph: '01711-XXXXXX' },
                { label: 'Qualification',  key: 'qualification', type: 'text',  ph: 'MBBS, MD' },
                { label: 'Experience',     key: 'experience',    type: 'text',  ph: '5 years' },
              ].map(({ label, key, type, ph }) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{label}</label>
                  <input type={type} placeholder={ph} value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ height: 42, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0 12px', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' }}
                    onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'white', color: 'var(--muted)', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleAdd} disabled={saving} style={{ padding: '10px 24px', borderRadius: 10, background: 'var(--blue)', color: 'white', border: 'none', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>
                {saving ? 'Saving...' : 'Save Doctor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
