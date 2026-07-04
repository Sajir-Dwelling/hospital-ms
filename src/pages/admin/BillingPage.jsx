import { useState, useEffect } from 'react';
import { billingAPI } from '../../services/api';

function Badge({ status }) {
  const map = {
    Paid:    { bg: '#ECFDF5', color: '#059669' },
    Pending: { bg: '#FFFBEB', color: '#D97706' },
    Overdue: { bg: '#FEF2F2', color: '#DC2626' },
  };
  const s = map[status] || { bg: '#F3F4F6', color: '#6B7280' };
  return <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{status}</span>;
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({ total: 0, paid: 0, pending: 0, overdue: 0 });
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    billingAPI.getAll().then(res => {
      setInvoices(res.data.invoices);
      setSummary(res.data.summary);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = invoices.filter(inv => {
    const q = search.toLowerCase();
    const matchSearch = inv.patient?.name?.toLowerCase().includes(q) || inv.doctor?.name?.toLowerCase().includes(q);
    const matchFilter = filter === 'All' || inv.status === filter;
    return matchSearch && matchFilter;
  });

  const handleMarkPaid = async (id) => {
    await billingAPI.markPaid(id);
    setInvoices(prev => prev.map(inv => inv._id === id ? { ...inv, status: 'Paid' } : inv));
    setSummary(prev => ({ ...prev, paid: prev.paid + (invoices.find(i => i._id === id)?.amount || 0) }));
  };

  const summaryCards = [
    { label: 'Total Revenue', value: `৳${summary.total}`,   icon: '💰', color: '#1B4FD8' },
    { label: 'Collected',     value: `৳${summary.paid}`,    icon: '✅', color: '#059669' },
    { label: 'Pending',       value: `৳${summary.pending}`, icon: '⏳', color: '#D97706' },
    { label: 'Overdue',       value: `৳${summary.overdue}`, icon: '⚠️', color: '#EF4444' },
  ];

  return (
    <>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {summaryCards.map(c => (
          <div key={c.label} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${c.color}18`, color: c.color, display: 'grid', placeItems: 'center', fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)', fontFamily: 'var(--font-serif)' }}>{c.value}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          style={{ flex: 1, minWidth: 200, height: 40, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0 14px', fontSize: 14, fontFamily: 'var(--font-sans)', background: 'white', outline: 'none' }}
          placeholder="Search patient or doctor…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select
          style={{ height: 40, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0 12px', fontSize: 14, fontFamily: 'var(--font-sans)', background: 'white', outline: 'none', cursor: 'pointer' }}
          value={filter} onChange={e => setFilter(e.target.value)}
        >
          {['All', 'Paid', 'Pending', 'Overdue'].map(v => <option key={v}>{v}</option>)}
        </select>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>
                {['Invoice ID', 'Patient', 'Doctor', 'Amount', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ background: 'var(--surface)', padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>Loading...</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>No invoices found.</td></tr>}
              {filtered.map((inv, i) => (
                <tr key={inv._id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--blue)', fontWeight: 600 }}>INV-{inv._id.slice(-4).toUpperCase()}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{inv.patient?.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{inv.doctor?.name}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--navy)' }}>৳{inv.amount}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 16px' }}><Badge status={inv.status} /></td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {inv.status !== 'Paid' && (
                        <button onClick={() => handleMarkPaid(inv._id)} style={btn('#ECFDF5', '#059669')}>Mark Paid</button>
                      )}
                      <button style={btn('#EFF6FF', '#1D4ED8')}>Print</button>
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
