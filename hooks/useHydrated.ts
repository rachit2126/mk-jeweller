'use client';

import { useSyncExternalStore } from 'react';

function emptySubscribe() {
  return () => {};
}

export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
