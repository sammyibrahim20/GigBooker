import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext.jsx";

export default function Navbar() {
  const { currentBand, currentVenue, signOut } = useAppContext();
  const navigate = useNavigate();

  const who =
    currentBand?.username ||
    currentVenue?.name ||
    currentVenue?.username ||
    null;

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">
          GigBooking
        </Link>
      </div>
      <div className="nav-right">
        {who ? (
          <>
            <span className="nav-user">Signed in as: {who}</span>
            <button onClick={handleSignOut}>Sign out</button>
          </>
        ) : (
          <span className="nav-user muted">Not signed in</span>
        )}
      </div>
    </nav>
  );
}
