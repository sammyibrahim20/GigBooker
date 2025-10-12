import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext.jsx";
import Navbar from "../ui/Navbar.jsx";
import GigForm from "../forms/GigForm.jsx";
import GigList from "../gigs/GigList.jsx";

function VenueSignInInline() {
  const { signInVenue, loading, venues } = useAppContext();
  const [username, setUsername] = useState("");

  const knownUsernames = useMemo(
    () => (venues || []).map((v) => v.username).slice(0, 50),
    [venues]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signInVenue(username.trim());
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Venue Sign In</h3>
      <input
        required
        list="venue-usernames"
        placeholder="Venue username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <datalist id="venue-usernames">
        {knownUsernames.map((u) => (
          <option key={u} value={u} />
        ))}
      </datalist>
      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
      <p className="muted" style={{ marginTop: 8 }}>
        If your venue isn’t in the list, create it with the form below or via the API.
      </p>
    </form>
  );
}

export default function VenueDashboard() {
  const {
    currentVenue,
    bands,
    gigs,
    interests,
    refreshBands,
    refreshVenueGigs,
    loadGigInterests,
    loading,
  } = useAppContext();

  useEffect(() => {
    refreshBands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentVenue?.id) {
      refreshVenueGigs(currentVenue.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVenue?.id]);

  const myGigs = useMemo(() => {
    if (!currentVenue) return [];
    return (gigs || [])
      .filter((g) => g.venue?.id === currentVenue.id)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [gigs, currentVenue]);

  return (
    <>
      <Navbar />
      <div className="page">
        <h1>Venue Dashboard</h1>

        {!currentVenue && <VenueSignInInline />}

        {currentVenue && (
          <>
            <p className="muted">
              Signed in as{" "}
              <strong>{currentVenue.name || currentVenue.username}</strong>
            </p>

            {/* Create Gig */}
            <div className="card">
              <div className="card-head">
                <strong>Create a Gig</strong>
              </div>
              <GigForm />
            </div>

            {/* My Posted Gigs */}
            <div className="card">
              <div className="card-head">
                <strong>My Posted Gigs</strong>
                <button
                  onClick={() => refreshVenueGigs(currentVenue.id)}
                  disabled={loading}
                >
                  {loading ? "Refreshing…" : "Refresh"}
                </button>
              </div>
              {myGigs.length === 0 ? (
                <p className="muted">No gigs yet — create your first one above.</p>
              ) : (
                <GigList gigs={myGigs} ownerVenueId={currentVenue.id} />
              )}
            </div>

            {/* Interested Bands per Gig */}
            {myGigs.map((gig) => (
              <div key={`interests-${gig.id}`} className="card">
                <div className="card-head">
                  <strong>
                    Interested Bands — {new Date(gig.date).toLocaleString()}
                  </strong>
                  <button onClick={() => loadGigInterests(gig.id)} disabled={loading}>
                    {loading ? "Loading…" : "Refresh"}
                  </button>
                </div>
                <div className="card-body">
                  {!interests[gig.id]?.length ? (
                    <p className="muted">No band interest yet.</p>
                  ) : (
                    <ul className="list">
                      {interests[gig.id].map((b) => (
                        <li key={b.id}>
                          <strong>{b.username}</strong>
                          {b.genre ? ` — ${b.genre}` : ""}
                          {b.email ? ` — ${b.email}` : ""}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}

            {/* Browse Bands */}
            <div className="card">
              <div className="card-head">
                <strong>Browse Bands</strong>
                <button onClick={refreshBands} disabled={loading}>
                  {loading ? "Refreshing…" : "Refresh"}
                </button>
              </div>
              {!bands?.length ? (
                <p className="muted">No bands found.</p>
              ) : (
                <ul className="list">
                  {bands.map((b) => (
                    <li key={b.id}>
                      <strong>{b.username}</strong>
                      {b.genre ? ` — ${b.genre}` : ""}
                      {b.description ? ` — ${b.description}` : ""}
                      {b.email ? ` — ${b.email}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
