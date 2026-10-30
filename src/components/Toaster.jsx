import { useStore } from "../context/store";

export default function Toaster() {
  const { toasts } = useStore();
  if (toasts.length === 0) return null;
  return (
    <div className="toaster" aria-live="polite">
      {toasts.map((toast) => (
        <div className="toast" role="status" key={toast.id}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
