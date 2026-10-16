import { useState, useEffect, useMemo } from 'react';
import API from '../../services/api';

const EMPTY = { name: '', category: 'General', manufacturer: '', stock: '', unitPrice: '', lowStockLevel: 10, expiryDate: '' };

const DAY = 86400000;
function statusOf(m) {
  const now = Date.now();
  if (m.expiryDate && new Date(m.expiryDate).getTime() <= now) return 'Expired';
  if (m.stock === 0) return 'Out of stock';
  if (m.stock <= m.lowStockLevel) return 'Low stock';
  if (m.expiryDate && new Date(m.expiryDate).getTime() - now <= 30 * DAY) return 'Expiring soon';
  return 'In stock';
}

function Badge({ status }) {
  const map = {
    'In stock':      { bg: '#ECFDF5', color: '#059669' },
    'Low stock':     { bg: '#FFFBEB', color: '#D97706' },
    'Expiring soon': { bg: '#FFFBEB', color: '#D97706' },
    'Out of stock':  { bg: '#FEF2F2', color: '#DC2626' },
    'Expired':       { bg: '#FEF2F2', color: '#DC2626' },
  };
  const s = map[status];
  return <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{status}</span>;
}

const inputStyle = {
  height: 40, border: '1.5px solid var(--border)', borderRadius: 9,
  padding: '0 12px', fontSize: 14, fontFamily: 'var(--font-sans)',
  color: 'var(--text)', outline: 'none', width: '100%', background: 'white',
};
const labelStyle = { fontSize: 13, fontWeight: 600, color: 'var(--navy)' };

export default function PharmacyPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [editing, setEditing] = useState(null); // null | 'new' | medicine object
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    API.get('/medicines')
      .then(res => { setMedicines(res.data.medicines); setError(''); })
      .catch(err => setError(err.message || 'Failed to load medicines'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const stats = useMemo(() => {
    const s = { total: medicines.length, low: 0, out: 0, expired: 0 };
    medicines.forEach(m => {
      const st = statusOf(m);
      if (st === 'Low stock') s.low++;
      if (st === 'Out of stock') s.out++;
      if (st === 'Expired') s.expired++;
    });
    return s;
  }, [medicines]);

  const rows = medicines.filter(m => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter !== 'All' && statusOf(m) !== filter) return false;
    return true;
  });

  const openNew = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (m) => {
    setForm({
      name: m.name, category: m.category || 'General', manufacturer: m.manufacturer || '',
      stock: m.stock, unitPrice: m.unitPrice ?? '', lowStockLevel: m.lowStockLevel ?? 10,
      expiryDate: m.expiryDate ? m.expiryDate.slice(0, 10) : '',
    });
    setEditing(m);
  };

  const save = async () => {
    if (!form.name.trim()) { alert('Medicine name is required'); return; }
    if (form.stock === '' || Number(form.stock) < 0) { alert('Enter a stock quantity (0 or more)'); return; }
    setSaving(true);
    const body = {
      ...form,
      stock: Number(form.stock),
      unitPrice: Number(form.unitPrice) || 0,
      lowStockLevel: Number(form.lowStockLevel) || 0,
    };
    try {
      if (editing === 'new') await API.post('/medicines', body);
      else await API.put(`/medicines/${editing._id}`, body);
      setEditing(null);
      load();
    } catch (err) {
      alert(err.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const remove = async (m) => {
    if (!window.confirm(`Delete ${m.name}? This cannot be undone.`)) return;
    try { await API.delete(`/medicines/${m._id}`); load(); }
    catch (err) { alert(err.message || 'Failed to delete'); }
  };

  const card = (label, value, color) => (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', flex: 1, minWidth: 140, boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
      <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .4 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, marginTop: 4 }}>{value}</div>
    </div>
  );

  const field = (label, key, props = {}) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={labelStyle}>{label}</label>
      <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = 'var(--blue)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
        {...props} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {card('Medicines', stats.total, 'var(--navy)')}
        {card('Low stock', stats.low, '#D97706')}
        {card('Out of stock', stats.out, '#DC2626')}
        {card('Expired', stats.expired, '#DC2626')}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Search medicine…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, width: 240 }} />
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ ...inputStyle, width: 170, cursor: 'pointer' }}>
          {['All', 'In stock', 'Low stock', 'Out of stock', 'Expiring soon', 'Expired'].map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={openNew} style={{ marginLeft: 'auto', padding: '10px 22px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>+ Add Medicine</button>
      </div>

      {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: 10, padding: '10px 16px', fontSize: 14 }}>{error}</div>}

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, overflowX: 'auto', boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: .4 }}>
              {['Medicine', 'Category', 'Stock', 'Price (BDT)', 'Expiry', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} style={{ padding: 28, textAlign: 'center', color: 'var(--muted)' }}>Loading…</td></tr>}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 28, textAlign: 'center', color: 'var(--muted)' }}>
                {medicines.length === 0 ? 'No medicines yet. Click "+ Add Medicine".' : 'No medicines match.'}
              </td></tr>
            )}
            {rows.map(m => (
              <tr key={m._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{m.name}</div>
                  {m.manufacturer && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{m.manufacturer}</div>}
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text)' }}>{m.category}</td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--navy)' }}>{m.stock}</td>
                <td style={{ padding: '14px 16px' }}>{m.unitPrice ?? 0}</td>
                <td style={{ padding: '14px 16px' }}>{m.expiryDate ? new Date(m.expiryDate).toLocaleDateString() : '—'}</td>
                <td style={{ padding: '14px 16px' }}><Badge status={statusOf(m)} /></td>
                <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                  <button onClick={() => openEdit(m)} style={{ background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 600, cursor: 'pointer', marginRight: 12 }}>Edit</button>
                  <button onClick={() => remove(m)} style={{ background: 'none', border: 'none', color: '#DC2626', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div onClick={() => setEditing(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(11,20,55,.45)', display: 'grid', placeItems: 'center', zIndex: 50, padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 14, padding: 28, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: 20 }}>
              {editing === 'new' ? 'Add Medicine' : 'Edit Medicine'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {field('Name *', 'name', { placeholder: 'e.g. Paracetamol 500mg' })}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {field('Category', 'category')}
                {field('Manufacturer', 'manufacturer')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                {field('Stock *', 'stock', { type: 'number', min: 0 })}
                {field('Unit price', 'unitPrice', { type: 'number', min: 0 })}
                {field('Low-stock at', 'lowStockLevel', { type: 'number', min: 0 })}
              </div>
              {field('Expiry date', 'expiryDate', { type: 'date' })}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 22, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(null)} style={{ padding: '10px 22px', background: 'white', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ padding: '10px 26px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
