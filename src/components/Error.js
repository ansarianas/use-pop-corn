export default function Error({ message }) {
  return (
    <p className="error">
      <span>⛔️ {message}</span>
    </p>
  );
}
