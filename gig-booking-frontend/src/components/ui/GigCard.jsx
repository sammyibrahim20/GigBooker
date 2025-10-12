export default function GigCard({ gig, onShowInterest, isOwner }) {
    return (
      <div className="card">
        <div className="card-head">
          <h4>{gig.venueName || "Venue"} — {new Date(gig.date).toLocaleString()}</h4>
        </div>
        <div className="card-body">
          <p><strong>Capacity:</strong> {gig.capacity}</p>
          <p><strong>Location:</strong> {gig.location}</p>
          <p><strong>Price:</strong> ${Number(gig.price).toLocaleString()}</p>
        </div>
        <div className="card-actions">
          {onShowInterest && !isOwner && (
            <button onClick={() => onShowInterest(gig.id)}>Show Interest</button>
          )}
        </div>
      </div>
    );
  }
  