import { useEffect } from "react";
import { useStore } from "../context/store";
import EmptyState from "./EmptyState";

export default function LoginPrompt({ title, text, reason, next }) {
  const { openAuth } = useStore();

  useEffect(() => {
    openAuth({ reason, next });
  }, [openAuth, reason, next]);

  return (
    <div className="page">
      <EmptyState
        title={title}
        text={text}
        action={(
          <button type="button" className="btn" onClick={() => openAuth({ reason, next })}>
            Log in now
          </button>
        )}
      />
    </div>
  );
}
