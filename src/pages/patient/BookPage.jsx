import { useState, useEffect } from 'react';
import { doctorAPI, appointmentAPI } from '../../services/api';

const AVATAR_COLORS = ['#1B4FD8', '#06D6A0', '#F59E0B', '#8B5CF6', '#EF4444'];

export default function BookPage({ onNavigate }) {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [form, setForm] = useState({ date: '', reason: '' });
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    doctorAPI.getAll().then(res => {
      setDoctors(res.data.doctors);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedDoctor && form.date) {
      doctorAPI.getSlots(selectedDoctor._id, form.date).then(res => {
        setAvailableSlots(res.data.available);
        setSelectedSlot('');
      });
    }
  }, [selectedDoctor, form.date]);

  const depts = ['All', ...new Set(doctors.map(d => d.department).filter(Boolean))];

  const filtered = doctors.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = d.name?.toLowerCase().includes(q) || d.department?.toLowerCase().includes(q);
    const matchDept = dept === 'All' || d.department === dept;
    return matchSearch && matchDept;
  });

  const handleBook = async () => {
    if (!selectedSlot || !form.date) return;
    setBooking(true);
    try {
      await appointmentAPI.book({
        doctorId: selectedDoctor._id,
        date: form.date,
        time: selectedSlot,
        reason: form.reason,
        type: 'Consultation',
      });
      setConfirmed(true);
    } catch (err) {
      alert(err.message || 'Booking failed. Slot may already be taken.');
    } finally {
      setBooking(false);
    }
  };

  if (confirmed) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 20 }}>
        <div style={{ fontSize: 64 }}>✅</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', fontSize: '1.7rem' }}>Appointment Booked!</h2>
        <p style={{ color: 'var(--muted)', textAlign: 'center' }}>
          Your appointment with <strong>{selectedDoctor?.name}</strong> on <strong>{form.date}</strong> at <strong>{selectedSlot}</strong> has been confirmed.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => { setConfirmed(false); setSelectedDoctor(null); setSelectedSlot(''); setForm({ date: '', reason: '' }); }}
            style={{ padding: '10px 24px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            Book Another
          </button>
          <button onClick={() => onNavigate('appointments')}
            style={{ padding: '10px 24px', background: 'white', color: 'var(--navy)', border: '1.5px solid var(--border)', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            View Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          style={{ flex: 1, minWidth: 180, height: 40, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0 14px', fontSize: 14, fontFamily: 'var(--font-sans)', background: 'white', outline: 'none' }}
          placeholder="Search doctor or department…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select
          style={{ height: 40, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0 12px', fontSize: 14, fontFamily: 'var(--font-sans)', background: 'white', outline: 'none', cursor: 'pointer' }}
          value={dept} onChange={e => setDept(e.target.value)}
        >
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedDoctor ? '1fr 360px' : '1fr', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', fontSize: '1.1rem' }}>
            Available Doctors <span style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 400 }}>({filtered.length})</span>
          </h3>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>Loading doctors...</div>
          ) : filtered.map((doc, i) => (
            <div key={doc._id}
              onClick={() => { setSelectedDoctor(doc); setSelectedSlot(''); setAvailableSlots([]); }}
              style={{
                background: 'white', border: `1.5px solid ${selectedDoctor?._id === doc._id ? 'var(--blue)' : 'var(--border)'}`,
                borderRadius: 14, padding: 18, cursor: 'pointer',
                boxShadow: selectedDoctor?._id === doc._id ? '0 4px 20px rgba(27,79,216,.1)' : '0 1px 4px rgba(11,20,55,.06)',
                transition: 'all .2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                  {doc.avatar || doc.name?.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>{doc.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{doc.department}</div>
                </div>
                {doc.rating > 0 && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>⭐ {doc.rating}</div>
                  </div>
                )}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .4 }}>
                {selectedDoctor?._id === doc._id && form.date ? 'Available Slots' : 'Select date to see slots'}
              </div>
              {selectedDoctor?._id === doc._id && form.date && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {availableSlots.length === 0 ? (
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>No available slots for this date</span>
                  ) : availableSlots.map(slot => (
                    <button key={slot}
                      onClick={e => { e.stopPropagation(); setSelectedSlot(slot); }}
                      style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                        fontFamily: 'var(--font-sans)', cursor: 'pointer',
                        border: `1.5px solid ${selectedSlot === slot ? 'var(--blue)' : 'var(--border)'}`,
                        background: selectedSlot === slot ? 'var(--blue)' : 'white',
                        color: selectedSlot === slot ? 'white' : 'var(--navy)',
                      }}
                    >{slot}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedDoctor && (
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: 24, position: 'sticky', top: 80, boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: 20 }}>Confirm Booking</h3>
            <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{selectedDoctor.name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{selectedDoctor.department}</div>
              {selectedSlot && <div style={{ marginTop: 8, fontSize: 13, color: 'var(--blue)', fontWeight: 600 }}>🕐 {selectedSlot}</div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>Preferred Date</label>
                <input type="date" value={form.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  style={{ height: 42, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0 12px', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' }}
                  onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>Reason for Visit</label>
                <textarea placeholder="Describe your symptoms…" value={form.reason}
                  onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  style={{ border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 12px', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical', minHeight: 80, width: '100%' }}
                  onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>
            <button onClick={handleBook} disabled={!selectedSlot || !form.date || booking}
              style={{
                marginTop: 20, width: '100%', height: 44,
                background: selectedSlot && form.date ? 'var(--blue)' : 'var(--border)',
                color: selectedSlot && form.date ? 'white' : 'var(--muted)',
                border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600,
                cursor: selectedSlot && form.date ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {booking ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
