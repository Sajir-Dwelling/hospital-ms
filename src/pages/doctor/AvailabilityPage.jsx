import { useState } from 'react';
import s from './Doctor.module.css';
import { availability, bookedSlots } from './mockData';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AvailabilityPage() {
  const [slots, setSlots] = useState(availability);
  const [saved, setSaved] = useState(false);

  const toggleSlot = (day, slot) => {
    setSlots(prev => {
      const daySlots = prev[day] || [];
      const has = daySlots.includes(slot);
      return { ...prev, [day]: has ? daySlots.filter(s => s !== slot) : [...daySlots, slot].sort() };
    });
    setSaved(false);
  };

  const ALL_SLOTS = [
    '08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM',
    '01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM',
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Legend */}
      <div style={{ display:'flex', gap:16, flexWrap:'wrap', alignItems:'center' }}>
        {[
          { color:'var(--blue)', label:'Available' },
          { color:'#EF4444', label:'Booked' },
          { color:'var(--border)', label:'Off' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, color:'var(--muted)' }}>
            <div style={{ width:14, height:14, borderRadius:4, background:color }} />
            {label}
          </div>
        ))}
        <div style={{ marginLeft:'auto', display:'flex', gap:10, alignItems:'center' }}>
          {saved && <span style={{ color:'var(--accent)', fontWeight:600, fontSize:14 }}>✓ Saved!</span>}
          <button
            onClick={handleSave}
            style={{ padding:'9px 24px', background:'var(--blue)', color:'white', border:'none', borderRadius:10, fontWeight:600, fontSize:14, cursor:'pointer', fontFamily:'var(--font-sans)' }}
          >
            Save Schedule
          </button>
        </div>
      </div>

      {/* Grid per day */}
      {DAYS.map(day => {
        const dayAvailable = slots[day] || [];
        const dayBooked = bookedSlots[day] || [];
        const isOff = dayAvailable.length === 0;

        return (
          <div key={day} className={s.card} style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
              <div style={{
                width:44, height:44, borderRadius:10,
                background: isOff ? 'var(--surface)' : 'rgba(27,79,216,.1)',
                color: isOff ? 'var(--muted)' : 'var(--blue)',
                display:'grid', placeItems:'center',
                fontWeight:700, fontSize:15,
              }}>{day}</div>
              <div>
                <div style={{ fontWeight:700, color:'var(--navy)', fontSize:15 }}>
                  {isOff ? 'Day Off' : `${dayAvailable.length} slots available`}
                </div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>
                  {dayBooked.length > 0 ? `${dayBooked.length} booked` : 'No bookings yet'}
                </div>
              </div>
              <button
                onClick={() => setSlots(prev => ({ ...prev, [day]: isOff ? ['09:00 AM','10:00 AM','11:00 AM'] : [] }))}
                style={{
                  marginLeft:'auto', padding:'6px 16px', borderRadius:8, border:'1.5px solid var(--border)',
                  background:'white', color: isOff ? 'var(--blue)' : 'var(--danger)',
                  fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-sans)',
                }}
              >
                {isOff ? 'Mark Available' : 'Mark as Off'}
              </button>
            </div>

            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {ALL_SLOTS.map(slot => {
                const isBooked = dayBooked.includes(slot);
                const isOn = dayAvailable.includes(slot);
                return (
                  <button
                    key={slot}
                    disabled={isBooked}
                    onClick={() => toggleSlot(day, slot)}
                    style={{
                      padding:'6px 14px', borderRadius:8, fontSize:13, fontWeight:500,
                      fontFamily:'var(--font-sans)', cursor: isBooked ? 'not-allowed' : 'pointer',
                      border:'1.5px solid',
                      borderColor: isBooked ? '#FCA5A5' : isOn ? 'var(--blue)' : 'var(--border)',
                      background: isBooked ? '#FEF2F2' : isOn ? 'rgba(27,79,216,.08)' : 'white',
                      color: isBooked ? '#EF4444' : isOn ? 'var(--blue)' : 'var(--muted)',
                      transition:'all .15s',
                    }}
                  >
                    {slot}{isBooked ? ' 🔒' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
