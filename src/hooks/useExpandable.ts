import { useEffect, useRef, useState } from 'react';

export const useExpandable = <T extends HTMLElement = HTMLElement>(
  isExpandedInitially = false,
  isDisabled = false,
) => {
  const ref = useRef<T>(null);
  const [isExpanded, setIsExpanded] = useState(isExpandedInitially);

  useEffect(() => {
    if (!isExpanded || isDisabled) return;

    const handleOuterClick = (e: MouseEvent) => {
      if (e.target && ref.current && !e.composedPath().includes(ref.current)) {
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleOuterClick, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOuterClick, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded, isDisabled]);

  return { ref, isExpanded, setIsExpanded };
};
