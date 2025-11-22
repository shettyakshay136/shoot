// src/hooks/useDebouncedAsync.ts
import { useEffect, useRef, useState } from 'react';

type Options = {
  delay?: number; // ms
  immediate?: boolean;
  enabled?: boolean;
  onError?: (e: unknown) => void;
};

export function useDebouncedAsync<TParams, TResult>(
  fn: (params: TParams, signal?: AbortSignal) => Promise<TResult>,
  params: TParams,
  { delay = 300, immediate = false, enabled = true, onError }: Options = {},
) {
  const [data, setData] = useState<TResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [firstRun, setFirstRun] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    const exec = () => {
      abortRef.current = new AbortController();
      setLoading(true);
      fn(params, abortRef.current.signal)
        .then(res => setData(res))
        .catch(e => {
          if (e?.name !== 'AbortError') onError?.(e);
        })
        .finally(() => setLoading(false));
    };

    if (immediate && firstRun) {
      exec();
      setFirstRun(false);
      return;
    }

    timerRef.current = setTimeout(exec, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params), enabled]);

  return { data, loading };
}
