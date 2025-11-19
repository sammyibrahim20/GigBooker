import { useNavigate, Link } from "react-router-dom";
import "../styles/animations.css";
import Navbar from "../components/ui/Navbar.jsx";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="landing">
        <h1 className="title">Welcome to GigBooker</h1>
        <p className="subtitle">
          Log in as a band or venue to manage gigs, requests, and shows.
        </p>

        <div className="choice-buttons">
          <button onClick={() => navigate("/band")}>
            Log in as Band
          </button>
          <button onClick={() => navigate("/venue")}>
            Log in as Venue
          </button>
        </div>

        <p className="signup-cta" style={{ marginTop: "2rem" }}>
          New to GigBooker?{" "}
          <Link to="/signup" className="signup-link">
            Sign up here!
          </Link>
        </p>
      </div>
    </>
  );
}
