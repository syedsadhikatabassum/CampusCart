import { useStore } from "../context/store";

export default function ErrorNote() {
  const { error, loading, reload } = useStore();
  if (!error || loading) return null;
  return (
    <div className="note error-note">
      <p>{error}</p>
      <button type="button" className="btn" onClick={reload}>Try again</button>
    </div>
  );
}
