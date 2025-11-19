import { useNavigate } from "react-router-dom";
import "../styles/animations.css";
import Navbar from "../components/ui/Navbar.jsx";
import { Link } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="landing">
        <h1 className="title">GigBooking</h1>
        <p className="subtitle">Connect bands with venues — fast.</p>
        <div className="choice-buttons">
          <button onClick={() => navigate("/band")}>I am a Band</button>
          <button onClick={() => navigate("/venue")}>I am a Venue</button>
          <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </>
  );
}
