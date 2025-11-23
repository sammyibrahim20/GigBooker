import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/animations.css";
import api from "../services/api"; // axios instance
import { useAppContext } from "../context/AppContext.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  const { signInBand, signInVenue } = useAppContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Clear any existing auth data first
    localStorage.removeItem('gigbooker_auth');

    try {
      // Authenticate with backend
      const res = await api.post("/api/auth/login", { username, password });
      const { role, username: authenticatedUsername } = res.data;
      const normalizedRole = (role || "").toUpperCase();
      const usernameToUse = authenticatedUsername || username;

      if (!normalizedRole || (normalizedRole !== "BAND" && normalizedRole !== "VENUE")) {
        setError("Unknown account type. Please contact support.");
        setIsLoading(false);
        return;
      }

      // Store authentication data in localStorage for session persistence
      localStorage.setItem('gigbooker_auth', JSON.stringify({
        username: usernameToUse,
        role: normalizedRole,
        loginTime: new Date().toISOString()
      }));

      // Sync global auth state so dashboards load immediately
      let authenticated = false;
      if (normalizedRole === "BAND") {
        const band = await signInBand(usernameToUse);
        authenticated = !!band;
        if (authenticated) {
          navigate("/band");
        }
      } else if (normalizedRole === "VENUE") {
        const venue = await signInVenue(usernameToUse);
        authenticated = !!venue;
        if (authenticated) {
          navigate("/venue");
        }
      }

      if (!authenticated) {
        // Clear auth data if sign-in failed
        localStorage.removeItem('gigbooker_auth');
        setError("Login successful but could not load your account. Please try again.");
      }
    } catch (err) {
      console.error(err);
      // Clear auth data on error
      localStorage.removeItem('gigbooker_auth');
      setError(
        err.response?.data?.message ||
          "Login failed. Check your username/password and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // No <Navbar /> here – clean landing page
    <div
      className="landing"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <h1 className="title" style={{ marginBottom: "0.5rem" }}>
        GigBooking
      </h1>
      <p className="subtitle" style={{ marginBottom: "2rem" }}>
        Sign in to manage your gigs and bookings.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(10, 23, 55, 0.9)",
          borderRadius: 16,
          padding: "2rem",
          boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ marginBottom: "1.25rem" }}>
          <label
            htmlFor="username"
            style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.6rem 0.8rem",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(15, 23, 42, 0.9)",
              color: "white",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.6rem 0.8rem",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(15, 23, 42, 0.9)",
              color: "white",
            }}
          />
        </div>

        {error && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.6rem 0.8rem",
              borderRadius: 8,
              background: "rgba(239, 68, 68, 0.12)",
              color: "#fecaca",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: 999,
            border: "none",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            background:
              "linear-gradient(135deg, rgba(59,130,246,1), rgba(56,189,248,1))",
            color: "white",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p
        style={{
          marginTop: "1.5rem",
          fontSize: "0.95rem",
          color: "rgba(241,245,249,0.9)",
        }}
      >
        New to GigBooker?{" "}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          style={{
            border: "none",
            background: "transparent",
            color: "#60a5fa",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Sign up here!
        </button>
      </p>
    </div>
  );
}
