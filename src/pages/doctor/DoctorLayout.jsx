import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import s from './DoctorLayout.module.css';

const NAV = [
  {
    section: 'Menu',
    items: [
      { key: 'overview',       label: 'Overview',          icon: '🏠' },
      { key: 'schedule',       label: "Today's Schedule",  icon: '📅' },
      { key: 'patients',       label: 'My Patients',       icon: '🧑‍⚕️' },
      { key: 'prescriptions',  label: 'Prescriptions',     icon: '💊' },
      { key: 'availability',   label: 'My Availability',   icon: '🗓️' },
      { key: 'profile',        label: 'My Profile',        icon: '👤' },
    ],
  },
];

const TITLES = {
  overview:      { title: 'Overview',         sub: 'Your day at a glance' },
  schedule:      { title: "Today's Schedule", sub: 'Manage your appointments' },
  patients:      { title: 'My Patients',      sub: 'All assigned patients' },
  prescriptions: { title: 'Prescriptions',    sub: 'Write & manage prescriptions' },
  availability:  { title: 'My Availability',  sub: 'Set your weekly schedule' },
  profile:       { title: 'My Profile',       sub: 'Personal & professional info' },
};

export default function DoctorLayout({ page, onNavigate, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const { title, sub } = TITLES[page] || TITLES.overview;
  const initials = (user?.name || 'DR').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={s.layout}>
      {sidebarOpen && <div className={s.overlay} onClick={() => setSidebarOpen(false)} />}

      <aside className={`${s.sidebar} ${sidebarOpen ? s.sidebarOpen : ''}`}>
        <div className={s.sidebarLogo}>
          <span className={s.logoIcon}>+</span>
          <span className={s.logoText}>MedCore <em>HMS</em></span>
        </div>

        {NAV.map(group => (
          <div className={s.navSection} key={group.section}>
            <div className={s.navLabel}>{group.section}</div>
            {group.items.map(item => (
              <button
                key={item.key}
                className={`${s.navItem} ${page === item.key ? s.navItemActive : ''}`}
                onClick={() => { onNavigate(item.key); setSidebarOpen(false); }}
              >
                <span className={s.navIcon}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        ))}

        <div className={s.sidebarFooter}>
          <div className={s.userCard}>
            <div className={s.userAvatar}>{initials}</div>
            <div>
              <div className={s.userName}>{user?.name || 'Doctor'}</div>
              <div className={s.userRole}>Doctor</div>
            </div>
            <button className={s.logoutBtn} onClick={handleLogout} title="Logout">⏻</button>
          </div>
        </div>
      </aside>

      <div className={s.main}>
        <header className={s.topbar}>
          <button className={s.hamburger} onClick={() => setSidebarOpen(o => !o)}>☰</button>
          <div>
            <span className={s.topbarTitle}>{title}</span>
            <span className={s.topbarSub}> / {sub}</span>
          </div>
          <div className={s.topbarRight}>
            <button className={s.topbarBtn} title="Notifications">
              🔔<span className={s.notifDot} />
            </button>
            <div style={{
              width:36, height:36, borderRadius:'50%',
              background:'var(--blue)', color:'white',
              display:'grid', placeItems:'center',
              fontWeight:700, fontSize:13,
            }}>{initials}</div>
          </div>
        </header>
        <div className={s.content}>{children}</div>
      </div>
    </div>
  );
}
