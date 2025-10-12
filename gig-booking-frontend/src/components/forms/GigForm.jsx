import { useState } from "react";
import { useAppContext } from "../../context/AppContext.jsx";

export default function GigForm() {
  const { currentVenue, createGig } = useAppContext();
  const [form, setForm] = useState({
    capacity: "",
    location: "Indoor",
    price: "",
    date: "",
  });

  const disabled = !currentVenue;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createGig(form);
    setForm({ capacity: "", location: "Indoor", price: "", date: "" });
  };

  return (
    <form className="form inline" onSubmit={handleSubmit}>
      <h3>Create a Gig</h3>
      {!currentVenue && (
        <p className="muted">Sign in as a venue to create gigs.</p>
      )}
      <div className="row">
        <input
          required
          name="capacity"
          type="number"
          min={1}
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
          disabled={disabled}
        />
        <select
          name="location"
          value={form.location}
          onChange={handleChange}
          disabled={disabled}
        >
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
        </select>
      </div>
      <div className="row">
        <input
          required
          name="price"
          type="number"
          min={0}
          step="1"
          placeholder="Price (USD)"
          value={form.price}
          onChange={handleChange}
          disabled={disabled}
        />
        <input
          required
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      <button type="submit" disabled={disabled}>Create Gig</button>
    </form>
  );
}
