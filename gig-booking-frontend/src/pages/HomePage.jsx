// src/pages/HomePage.jsx
import { useNavigate } from "react-router-dom";
import "../styles/animations.css";

export default function HomePage() {
  const navigate = useNavigate();

  const goBandLogin = () => navigate("/band");
  const goVenueLogin = () => navigate("/venue");
  const goSignup = () => navigate("/signup");

  return (
    <div className="landing">
      {/* Simple header instead of Navbar (no Band/Venue tabs) */}
      <header className="landing-header">
        <h1 className="title">GigBooker</h1>
        <p className="subtitle">Connect bands with venues — fast.</p>
      </header>

      <main className="landing-main">
        <div className="login-card">
          <h2 className="login-title">Sign in</h2>
          <p className="login-subtitle">Choose how you want to log in.</p>

          <div className="choice-buttons">
            <button
              type="button"
              className="primary-btn"
              onClick={goBandLogin}
            >
              I&apos;m a Band
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={goVenueLogin}
            >
              I&apos;m a Venue
            </button>
          </div>

          <div className="signup-row">
            <span>New to GigBooker?</span>
            <button
              type="button"
              className="text-btn"
              onClick={goSignup}
            >
              Sign up here
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
