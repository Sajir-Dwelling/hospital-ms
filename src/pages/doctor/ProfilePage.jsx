import { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getMe().then(res => {
      setForm(res.data.user);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const res = await authAPI.updateMe({
        name: form.name, phone: form.phone,
        address: form.address, department: form.department,
        qualification: form.qualification, experience: form.experience,
      });
      setForm(res.data.user);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  };

  const inputStyle = {
    height: 42, border: '1.5px solid var(--border)', borderRadius: 9,
    padding: '0 12px', fontSize: 14, fontFamily: 'var(--font-sans)',
    color: 'var(--text)', outline: 'none', width: '100%',
  };

  if (loading) return <div style={{ padding: 40, color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>Loading profile...</div>;
  if (!form) return null;

  const initials = form.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 680 }}>

      {/* Profile card */}
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: 28, boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
          <div style={{
            width: 76, height: 76, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1B4FD8, #0B1437)',
            display: 'grid', placeItems: 'center',
            color: 'white', fontSize: 28, fontWeight: 700, flexShrink: 0,
          }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--navy)' }}>{form.name}</h2>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{form.email}</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
              {form.department && (
                <span style={{ background: 'rgba(27,79,216,.1)', color: 'var(--blue)', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>
                  🏥 {form.department}
                </span>
              )}
              {form.experience && (
                <span style={{ background: 'var(--surface)', color: 'var(--muted)', borderRadius: 6, padding: '3px 10px', fontSize: 12 }}>
                  {form.experience}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            style={{
              padding: '9px 22px', borderRadius: 10,
              background: editing ? 'var(--accent)' : 'var(--blue)',
              color: editing ? 'var(--navy)' : 'white',
              border: 'none', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}
          >
            {editing ? '✓ Save' : '✏️ Edit'}
          </button>
        </div>

        {saved && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10, padding: '10px 16px', marginBottom: 20, fontSize: 14, color: '#059669', fontWeight: 600 }}>
            ✓ Profile updated successfully!
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Full Name',     key: 'name',          type: 'text' },
            { label: 'Phone',         key: 'phone',         type: 'tel' },
            { label: 'Department',    key: 'department',    type: 'text' },
            { label: 'Qualification', key: 'qualification', type: 'text' },
            { label: 'Experience',    key: 'experience',    type: 'text' },
          ].map(({ label, key, type }) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .4 }}>{label}</label>
              {editing ? (
                <input type={type} value={form[key] || ''}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              ) : (
                <div style={{ fontSize: 15, color: 'var(--navy)', fontWeight: 500, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  {form[key] || '—'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: 24, boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: 20 }}>Change Password</h3>
        <ChangePasswordForm />
      </div>
    </div>
  );
}

function ChangePasswordForm() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) { setErr('Passwords do not match'); return; }
    try {
      await authAPI.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setMsg('Password updated!');
      setErr('');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
      setTimeout(() => setMsg(''), 2500);
    } catch (error) {
      setErr(error.message || 'Failed to update password');
    }
  };

  const inputStyle = {
    height: 42, border: '1.5px solid var(--border)', borderRadius: 10,
    padding: '0 14px', fontSize: 14, fontFamily: 'var(--font-sans)',
    color: 'var(--text)', outline: 'none', width: '100%',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[
        { label: 'Current Password',     key: 'currentPassword' },
        { label: 'New Password',         key: 'newPassword' },
        { label: 'Confirm New Password', key: 'confirm' },
      ].map(({ label, key }) => (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{label}</label>
          <input type="password" value={form[key]}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--blue)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      ))}
      {err && <div style={{ color: '#DC2626', fontSize: 13 }}>{err}</div>}
      {msg && <div style={{ color: '#059669', fontSize: 13, fontWeight: 600 }}>{msg}</div>}
      <button type="submit" style={{ alignSelf: 'flex-start', padding: '10px 24px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
        Update Password
      </button>
    </form>
  );
}
