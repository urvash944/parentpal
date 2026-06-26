import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../../firebase/auth";
import styles from "./Auth.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleEmail(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate("/");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <div className={styles.logoWrap}>
          <span className={styles.logoEmoji}>🌟</span>
        </div>
        <h1 className={styles.appName}>ParentPal</h1>
        <p className={styles.tagline}>Learn Through Play</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Welcome back!</h2>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleEmail} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className={styles.btnPrimary} disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className={styles.divider}><span>or</span></div>

        <button className={styles.btnGoogle} onClick={handleGoogle} disabled={loading}>
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            width={18}
            height={18}
          />
          Continue with Google
        </button>

        <p className={styles.switchText}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.switchLink}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

function friendlyError(code) {
  const map = {
    "auth/user-not-found":   "No account found with this email.",
    "auth/wrong-password":   "Incorrect password. Try again.",
    "auth/invalid-email":    "Please enter a valid email.",
    "auth/too-many-requests":"Too many attempts. Please wait.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
  };
  return map[code] || "Something went wrong. Please try again.";
}