'use client';

import LoginForm from '../components/LoginForm';
import Navbar from '../components/Navbar';
import WatchList from '../components/WatchList';
import { useAuth } from '../context/AuthContext';
import styles from './page.module.css';

export default function Home() {
  const { user, logout } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <main className={styles.main}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Current listings</p>
          <h1 className={styles.title}>Watches for sale</h1>
        </div>
        <WatchList />
      </main>
    </>
  );
}