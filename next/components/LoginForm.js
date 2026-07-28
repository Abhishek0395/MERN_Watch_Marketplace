'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './AuthForm.module.css';
import DialMark from './DialMark';

export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/authentication/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      login(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.brandSide}>
        <DialMark size={64} animated />
        <h1 className={styles.brandTitle}>Second Hand</h1>
        <p className={styles.brandSub}>
          Every watch listed here has been checked by hand before it goes live —
          condition, papers, and origin, verified.
        </p>
      </div>

      <form className={styles.formSide} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Log in</h2>
        <p className={styles.formSub}>Sign in to browse and buy.</p>

        {error && <div className={styles.errorBox}>{error}</div>}

        <label className={styles.field}>
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>

        <label className={styles.field}>
          <span>Password</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Your password"
            required
          />
        </label>

        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        <p className={styles.switchLine}>
          New here? <Link href="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}