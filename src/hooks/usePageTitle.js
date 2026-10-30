import { useEffect } from "react";

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · CampusCart` : "CampusCart · Study Today, Build Tomorrow";
  }, [title]);
}
