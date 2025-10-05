export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const prefersHighContrast = () =>
  window.matchMedia('(prefers-contrast: more), (forced-colors: active)').matches;

export const prefersSaveData = () =>
  'connection' in navigator &&
  // @ts-expect-error experimental
  navigator.connection?.saveData === true;

export const prefersEffectiveTypeSlow = () => {
  if ('connection' in navigator) {
    // @ts-expect-error experimental
    const effectiveType = navigator.connection?.effectiveType as string | undefined;
    return effectiveType === 'slow-2g' || effectiveType === '2g';
  }
  return false;
};
