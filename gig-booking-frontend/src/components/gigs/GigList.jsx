import GigCard from "./GigCard.jsx";

export default function GigList({ gigs, onShowInterest, ownerVenueId }) {
  if (!gigs?.length) {
    return <p className="muted">No gigs yet.</p>;
    }
  return (
    <div className="grid">
      {gigs.map((gig) => (
        <GigCard
          key={gig.id}
          gig={gig}
          onShowInterest={onShowInterest}
          isOwner={ownerVenueId && gig.venue?.id === ownerVenueId}
        />
      ))}
    </div>
  );
}
