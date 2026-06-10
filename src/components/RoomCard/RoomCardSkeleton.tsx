const RoomCardSkeleton = () => {
  return (
    <div className="room-card room-card--skeleton">
      <div className="room-card__carousel">
        <div className="u-shimmer" />
      </div>
      <div className="room-card__body">
        <div className="room-card__heading">
          <div className="room-card__skeleton-text room-card__skeleton-text--title u-shimmer" />
          <div className="room-card__skeleton-text room-card__skeleton-text--price u-shimmer" />
        </div>
        <div className="room-card__hr" />
        <div className="room-card__rating-panel">
          <div className="room-card__skeleton-text room-card__skeleton-text--rate u-shimmer" />
          <div className="room-card__skeleton-text room-card__skeleton-text--reviews u-shimmer" />
        </div>
      </div>
    </div>
  );
};

export default RoomCardSkeleton;
