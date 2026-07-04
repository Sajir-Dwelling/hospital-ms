import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import s from './AdminLayout.module.css';

const NAV = [
  {
    section: 'Main',
    items: [
      { key: 'overview',      label: 'Dashboard',    icon: '🏠' },
      { key: 'appointments',  label: 'Appointments',  icon: '📅', badge: '6' },
    ],
  },
  {
    section: 'Management',
    items: [
      { key: 'doctors',   label: 'Doctors',   icon: '👨‍⚕️' },
      { key: 'patients',  label: 'Patients',  icon: '🧑‍⚕️' },
      { key: 'billing',   label: 'Billing',   icon: '💳' },
    ],
  },
  {
    section: 'System',
    items: [
      { key: 'settings', label: 'Settings', icon: '⚙️' },
    ],
  },
];

const PAGE_TITLES = {
  overview:     { title: 'Dashboard',    sub: 'Welcome back, Admin' },
  appointments: { title: 'Appointments', sub: 'Manage all appointments' },
  doctors:      { title: 'Doctors',      sub: 'Manage doctor profiles' },
  patients:     { title: 'Patients',     sub: 'View & manage patients' },
  billing:      { title: 'Billing',      sub: 'Invoices & payments' },
  settings:     { title: 'Settings',     sub: 'System configuration' },
};

export default function AdminLayout({ page, onNavigate, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const { title, sub } = PAGE_TITLES[page] || PAGE_TITLES.overview;

  const initials = (user?.name || 'AD').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={s.layout}>
      {/* Overlay for mobile */}
      {sidebarOpen && <div className={s.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
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
                {item.badge && <span className={s.navBadge}>{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}

        <div className={s.sidebarFooter}>
          <div className={s.userCard}>
            <div className={s.userAvatar}>{initials}</div>
            <div>
              <div className={s.userName}>{user?.name || 'Admin'}</div>
              <div className={s.userRole}>Administrator</div>
            </div>
            <button className={s.logoutBtn} onClick={handleLogout} title="Logout">⏻</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className={s.main}>
        <header className={s.topbar}>
          <button className={s.hamburger} onClick={() => setSidebarOpen(o => !o)}>☰</button>
          <div>
            <span className={s.topbarTitle}>{title}</span>
            <span className={s.topbarSub}> / {sub}</span>
          </div>
          <div className={s.topbarRight}>
            <button className={s.topbarBtn} title="Search">🔍</button>
            <button className={s.topbarBtn} title="Notifications">
              🔔
              <span className={s.notifDot} />
            </button>
            <div className={s.userAvatar} style={{ width:36, height:36, fontSize:13 }}>{initials}</div>
          </div>
        </header>

        <div className={s.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
