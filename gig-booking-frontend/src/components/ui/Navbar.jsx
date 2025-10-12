import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext.jsx";

export default function Navbar() {
  const { currentBand, currentVenue, signOut } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const who =
    currentBand?.username ||
    currentVenue?.name ||
    currentVenue?.username ||
    null;

  const at = location.pathname.startsWith("/venue")
    ? "venue"
    : location.pathname.startsWith("/band")
    ? "band"
    : "";

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">GigBooking</Link>
        <div className="nav-links">
          <Link to="/band" className={at === "band" ? "active" : ""}>Band</Link>
          <Link to="/venue" className={at === "venue" ? "active" : ""}>Venue</Link>
        </div>
      </div>
      <div className="nav-right">
        {who ? (
          <>
            <span className="nav-user">Signed in as: {who}</span>
            <button
              onClick={() => {
                signOut();
                navigate("/");
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <span className="nav-user muted">Not signed in</span>
        )}
      </div>
    </nav>
  );
}
