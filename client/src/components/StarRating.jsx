// A small, reusable star-rating display. Renders 5 stars, filled up to
// `value` (rounded to the nearest whole star for simplicity).
const StarRating = ({ value = 0, size = '1rem' }) => {
  const rounded = Math.round(value);
  return (
    <span style={{ fontSize: size, color: '#b45309', letterSpacing: 1 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n}>{n <= rounded ? '★' : '☆'}</span>
      ))}
    </span>
  );
};

export default StarRating;
