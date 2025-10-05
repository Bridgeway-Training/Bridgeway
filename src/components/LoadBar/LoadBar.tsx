import { useEffect, useState } from 'react';
import { useLoadBar } from '../../app/providers/LoadBarProvider';
import './LoadBar.css';

export const LoadBar = () => {
  const { active } = useLoadBar();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
    } else {
      const timeout = window.setTimeout(() => setVisible(false), 250);
      return () => window.clearTimeout(timeout);
    }
    return () => undefined;
  }, [active]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      className="load-bar"
      data-active={visible}
    >
      <span className="load-bar__progress" />
    </div>
  );
};
