import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext.jsx";
import Navbar from "../ui/Navbar.jsx";
import GigList from "../gigs/GigList.jsx";

function BandSignInInline() {
  const { signInBand, loading, bands } = useAppContext();
  const [username, setUsername] = useState("");

  const knownUsernames = useMemo(
    () => (bands || []).map((b) => b.username).slice(0, 50),
    [bands]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signInBand(username.trim());
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Band Sign In</h3>
      <input
        required
        list="band-usernames"
        placeholder="Band username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <datalist id="band-usernames">
        {knownUsernames.map((u) => (
          <option key={u} value={u} />
        ))}
      </datalist>
      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
      <p className="muted" style={{ marginTop: 8 }}>
        If your band isn’t in the list, create it on the Venue page or via the API.
      </p>
    </form>
  );
}

export default function BandDashboard() {
  const {
    currentBand,
    gigs,
    refreshGigs,
    showInterestInGig,
    loading,
  } = useAppContext();
  
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Load gigs on first mount
    refreshGigs();
    // Give some time for authentication to complete
    setTimeout(() => setIsInitializing(false), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedGigs = useMemo(
    () => [...(gigs || [])].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [gigs]
  );

  const handleShowInterest = async (gigId) => {
    await showInterestInGig(gigId);
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <h1>Band Dashboard</h1>

        {isInitializing && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading your dashboard...</p>
          </div>
        )}

        {!isInitializing && !currentBand && <BandSignInInline />}

        {currentBand && (
          <>
            <p className="muted">
              Signed in as <strong>{currentBand.username}</strong>
            </p>
            <div className="card">
              <div className="card-head">
                <strong>Available Gigs</strong>
                <button onClick={refreshGigs} disabled={loading}>
                  {loading ? "Refreshing…" : "Refresh"}
                </button>
              </div>
              {sortedGigs.length === 0 ? (
                <p className="muted">No gigs posted yet.</p>
              ) : (
                <GigList gigs={sortedGigs} onShowInterest={handleShowInterest} />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
