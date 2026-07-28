import styles from './WatchCard.module.css';

const CONDITION_TONE = {
  New: 'good',
  'Like New': 'good',
  Excellent: 'good',
  Good: 'warn',
  Fair: 'bad',
};

export default function WatchCard({ watch }) {
  const image = watch.images && watch.images[0];

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={watch.title} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>No photo</div>
        )}
        <span
          className={styles.conditionStamp}
          data-tone={CONDITION_TONE[watch.condition] || 'warn'}
        >
          {watch.condition}
        </span>
      </div>

      <div className={styles.body}>
        <p className={styles.brand}>{watch.brand}</p>
        <h3 className={styles.title}>{watch.title}</h3>
        <p className={styles.price}>
          {typeof watch.price === 'number'
            ? `$${watch.price.toLocaleString()}`
            : 'Price on request'}
        </p>
      </div>
    </article>
  );
}