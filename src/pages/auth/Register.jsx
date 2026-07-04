import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', role: 'patient',
    phone: '', age: '', bloodGroup: '',
    department: '', qualification: '', experience: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters.';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match.';
    return e;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: undefined }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = {
        name: form.name, email: form.email,
        password: form.password, role: form.role,
        phone: form.phone,
      };
      if (form.role === 'patient') {
        payload.age = form.age;
        payload.bloodGroup = form.bloodGroup;
      }
      if (form.role === 'doctor') {
        payload.department = form.department;
        payload.qualification = form.qualification;
        payload.experience = form.experience;
      }
      const user = await register(payload);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    return Math.min(s, 4);
  };
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#3B82F6', '#06D6A0'];
  const pw = strength();

  const field = (label, name, type = 'text', placeholder = '', required = false) => (
    <div className={styles.field} key={name}>
      <label>{label}{required && ' *'}</label>
      <input name={name} type={type} placeholder={placeholder}
        value={form[name]} onChange={handleChange}
        className={errors[name] ? styles.inputError : ''} />
      {errors[name] && <span className={styles.fieldErr}>{errors[name]}</span>}
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.panel}>
        <div className={styles.panelInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>+</span>
            <span className={styles.logoText}>MedCore <em>HMS</em></span>
          </div>
          <h1 className={styles.tagline}>Join our<br />care network.</h1>
          <p className={styles.subtext}>Register to book appointments, view records, and manage your health — all in one place.</p>
          <ul className={styles.featureList}>
            <li>✦ Book & track appointments</li>
            <li>✦ Access your medical history</li>
            <li>✦ Download prescriptions & invoices</li>
            <li>✦ Secure & private health data</li>
          </ul>
        </div>
        <div className={styles.panelBg} aria-hidden />
      </div>

      <div className={styles.formSide}>
        <div className={styles.card}>
          <h2 className={styles.formTitle}>Create your account</h2>
          <p className={styles.formSub}>Fill in the details below to get started.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Role picker */}
            <div className={styles.roleRow}>
              {['patient', 'doctor'].map(r => (
                <button key={r} type="button"
                  className={`${styles.roleBtn} ${form.role === r ? styles.roleActive : ''}`}
                  onClick={() => setForm(f => ({ ...f, role: r }))}>
                  {r === 'patient' ? '🧑‍⚕️ Patient' : '👨‍⚕️ Doctor'}
                </button>
              ))}
            </div>

            {/* Common fields */}
            {field('Full name', 'name', 'text', 'Your full name', true)}
            {field('Email address', 'email', 'email', 'you@example.com', true)}

            {/* Password */}
            <div className={styles.field}>
              <label>Password *</label>
              <div className={styles.passWrap}>
                <input name="password" type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange}
                  className={errors.password ? styles.inputError : ''} />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(s => !s)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div className={styles.strengthBar}>
                  {[1,2,3,4].map(i => (
                    <span key={i} className={styles.strengthSeg}
                      style={{ background: i <= pw ? strengthColor[pw] : 'var(--border)' }} />
                  ))}
                  <small style={{ color: strengthColor[pw] }}>{strengthLabel[pw]}</small>
                </div>
              )}
              {errors.password && <span className={styles.fieldErr}>{errors.password}</span>}
            </div>

            {/* Confirm password */}
            <div className={styles.field}>
              <label>Confirm password *</label>
              <input name="confirm" type="password" placeholder="Repeat password"
                value={form.confirm} onChange={handleChange}
                className={errors.confirm ? styles.inputError : ''} />
              {errors.confirm && <span className={styles.fieldErr}>{errors.confirm}</span>}
            </div>

            {field('Phone', 'phone', 'tel', '01700-XXXXXX')}

            {/* Patient-specific fields */}
            {form.role === 'patient' && (
              <>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 4 }}>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .4 }}>Patient Info</p>
                </div>
                <div className={styles.roleRow}>
                  <div className={styles.field} style={{ flex: 1 }}>
                    <label>Age</label>
                    <input name="age" type="number" placeholder="Your age"
                      value={form.age} onChange={handleChange} />
                  </div>
                  <div className={styles.field} style={{ flex: 1 }}>
                    <label>Blood Group</label>
                    <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}
                      style={{ height: 46, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0 14px', fontSize: 14, fontFamily: 'var(--font-sans)', background: 'white', width: '100%' }}>
                      <option value="">Select</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Doctor-specific fields */}
            {form.role === 'doctor' && (
              <>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 4 }}>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .4 }}>Doctor Info</p>
                </div>
                {field('Department', 'department', 'text', 'e.g. Cardiology')}
                {field('Qualification', 'qualification', 'text', 'e.g. MBBS, MD')}
                {field('Experience', 'experience', 'text', 'e.g. 5 years')}
              </>
            )}

            {apiError && <p className={styles.errorMsg}>{apiError}</p>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Create Account'}
            </button>
          </form>

          <p className={styles.switchLink}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
