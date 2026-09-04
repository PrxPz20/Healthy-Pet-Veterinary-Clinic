import { useCallback, useEffect, useRef, useState } from "react";
import { publicContentStartsLoaded } from "@/lib/supabase/public-gallery";

type PublicItemsLoader<T> = () => Promise<T[] | null>;
type PublicItemsMerger<T> = (fallback: T[], remote: T[] | null) => T[];

export function usePublicItems<T>(
  fallback: T[],
  loader: PublicItemsLoader<T>,
  merge: PublicItemsMerger<T>,
) {
  const startsLoaded = publicContentStartsLoaded();
  const requestId = useRef(0);
  const [items, setItems] = useState<T[]>(() => (startsLoaded ? fallback : []));
  const [hasLoaded, setHasLoaded] = useState(startsLoaded);
  const [loading, setLoading] = useState(!startsLoaded);
  const [hasError, setHasError] = useState(false);

  const retry = useCallback(async () => {
    if (startsLoaded) return;

    const currentRequest = ++requestId.current;
    setLoading(true);
    setHasError(false);

    let remote: T[] | null = null;
    try {
      remote = await loader();
    } catch {
      // Loaders report diagnostics in development; the public UI stays generic.
    }

    if (currentRequest !== requestId.current) return;

    if (remote === null) {
      setItems((current) => (current.length ? current : merge(fallback, null)));
      setHasError(true);
    } else {
      setItems(merge(fallback, remote));
    }

    setHasLoaded(true);
    setLoading(false);
  }, [fallback, loader, merge, startsLoaded]);

  useEffect(() => {
    void retry();
    return () => {
      requestId.current += 1;
    };
  }, [retry]);

  return { items, hasLoaded, loading, hasError, retry };
}
