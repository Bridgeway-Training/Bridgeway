import { RefObject } from 'react';

export const createFocusTrap = (containerRef: RefObject<HTMLElement>) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !containerRef.current) return;

    const focusable = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('data-focus-guard'));

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) return;

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return {
    activate() {
      document.addEventListener('keydown', handleKeyDown);
    },
    deactivate() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  };
};
