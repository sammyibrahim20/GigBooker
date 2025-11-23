import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

/**
 * Central app state: bands, venues, gigs, auth, and toasts.
 */

const AppContext = createContext();

export function AppProvider({ children }) {
  // ---- Auth state ----
  const [currentBand, setCurrentBand] = useState(null);
  const [currentVenue, setCurrentVenue] = useState(null);

  // ---- Data ----
  const [bands, setBands] = useState([]);
  const [venues, setVenues] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [interests, setInterests] = useState({}); // { gigId: [bands...] }

  // ---- UI ----
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type, message }

  // Simple toast helper
  const showToast = (type, message) => {
    if (!message) return;
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Wrapper for API calls with global loading + error toasts
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

  // -----------------------
  // Band actions
  // -----------------------
  const refreshBands = async () => {
    const { data } = await safe(() => api.get("/api/bands"));
    setBands(data || []);
    return data;
  };

  const createBand = async (band) => {
    const { data } = await safe(
      () => api.post("/api/bands", band),
      "Band created"
    );
    setBands((prev) => [...prev, data]);
    return data;
  };

  // -----------------------
  // Venue actions
  // -----------------------
  const refreshVenues = async () => {
    const { data } = await safe(() => api.get("/api/venues"));
    setVenues(data || []);
    return data;
  };

  const createVenue = async (venue) => {
    const { data } = await safe(
      () => api.post("/api/venues", venue),
      "Venue created"
    );
    setVenues((prev) => [...prev, data]);
    return data;
  };

  // -----------------------
  // Gig actions
  // -----------------------
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
    if (!currentVenue) {
      throw new Error("You must be signed in as a venue.");
    }

    const payload = {
      capacity: Number(capacity),
      location,
      price: Number(price),
      date,
      venue: { id: currentVenue.id }, // backend expects nested venue object
    };

    const { data } = await safe(
      () => api.post("/gigs", payload),
      "Gig created"
    );
    setGigs((prev) => [...prev, data]);
    return data;
  };

  const showInterestInGig = async (gigId) => {
    if (!currentBand) {
      throw new Error("You must be signed in as a band.");
    }
    await safe(
      () => api.post(`/gigs/${gigId}/interest/${currentBand.id}`),
      "Interest sent"
    );
    return loadGigInterests(gigId);
  };

  const loadGigInterests = async (gigId) => {
    const { data } = await safe(() =>
      api.get(`/gigs/${gigId}/interested-bands`)
    );
    setInterests((prev) => ({ ...prev, [gigId]: data || [] }));
    return data;
  };

  // -----------------------
  // Sign in / sign out
  // -----------------------

  const signInBand = async (username) => {
    const trimmed = (username || "").trim();
    if (!trimmed) {
      showToast("error", "Please enter a band username.");
      return null;
    }

    // Clear any existing auth state first
    setCurrentBand(null);
    setCurrentVenue(null);

    // Ensure we have the latest bands (important after signup)
    let allBands = bands;
    if (!allBands || allBands.length === 0) {
      try {
        allBands = (await refreshBands()) || [];
      } catch {
        // refreshBands already showed an error toast
        return null;
      }
    }

    const lower = trimmed.toLowerCase();
    const band =
      allBands.find(
        (b) => (b.username || "").toLowerCase() === lower
      ) || null;

    if (!band) {
      showToast(
        "error",
        `Band "${trimmed}" was not found. Make sure you've created it on the signup page.`
      );
      return null;
    }

    setCurrentBand(band);
    setCurrentVenue(null);
    showToast("success", `Signed in as ${band.username}`);
    return band;
  };

  const signInVenue = async (username) => {
    const trimmed = (username || "").trim();
    if (!trimmed) {
      showToast("error", "Please enter a venue username.");
      return null;
    }

    // Clear any existing auth state first
    setCurrentBand(null);
    setCurrentVenue(null);

    let allVenues = venues;
    if (!allVenues || allVenues.length === 0) {
      try {
        allVenues = (await refreshVenues()) || [];
      } catch {
        return null;
      }
    }

    const lower = trimmed.toLowerCase();
    const venue =
      allVenues.find(
        (v) => (v.username || "").toLowerCase() === lower
      ) || null;

    if (!venue) {
      showToast(
        "error",
        `Venue "${trimmed}" was not found. Create it on the signup page first.`
      );
      return null;
    }

    setCurrentVenue(venue);
    setCurrentBand(null);
    showToast("success", `Signed in as ${venue.username}`);
    return venue;
  };

  const signOut = () => {
    setCurrentBand(null);
    setCurrentVenue(null);
    localStorage.removeItem('gigbooker_auth');
    showToast("info", "Signed out");
  };

  // -----------------------
  // Auto-login from stored session
  // -----------------------
  const autoLogin = async () => {
    try {
      const authData = localStorage.getItem('gigbooker_auth');
      if (authData) {
        const { username, role } = JSON.parse(authData);
        
        // Refresh the relevant data first to ensure we have the latest
        if (role === "BAND") {
          await refreshBands();
          return await signInBand(username);
        } else if (role === "VENUE") {
          await refreshVenues();
          return await signInVenue(username);
        }
      }
    } catch (err) {
      console.error("Auto-login failed:", err);
      // Clear invalid auth data
      localStorage.removeItem('gigbooker_auth');
    }
    return null;
  };

  // -----------------------
  // Initial load
  // -----------------------
  useEffect(() => {
    (async () => {
      // Load data first
      await Promise.allSettled([
        refreshBands(),
        refreshVenues(),
        refreshGigs(),
      ]);
      
      // Only try to auto-login if not already signed in
      if (!currentBand && !currentVenue) {
        await autoLogin();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expose autoLogin for use after signup
  const contextValue = useMemo(
    () => ({
      // auth
      currentBand,
      currentVenue,
      signInBand,
      signInVenue,
      signOut,
      autoLogin, // Add this for signup to use

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
    <AppContext.Provider value={contextValue}>
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
