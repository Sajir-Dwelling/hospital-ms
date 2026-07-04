import { useState, useEffect } from 'react';
import { appointmentAPI, billingAPI, authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AVATAR_COLORS = ['#1B4FD8', '#06D6A0', '#F59E0B', '#8B5CF6', '#EF4444'];

function Badge({ status }) {
  const map = {
    Confirmed: { bg: '#ECFDF5', color: '#059669' },
    Pending:   { bg: '#FFFBEB', color: '#D97706' },
    Completed: { bg: '#EFF6FF', color: '#1D4ED8' },
    Cancelled: { bg: '#FEF2F2', color: '#DC2626' },
    Paid:      { bg: '#ECFDF5', color: '#059669' },
    Overdue:   { bg: '#FEF2F2', color: '#DC2626' },
  };
  const s = map[status] || { bg: '#F3F4F6', color: '#6B7280' };
  return (
    <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
      {status}
    </span>
  );
}

export default function OverviewPage({ onNavigate }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      authAPI.getMe(),
      appointmentAPI.getAll({ status: 'Pending,Confirmed' }),
      billingAPI.getAll(),
    ]).then(([profileRes, apptRes, billRes]) => {
      setProfile(profileRes.data.user);
      setUpcoming(apptRes.data.appointments.slice(0, 3));
      setInvoices(billRes.data.invoices.slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>Loading...</div>;

  const name = profile?.name || user?.name || 'Patient';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1B4FD8 100%)',
        borderRadius: 16, padding: '28px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 13, marginBottom: 6 }}>Good day 👋</p>
          <h2 style={{ color: 'white', fontFamily: 'var(--font-serif)', fontSize: '1.7rem', marginBottom: 8 }}>{name}</h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {profile?.bloodGroup && <span style={{ color: 'rgba(255,255,255,.75)', fontSize: 13 }}>🩸 {profile.bloodGroup}</span>}
            {profile?.age && <span style={{ color: 'rgba(255,255,255,.75)', fontSize: 13 }}>🎂 Age {profile.age}</span>}
            {profile?.phone && <span style={{ color: 'rgba(255,255,255,.75)', fontSize: 13 }}>📞 {profile.phone}</span>}
          </div>
        </div>
        <button
          onClick={() => onNavigate('book')}
          style={{ padding: '10px 22px', background: 'var(--accent)', color: 'var(--navy)', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
        >
          + Book Appointment
        </button>
      </div>

      {/* Upcoming appointments */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--navy)' }}>Upcoming Appointments</span>
          <button onClick={() => onNavigate('appointments')} style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
        </div>
        {upcoming.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: '48px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
            No upcoming appointments. <button onClick={() => onNavigate('book')} style={{ color: 'var(--blue)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Book one now</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {upcoming.map((appt, i) => (
              <div key={appt._id} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                  {appt.doctor?.avatar || appt.doctor?.name?.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 15 }}>{appt.doctor?.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{appt.doctor?.department}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: 14 }}>{appt.date}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{appt.time}</div>
                </div>
                <Badge status={appt.status} />
                <button
                  onClick={async () => {
                    await appointmentAPI.cancel(appt._id);
                    setUpcoming(prev => prev.filter(a => a._id !== appt._id));
                  }}
                  style={{ padding: '4px 12px', borderRadius: 6, border: 'none', background: '#FEF2F2', color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                >Cancel</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent bills */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--navy)' }}>Recent Bills</span>
          <button onClick={() => onNavigate('billing')} style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
        </div>
        {invoices.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: '32px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>No bills yet.</div>
        ) : (
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr>
                    {['Invoice', 'Doctor', 'Date', 'Amount', 'Status'].map(h => (
                      <th key={h} style={{ background: 'var(--surface)', padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv, i) => (
                    <tr key={inv._id} style={{ borderBottom: i < invoices.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--blue)', fontWeight: 600 }}>INV-{inv._id.slice(-4).toUpperCase()}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13 }}>{inv.doctor?.name}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>৳{inv.amount}</td>
                      <td style={{ padding: '14px 16px' }}><Badge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
