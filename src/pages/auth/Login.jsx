import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const map = { patient:'patient@hms.com', doctor:'doctor@hms.com', admin:'admin@hms.com' };
    setForm({ email: map[role], password: `${role}123` });
    setError('');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.panel}>
        <div className={styles.panelInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>+</span>
            <span className={styles.logoText}>MedCore <em>HMS</em></span>
          </div>
          <h1 className={styles.tagline}>Smarter care<br />starts here.</h1>
          <p className={styles.subtext}>An integrated hospital management platform for patients, doctors, and administrators.</p>
          <div className={styles.stats}>
            <div className={styles.stat}><span>1,200+</span><small>Patients</small></div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><span>80+</span><small>Doctors</small></div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><span>24/7</span><small>Support</small></div>
          </div>
        </div>
        <div className={styles.panelBg} aria-hidden />
      </div>

      <div className={styles.formSide}>
        <div className={styles.card}>
          <h2 className={styles.formTitle}>Sign in to your account</h2>
          <p className={styles.formSub}>Welcome back — enter your credentials below.</p>

          <div className={styles.demoRow}>
            <span className={styles.demoLabel}>Try demo:</span>
            {['patient','doctor','admin'].map(r => (
              <button key={r} type="button" className={styles.demoBtn} onClick={() => fillDemo(r)}>{r}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required
                className={error ? styles.inputError : ''} />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">
                Password
                <Link to="/forgot-password" className={styles.forgot}>Forgot password?</Link>
              </label>
              <div className={styles.passWrap}>
                <input id="password" name="password" type={showPass ? 'text' : 'password'}
                  placeholder="••••••••" value={form.password} onChange={handleChange} required
                  className={error ? styles.inputError : ''} />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(s => !s)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            {error && <p className={styles.errorMsg}>{error}</p>}
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Sign In'}
            </button>
          </form>
          <p className={styles.switchLink}>
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
