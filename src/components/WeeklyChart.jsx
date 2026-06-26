import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import styles from "./WeeklyChart.module.css";

export default function WeeklyChart({ weekDays }) {
  const allZero = weekDays.every((d) => d.count === 0);

  return (
    <div className={styles.wrap}>
      {allZero && (
        <div className={styles.emptyOverlay}>
          <span className={styles.emptyEmoji}>📊</span>
          <p className={styles.emptyText}>No activity yet this week</p>
        </div>
      )}
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={weekDays} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--clr-border)" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #E8EAEF", fontSize: 12 }}
            labelStyle={{ fontWeight: 700 }}
          />
          <Bar dataKey="count" name="Activities" fill="#6C63FF" radius={[6, 6, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}