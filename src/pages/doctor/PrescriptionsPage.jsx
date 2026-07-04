import { useState, useEffect } from 'react';
import { prescriptionAPI, appointmentAPI } from '../../services/api';

export default function PrescriptionsPage() {
  const [tab, setTab] = useState('write');
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // Write form state
  const [form, setForm] = useState({ patientId: '', diagnosis: '', notes: '' });
  const [medicines, setMedicines] = useState([{ name: '', dose: '', freq: '', duration: '' }]);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    if (tab === 'history') {
      setLoading(true);
      prescriptionAPI.getAll().then(res => {
        setPrescriptions(res.data.prescriptions);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
    if (tab === 'write') {
      // Load unique patients from appointments
      appointmentAPI.getAll().then(res => {
        const seen = new Set();
        const unique = [];
        res.data.appointments.forEach(a => {
          if (a.patient && !seen.has(a.patient._id)) {
            seen.add(a.patient._id);
            unique.push(a.patient);
          }
        });
        setPatients(unique);
      });
    }
  }, [tab]);

  const addMedicine = () => setMedicines(prev => [...prev, { name: '', dose: '', freq: '', duration: '' }]);
  const removeMedicine = (i) => setMedicines(prev => prev.filter((_, idx) => idx !== i));
  const updateMedicine = (i, key, val) => setMedicines(prev => prev.map((m, idx) => idx === i ? { ...m, [key]: val } : m));

  const handleSave = async () => {
    if (!form.patientId || !form.diagnosis) { alert('Patient and diagnosis are required'); return; }
    setSaving(true);
    try {
      await prescriptionAPI.create({
        patientId: form.patientId,
        diagnosis: form.diagnosis,
        medicines: medicines.filter(m => m.name),
        notes: form.notes,
      });
      setSavedMsg('Prescription saved successfully!');
      setForm({ patientId: '', diagnosis: '', notes: '' });
      setMedicines([{ name: '', dose: '', freq: '', duration: '' }]);
      setTimeout(() => setSavedMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save prescription');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    height: 40, border: '1.5px solid var(--border)', borderRadius: 9,
    padding: '0 12px', fontSize: 14, fontFamily: 'var(--font-sans)',
    color: 'var(--text)', outline: 'none', width: '100%',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'white', borderRadius: 12, padding: 4, border: '1px solid var(--border)', width: 'fit-content' }}>
        {[['write', 'Write Prescription'], ['history', 'History']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '8px 22px', borderRadius: 9, border: 'none',
            background: tab === key ? 'var(--blue)' : 'transparent',
            color: tab === key ? 'white' : 'var(--muted)',
            fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>{label}</button>
        ))}
      </div>

      {/* Write tab */}
      {tab === 'write' && (
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: 28, boxShadow: '0 1px 4px rgba(11,20,55,.06)', maxWidth: 700 }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: 24 }}>New Prescription</h3>

          {savedMsg && (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10, padding: '10px 16px', marginBottom: 20, fontSize: 14, color: '#059669', fontWeight: 600 }}>
              ✓ {savedMsg}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>Select Patient *</label>
              <select value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              >
                <option value="">-- Select patient --</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>Diagnosis *</label>
              <input type="text" placeholder="e.g. Hypertension Stage 1" value={form.diagnosis}
                onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Medicines */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>Medicines</label>
                <button onClick={addMedicine} style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add Medicine</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {medicines.map((med, i) => (
                  <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 14, display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 1fr auto', gap: 10, alignItems: 'center' }}>
                    {[
                      { key: 'name',     ph: 'Medicine name' },
                      { key: 'dose',     ph: 'Dose' },
                      { key: 'freq',     ph: 'Frequency' },
                      { key: 'duration', ph: 'Duration' },
                    ].map(({ key, ph }) => (
                      <input key={key} type="text" placeholder={ph} value={med[key]}
                        onChange={e => updateMedicine(i, key, e.target.value)}
                        style={{ ...inputStyle, height: 36 }}
                        onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                    ))}
                    {medicines.length > 1 && (
                      <button onClick={() => removeMedicine(i)} style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: 18, cursor: 'pointer', padding: '0 4px' }}>✕</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>Doctor's Notes</label>
              <textarea placeholder="Additional instructions…" value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                style={{ border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 12px', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical', minHeight: 80, width: '100%' }}
                onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <button onClick={handleSave} disabled={saving}
              style={{ alignSelf: 'flex-start', padding: '11px 28px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              {saving ? 'Saving...' : 'Save Prescription'}
            </button>
          </div>
        </div>
      )}

      {/* History tab */}
      {tab === 'history' && (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '280px 1fr' : '1fr', gap: 20, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loading && <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>Loading...</p>}
            {!loading && prescriptions.length === 0 && <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>No prescriptions yet.</p>}
            {prescriptions.map(rx => (
              <button key={rx._id} onClick={() => setSelected(rx)} style={{
                textAlign: 'left', padding: '14px 16px', borderRadius: 12,
                border: `1.5px solid ${selected?._id === rx._id ? 'var(--blue)' : 'var(--border)'}`,
                background: selected?._id === rx._id ? 'rgba(27,79,216,.05)' : 'white',
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}>
                <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14 }}>{rx.patient?.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{rx.diagnosis}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{new Date(rx.createdAt).toLocaleDateString()}</div>
              </button>
            ))}
          </div>

          {selected && (
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: 28, boxShadow: '0 1px 4px rgba(11,20,55,.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, marginBottom: 4 }}>Patient</div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--navy)' }}>{selected.patient?.name}</h2>
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{new Date(selected.createdAt).toLocaleDateString()}</div>
              </div>
              <div style={{ background: '#FEF3C7', borderLeft: '3px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '12px 16px', fontSize: 14, color: '#92400E', fontWeight: 500, marginBottom: 20 }}>
                {selected.diagnosis}
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>Medicines</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selected.medicines?.map((med, i) => (
                    <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .4, marginBottom: 4 }}>Medicine</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{med.name}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .4, marginBottom: 4 }}>Dose</div>
                        <div style={{ fontSize: 14, color: 'var(--text)' }}>{med.dose}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .4, marginBottom: 4 }}>Frequency</div>
                        <div style={{ fontSize: 14, color: 'var(--text)' }}>{med.freq}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selected.notes && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>Notes</div>
                  <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '14px 16px', fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>{selected.notes}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
