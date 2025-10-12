import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

/**
 * API Endpoints (Spring Boot backend):
 *
 * Bands:
 *  - GET  /api/bands
 *  - POST /api/bands
 *
 * Venues:
 *  - GET  /api/venues
 *  - POST /api/venues
 *
 * Gigs:
 *  - GET  /gigs
 *  - POST /gigs                 (body must include venue: { id })
 *  - GET  /gigs/venue/{venueId}
 *  - POST /gigs/{gigId}/interest/{bandId}
 *  - GET  /gigs/{gigId}/interested-bands
 */

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentBand, setCurrentBand] = useState(null);
  const [currentVenue, setCurrentVenue] = useState(null);

  const [bands, setBands] = useState([]);
  const [venues, setVenues] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [interests, setInterests] = useState({}); // { gigId: [bands...] }

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type, message }

  // Toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Wrapper for API calls with error handling
  const safe = async (fn, successMsg) => {
    try {
      setLoading(true);
      const res = await fn();
      if (successMsg) showToast("success", successMsg);
      return res;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      showToast("error", msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Band actions ---
  const refreshBands = async () => {
    const { data } = await safe(() => api.get("/api/bands"));
    setBands(data || []);
    return data;
  };

  const createBand = async (band) => {
    const { data } = await safe(() => api.post("/api/bands", band), "Band created");
    setBands((prev) => [...prev, data]);
    return data;
  };

  // --- Venue actions ---
  const refreshVenues = async () => {
    const { data } = await safe(() => api.get("/api/venues"));
    setVenues(data || []);
    return data;
  };

  const createVenue = async (venue) => {
    const { data } = await safe(() => api.post("/api/venues", venue), "Venue created");
    setVenues((prev) => [...prev, data]);
    return data;
  };

  // --- Gig actions ---
  const refreshGigs = async () => {
    const { data } = await safe(() => api.get("/gigs"));
    setGigs(data || []);
    return data;
  };

  const refreshVenueGigs = async (venueId) => {
    const { data } = await safe(() => api.get(`/gigs/venue/${venueId}`));
    setGigs((prev) => {
      const others = prev.filter((g) => g.venue?.id !== venueId);
      return [...others, ...(data || [])];
    });
    return data;
  };

  const createGig = async ({ capacity, location, price, date }) => {
    if (!currentVenue) throw new Error("You must be signed in as a venue.");

    const payload = {
      capacity: Number(capacity),
      location,
      price: Number(price),
      date,
      venue: { id: currentVenue.id }, // backend expects nested venue object
    };

    const { data } = await safe(() => api.post("/gigs", payload), "Gig created");
    setGigs((prev) => [...prev, data]);
    return data;
  };

  const showInterestInGig = async (gigId) => {
    if (!currentBand) throw new Error("You must be signed in as a band.");
    await safe(
      () => api.post(`/gigs/${gigId}/interest/${currentBand.id}`),
      "Interest sent"
    );
    return loadGigInterests(gigId);
  };

  const loadGigInterests = async (gigId) => {
    const { data } = await safe(() => api.get(`/gigs/${gigId}/interested-bands`));
    setInterests((prev) => ({ ...prev, [gigId]: data || [] }));
    return data;
  };

  const signInBand = async (username) => {
    let band = bands.find((b) => b.username === username);
  
    if (!band) {
      // Auto-create the band if it doesn't exist
      const payload = { username, email: `${username}@example.com` };
      const { data } = await safe(() => api.post("/api/bands", payload), "Band created");
      band = data;
      setBands((prev) => [...prev, band]);
    }
  
    setCurrentBand(band);
    setCurrentVenue(null);
    showToast("success", `Signed in as ${band.username}`);
    return band;
  };
  

  const signInVenue = async (username) => {
    let venue = venues.find((v) => v.username === username);
  
    if (!venue) {
      // Auto-create venue if not found
      const payload = { username, email: `${username}@example.com` };
      const { data } = await safe(() => api.post("/api/venues", payload), "Venue created");
      venue = data;
      setVenues((prev) => [...prev, venue]);
    }
  
    setCurrentVenue(venue);
    setCurrentBand(null);
    showToast("success", `Signed in as ${venue.username}`);
    return venue;
  };
  

  const signOut = () => {
    setCurrentBand(null);
    setCurrentVenue(null);
    showToast("info", "Signed out");
  };

  // --- Initial load ---
  useEffect(() => {
    (async () => {
      await Promise.allSettled([refreshBands(), refreshVenues(), refreshGigs()]);
    })();
  }, []);

  const value = useMemo(
    () => ({
      // auth
      currentBand,
      currentVenue,
      signInBand,
      signInVenue,
      signOut,

      // data
      bands,
      venues,
      gigs,
      interests,

      // actions
      refreshBands,
      createBand,
      refreshVenues,
      createVenue,
      refreshGigs,
      refreshVenueGigs,
      createGig,
      showInterestInGig,
      loadGigInterests,

      // ui
      loading,
      toast,
    }),
    [
      currentBand,
      currentVenue,
      bands,
      venues,
      gigs,
      interests,
      loading,
      toast,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
