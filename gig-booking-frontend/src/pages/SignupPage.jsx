import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // axios instance

const ROLE_BAND = "BAND";
const ROLE_VENUE = "VENUE";

export default function SignupPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState(ROLE_BAND);

  const [bandForm, setBandForm] = useState({
    username: "",
    email: "",
    genre: "",
    members: "",
    links: "",
  });

  const [venueForm, setVenueForm] = useState({
    username: "",
    email: "",
    companyName: "",
    contact: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError("");
    setSuccessMsg("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setSuccessMsg("");

    if (role === ROLE_BAND) {
      setBandForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setVenueForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const payload = role === ROLE_BAND ? bandForm : venueForm;

    // basic validation
    const missing = Object.entries(payload)
      .filter(([_, v]) => !v || v.trim() === "")
      .map(([k]) => k);

    if (missing.length > 0) {
      setError("Please fill in all fields before continuing.");
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = role === ROLE_BAND ? "/api/bands" : "/api/venues";

      await api.post(endpoint, payload);

      setSuccessMsg(
        role === ROLE_BAND
          ? "Band account created! You can now log in as a band."
          : "Venue account created! You can now log in as a venue."
      );

      // redirect after a short delay
      setTimeout(() => {
        navigate("/"); // or "/login" if you have a login page
      }, 1500);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to create account. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentForm = role === ROLE_BAND ? bandForm : venueForm;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at top, #111827 0, #020617 40%, #000000 100%)",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 540,
          background: "rgba(15,23,42,0.96)",
          borderRadius: 24,
          padding: "32px 28px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          border: "1px solid rgba(148,163,184,0.25)",
          color: "#e5e7eb",
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 6,
            color: "#f9fafb",
          }}
        >
          Sign up for GigBooker
        </h1>
        <p style={{ marginBottom: 20, color: "#9ca3af", fontSize: 14 }}>
          Create an account as a{" "}
          <span style={{ fontWeight: 600 }}>Band</span> or{" "}
          <span style={{ fontWeight: 600 }}>Venue</span> and start booking gigs.
        </p>

        {/* Role toggle */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            padding: 4,
            borderRadius: 999,
            background: "rgba(15,23,42,0.9)",
            border: "1px solid rgba(148,163,184,0.4)",
          }}
        >
          <button
            type="button"
            onClick={() => handleRoleChange(ROLE_BAND)}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              background:
                role === ROLE_BAND
                  ? "linear-gradient(135deg, #22c55e, #16a34a)"
                  : "transparent",
              color: role === ROLE_BAND ? "#f9fafb" : "#9ca3af",
              transition: "all 0.15s ease",
            }}
          >
            I’m a Band
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange(ROLE_VENUE)}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              background:
                role === ROLE_VENUE
                  ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                  : "transparent",
              color: role === ROLE_VENUE ? "#f9fafb" : "#9ca3af",
              transition: "all 0.15s ease",
            }}
          >
            I’m a Venue
          </button>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 14,
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(239,68,68,0.12)",
              color: "#fecaca",
              fontSize: 14,
              border: "1px solid rgba(239,68,68,0.7)",
            }}
          >
            {error}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              marginBottom: 14,
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(34,197,94,0.12)",
              color: "#bbf7d0",
              fontSize: 14,
              border: "1px solid rgba(34,197,94,0.7)",
            }}
          >
            {successMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: 14, marginTop: 6 }}
        >
          {/* Shared fields: username + email */}
          <div>
            <label style={labelStyle} htmlFor="username">
              {role === ROLE_BAND ? "Band name" : "Your name"}
            </label>
            <input
              id="username"
              name="username"
              value={currentForm.username}
              onChange={handleChange}
              placeholder={
                role === ROLE_BAND ? "e.g., The GigBookers" : "e.g., Alex at Soho Bar"
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={currentForm.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          {role === ROLE_BAND ? (
            <>
              {/* Band-specific fields */}
              <div>
                <label style={labelStyle} htmlFor="genre">
                  Genre
                </label>
                <input
                  id="genre"
                  name="genre"
                  value={bandForm.genre}
                  onChange={handleChange}
                  placeholder="Rock, Jazz, Indie..."
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="members">
                  Members
                </label>
                <input
                  id="members"
                  name="members"
                  value={bandForm.members}
                  onChange={handleChange}
                  placeholder="e.g., 4-piece band, 2 guitars, drums, vocals"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="links">
                  Links (Spotify, Instagram, etc.)
                </label>
                <textarea
                  id="links"
                  name="links"
                  value={bandForm.links}
                  onChange={handleChange}
                  placeholder="Paste your social or music links here"
                  style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
                />
              </div>
            </>
          ) : (
            <>
              {/* Venue-specific fields */}
              <div>
                <label style={labelStyle} htmlFor="companyName">
                  Venue / Company Name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  value={venueForm.companyName}
                  onChange={handleChange}
                  placeholder="e.g., Soho Underground"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="contact">
                  Contact Info
                </label>
                <input
                  id="contact"
                  name="contact"
                  value={venueForm.contact}
                  onChange={handleChange}
                  placeholder="Phone, email, booking contact..."
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={venueForm.description}
                  onChange={handleChange}
                  placeholder="Tell bands about your room, capacity, vibe..."
                  style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: 8,
              width: "100%",
              border: "none",
              borderRadius: 999,
              padding: "11px 16px",
              fontSize: 15,
              fontWeight: 600,
              cursor: isSubmitting ? "default" : "pointer",
              background:
                "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
              color: "#f9fafb",
              boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
              opacity: isSubmitting ? 0.7 : 1,
              transition: "transform 0.1s ease, box-shadow 0.1s ease",
            }}
          >
            {isSubmitting
              ? "Creating your account..."
              : role === ROLE_BAND
              ? "Create Band Account"
              : "Create Venue Account"}
          </button>

          <p
            style={{
              marginTop: 10,
              fontSize: 13,
              color: "#9ca3af",
              textAlign: "center",
            }}
          >
            Want to go back?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                border: "none",
                background: "none",
                padding: 0,
                margin: 0,
                color: "#e5e7eb",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Return home
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 13,
  marginBottom: 4,
  color: "#cbd5f5",
};

const inputStyle = {
  width: "100%",
  padding: "9px 11px",
  borderRadius: 12,
  border: "1px solid rgba(148,163,184,0.6)",
  backgroundColor: "rgba(15,23,42,0.9)",
  color: "#e5e7eb",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};
