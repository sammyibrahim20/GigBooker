import { useState } from "react";
import { useAppContext } from "../../context/AppContext.jsx";

export default function VenueForm({ onCreated }) {
  const { createVenue } = useAppContext();
  const [venue, setVenue] = useState({
    username: "",
    email: "",
    name: "",
    contact: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newVenue = await createVenue(venue);
    if (onCreated) onCreated(newVenue);
    setVenue({ username: "", email: "", name: "", contact: "", description: "" });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Create Venue Profile</h3>
      <input
        required
        placeholder="Username"
        value={venue.username}
        onChange={(e) => setVenue({ ...venue, username: e.target.value })}
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={venue.email}
        onChange={(e) => setVenue({ ...venue, email: e.target.value })}
      />
      <input
        placeholder="Company / Venue Name"
        value={venue.name}
        onChange={(e) => setVenue({ ...venue, name: e.target.value })}
      />
      <input
        placeholder="Contact Info"
        value={venue.contact}
        onChange={(e) => setVenue({ ...venue, contact: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={venue.description}
        onChange={(e) => setVenue({ ...venue, description: e.target.value })}
      />
      <button type="submit">Save Profile</button>
    </form>
  );
}
