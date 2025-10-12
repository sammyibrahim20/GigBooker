import { useState } from "react";
import { useAppContext } from "../../context/AppContext.jsx";

export default function BandForm({ onCreated }) {
  const { createBand } = useAppContext();
  const [band, setBand] = useState({
    username: "",
    email: "",
    genre: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBand = await createBand(band);
    if (onCreated) onCreated(newBand);
    setBand({ username: "", email: "", genre: "", description: "" });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Create Band Profile</h3>
      <input
        required
        placeholder="Username"
        value={band.username}
        onChange={(e) => setBand({ ...band, username: e.target.value })}
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={band.email}
        onChange={(e) => setBand({ ...band, email: e.target.value })}
      />
      <input
        placeholder="Genre"
        value={band.genre}
        onChange={(e) => setBand({ ...band, genre: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={band.description}
        onChange={(e) => setBand({ ...band, description: e.target.value })}
      />
      <button type="submit">Save Profile</button>
    </form>
  );
}
