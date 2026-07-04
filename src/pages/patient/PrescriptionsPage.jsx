import { useState } from 'react';
import s from './Patient.module.css';
import { prescriptions } from './mockData';

export default function PrescriptionsPage() {
  const [selected, setSelected] = useState(prescriptions[0]);

  return (
    <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:20, alignItems:'start' }}>

      {/* List */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <h3 style={{ fontFamily:'var(--font-serif)', color:'var(--navy)', fontSize:'1rem', marginBottom:4 }}>
          Prescription History
        </h3>
        {prescriptions.map(rx => (
          <button
            key={rx.id}
            onClick={() => setSelected(rx)}
            style={{
              textAlign:'left', padding:'14px 16px', borderRadius:12,
              border: `1.5px solid ${selected?.id === rx.id ? 'var(--blue)' : 'var(--border)'}`,
              background: selected?.id === rx.id ? 'rgba(27,79,216,.05)' : 'white',
              cursor:'pointer', fontFamily:'var(--font-sans)', transition:'all .15s',
            }}
          >
            <div style={{ fontWeight:700, color:'var(--navy)', fontSize:14 }}>{rx.id}</div>
            <div style={{ fontSize:13, color:'var(--muted)', marginTop:2 }}>{rx.doctor}</div>
            <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{rx.date}</div>
          </button>
        ))}
      </div>

      {/* Detail */}
      {selected && (
        <div className={s.card} style={{ padding:28 }}>
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
            <div>
              <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>Prescription</div>
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'1.4rem', color:'var(--navy)' }}>{selected.id}</h2>
            </div>
            <button style={{
              padding:'8px 18px', borderRadius:10, background:'var(--blue)', color:'white',
              border:'none', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'var(--font-sans)',
            }}>
              🖨️ Print
            </button>
          </div>

          {/* Info row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14, marginBottom:24 }}>
            {[
              { label:'Doctor', value: selected.doctor },
              { label:'Department', value: selected.dept },
              { label:'Date', value: selected.date },
            ].map(({ label, value }) => (
              <div key={label} style={{ background:'var(--surface)', borderRadius:10, padding:'12px 14px' }}>
                <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:.4, marginBottom:4 }}>{label}</div>
                <div style={{ fontSize:14, fontWeight:600, color:'var(--navy)' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Diagnosis */}
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--navy)', marginBottom:8 }}>Diagnosis</div>
            <div style={{ background:'#FEF3C7', borderLeft:'3px solid #F59E0B', borderRadius:'0 8px 8px 0', padding:'12px 16px', fontSize:14, color:'#92400E', fontWeight:500 }}>
              {selected.diagnosis}
            </div>
          </div>

          {/* Medicines */}
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--navy)', marginBottom:12 }}>Prescribed Medicines</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {selected.medicines.map((med, i) => (
                <div key={i} style={{
                  border:'1px solid var(--border)', borderRadius:12, padding:'16px 18px',
                  display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12,
                }}>
                  <div>
                    <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:.4, marginBottom:4 }}>Medicine</div>
                    <div style={{ fontSize:14, fontWeight:700, color:'var(--navy)' }}>{med.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:.4, marginBottom:4 }}>Dose</div>
                    <div style={{ fontSize:14, color:'var(--text)' }}>{med.dose}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:.4, marginBottom:4 }}>Frequency</div>
                    <div style={{ fontSize:14, color:'var(--text)' }}>{med.freq}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--navy)', marginBottom:8 }}>Doctor's Notes</div>
            <div style={{ background:'var(--surface)', borderRadius:10, padding:'14px 16px', fontSize:14, color:'var(--text)', lineHeight:1.7 }}>
              {selected.notes}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
