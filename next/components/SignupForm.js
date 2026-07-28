'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './AuthForm.module.css';
import DialMark from './DialMark';

const ROLES = ['user', 'seller'];

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRoleToggle = (role) => setForm({ ...form, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/authentication/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      router.push('/');
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
          Create an account to buy, sell, or manage the marketplace.
        </p>
      </div>

      <form className={styles.formSide} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Create an account</h2>
        <p className={styles.formSub}>It takes less than a minute.</p>

        {error && <div className={styles.errorBox}>{error}</div>}

        <label className={styles.field}>
          <span>Name</span>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </label>

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
            placeholder="Choose a password"
            required
          />
        </label>

        <div className={styles.field}>
          <span>Account type</span>
          <div className={styles.roleGroup}>
            {ROLES.map((role) => (
              <label key={role} className={styles.roleOption}>
                <input
                  type="checkbox"
                  checked={form.role === role}
                  onChange={() => handleRoleToggle(role)}
                />
                <span className={styles.roleLabel}>{role}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <p className={styles.switchLine}>
          Already have an account? <Link href="/">Log in</Link>
        </p>
      </form>
    </div>
  );
}