'use client';

import { useEffect, useState } from 'react';
import { fetchWatches } from '../lib/api';
import WatchCard from './WatchCard';
import styles from './WatchList.module.css';

export default function WatchList() {
  const [watches, setWatches] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    fetchWatches()
      .then((data) => {
        if (!cancelled) {
          setWatches(data);
          setStatus('ready');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading') {
    return <p className={styles.stateText}>Loading watches…</p>;
  }

  if (status === 'error') {
    return (
      <p className={styles.stateText} data-tone="error">
        Couldn&apos;t load listings: {error}
      </p>
    );
  }

  if (watches.length === 0) {
    return <p className={styles.stateText}>No watches listed yet. Check back soon.</p>;
  }

  return (
    <div className={styles.grid}>
      {watches.map((watch) => (
        <WatchCard key={watch._id} watch={watch} />
      ))}
    </div>
  );
}