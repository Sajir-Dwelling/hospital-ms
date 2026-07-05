import { useState } from 'react';
import s from './Admin.module.css';

export default function SettingsPage() {
  const [hospital, setHospital] = useState({
    name: 'MedCore Hospital', address: 'Dhaka, Bangladesh',
    phone: '09611-000000', email: 'info@medcore.com.bd',
  });
  const [saved, setSaved] = useState(false);

const handleSave = async () => {
    try {
      await import('../../services/api').then(({ authAPI }) =>
        authAPI.updateMe({
          name: hospital.name,
          address: hospital.address,
          phone: hospital.phone,
          email: hospital.email,
        })
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err.message || 'Failed to save');
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24, maxWidth:700 }}>

      {/* Hospital Info */}
      <div className={s.settingsCard}>
        <div className={s.settingsCardHeader}>
          <span>🏥</span>
          <div>
            <div className={s.settingsCardTitle}>Hospital Information</div>
            <div className={s.settingsCardSub}>Basic details about your hospital</div>
          </div>
        </div>
        <div className={s.settingsFields}>
          {[
            { label:'Hospital Name', key:'name', type:'text' },
            { label:'Address',       key:'address', type:'text' },
            { label:'Phone',         key:'phone', type:'tel' },
            { label:'Email',         key:'email', type:'email' },
          ].map(({ label, key, type }) => (
            <div className={s.modalField} key={key}>
              <label>{label}</label>
              <input type={type} value={hospital[key]}
                onChange={e => setHospital(h => ({ ...h, [key]: e.target.value }))} />
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className={s.settingsCard}>
        <div className={s.settingsCardHeader}>
          <span>🔔</span>
          <div>
            <div className={s.settingsCardTitle}>Notifications</div>
            <div className={s.settingsCardSub}>Control what alerts you receive</div>
          </div>
        </div>
        <div className={s.toggleList}>
          {[
            'New appointment bookings',
            'Appointment cancellations',
            'New patient registrations',
            'Invoice payment received',
            'Low pharmacy stock alerts',
          ].map(label => (
            <ToggleRow key={label} label={label} />
          ))}
        </div>
      </div>

      {/* Security */}
      <div className={s.settingsCard}>
        <div className={s.settingsCardHeader}>
          <span>🔒</span>
          <div>
            <div className={s.settingsCardTitle}>Security</div>
            <div className={s.settingsCardSub}>Manage access and password settings</div>
          </div>
        </div>
        <div className={s.settingsFields}>
          {[
            { label:'Current Password', key:'cp', type:'password', placeholder:'••••••••' },
            { label:'New Password',     key:'np', type:'password', placeholder:'••••••••' },
            { label:'Confirm Password', key:'cnp', type:'password', placeholder:'••••••••' },
          ].map(({ label, key, type, placeholder }) => (
            <div className={s.modalField} key={key}>
              <label>{label}</label>
              <input type={type} placeholder={placeholder} />
            </div>
          ))}
        </div>
      </div>
	
      <ChangePasswordSection />

      {/* Save */}
      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        <button className={s.modalSaveBtn} style={{ width:'auto', padding:'10px 28px' }} onClick={handleSave}>
          Save Changes
        </button>
        {saved && (
          <span style={{ color:'var(--accent)', fontWeight:600, fontSize:14 }}>✓ Changes saved!</span>
        )}
      </div>
    </div>
  );
}

function ChangePasswordSection() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) { setErr('Passwords do not match'); return; }
    try {
      const { authAPI } = await import('../../services/api');
      await authAPI.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setMsg('Password updated successfully!');
      setErr('');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
      setTimeout(() => setMsg(''), 3000);
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
    <div className={s.settingsCard} style={{ marginTop: 0 }}>
      <div className={s.settingsCardHeader}>
        <span>🔒</span>
        <div>
          <div className={s.settingsCardTitle}>Change Password</div>
          <div className={s.settingsCardSub}>Update your admin password</div>
        </div>
      </div>
      <div className={s.settingsFields}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Current Password', key: 'currentPassword' },
            { label: 'New Password', key: 'newPassword' },
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
      </div>
    </div>
  );
}

function ToggleRow({ label }) {
  const [on, setOn] = useState(true);
  return (
    <div className={s.toggleRow}>
      <span>{label}</span>
      <button
        className={`${s.toggle} ${on ? s.toggleOn : ''}`}
        onClick={() => setOn(o => !o)}
      >
        <span className={s.toggleThumb} />
      </button>
    </div>
  );
}
