'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Hook that detects if the user prefers reduced motion.
 * Returns true when the OS-level "reduce motion" setting is enabled.
 * Updates reactively if the preference changes while the app is open.
 */
export function useReducedMotion(): boolean {
  const subscribe = (callback: () => void) => {
    const mql = window.matchMedia(QUERY);
    const handler = () => callback();
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  };

  const getSnapshot = () => window.matchMedia(QUERY).matches;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
