import styles from "./Skeleton.module.css";

export function SkeletonBlock({ height = 20, width = "100%", radius = 8, style = {} }) {
  return (
    <div
      className={styles.block}
      style={{ height, width, borderRadius: radius, ...style }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <SkeletonBlock height={36} width={36} radius={50} />
      <div style={{ flex: 1, marginLeft: 12 }}>
        <SkeletonBlock height={14} width="60%" style={{ marginBottom: 8 }} />
        <SkeletonBlock height={12} width="40%" />
      </div>
    </div>
  );
}

export function SkeletonActivity() {
  return (
    <div className={styles.activityWrap}>
      <SkeletonBlock height={140} radius={20} style={{ marginBottom: 16 }} />
      <SkeletonBlock height={18} width="80%" style={{ marginBottom: 10 }} />
      <SkeletonBlock height={48} radius={12} style={{ marginBottom: 10 }} />
      <SkeletonBlock height={48} radius={12} style={{ marginBottom: 10 }} />
      <SkeletonBlock height={48} radius={12} />
    </div>
  );
}