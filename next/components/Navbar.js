'use client';

import DialMark from './DialMark';
import styles from './Navbar.module.css';

const VITE_APP_URL = 'http://localhost:5173';

export default function Navbar({ user, onLogout }) {
  return (
    <header className={styles.bar}>
      <div className={styles.brand}>
        <DialMark size={26} />
        <span className={styles.brandName}>Second Hand</span>
      </div>
      <div className={styles.right}>
        {user.role === 'admin' && (
          <a className={styles.portalLink} href={`${VITE_APP_URL}/admin?uid=${user._id}`}>
            Admin
          </a>
        )}
        {user.role === 'seller' && (
          <a className={styles.portalLink} href={`${VITE_APP_URL}/seller?uid=${user._id}`}>
            Sell
          </a>
        )}
        {user.role === 'user' && (
          <a className={styles.portalLink} href={`${VITE_APP_URL}/buyer?uid=${user._id}`}>
            My purchases
          </a>
        )}
        <span className={styles.greeting}>Hi, {user.name || user.email}</span>
        <button className={styles.logoutBtn} onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}