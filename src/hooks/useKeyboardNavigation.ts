import { useFocusManager } from '@react-aria/focus';
import { useCallback } from 'react';

export const useKeyboardNavigation = () => {
  const focusManager = useFocusManager();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight': {
          e.preventDefault();
          focusManager?.focusNext({ wrap: true });
          break;
        }
        case 'ArrowUp':
        case 'ArrowLeft': {
          e.preventDefault();
          focusManager?.focusPrevious({ wrap: true });
          break;
        }
        case 'Home': {
          e.preventDefault();
          focusManager?.focusFirst();
          break;
        }
        case 'End': {
          e.preventDefault();
          focusManager?.focusLast();
          break;
        }
      }
    },
    [focusManager],
  );

  return handleKeyDown;
};
