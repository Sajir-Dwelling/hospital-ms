import { useState } from 'react';
import s from './Admin.module.css';

export default function SettingsPage() {
  const [hospital, setHospital] = useState({
    name: 'MedCore Hospital', address: 'Dhaka, Bangladesh',
    phone: '09611-000000', email: 'info@medcore.com.bd',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
