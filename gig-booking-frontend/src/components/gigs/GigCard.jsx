export default function GigCard({ gig, onShowInterest, isOwner }) {
    const venueName =
      gig.venue?.name || gig.venueName || gig.venue?.username || "Venue";
    return (
      <div className="card">
        <div className="card-head">
          <h4>
            {venueName} — {new Date(gig.date).toLocaleString()}
          </h4>
          {onShowInterest && !isOwner && (
            <button onClick={() => onShowInterest(gig.id)}>Show Interest</button>
          )}
        </div>
        <div className="card-body">
          <p>
            <strong>Capacity:</strong> {gig.capacity}
          </p>
          <p>
            <strong>Location:</strong> {gig.location}
          </p>
          <p>
            <strong>Price:</strong>{" "}
            {Number(gig.price).toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
      </div>
    );
  }
  