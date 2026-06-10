import { useCallback } from 'react';

import type { HandleGridKeyDown, NavStep, SheetFormat, Shift } from './Calendar.types';
import { compareMonths, compareYears } from './Calendar.utils';
import type FocusController from './FocusController';

interface NavigationParams {
  activeSheetDate: Date;
  sheetFormat: SheetFormat;
  focusedDate: Date;
  isDirty: boolean;
  isSliding: boolean;
  isZooming: boolean;
  shiftSheet: (shift: Shift) => void;
  onHover: (date: Date | null) => void;
  focusController: FocusController;
}

const useKeyboardNavigation = ({
  activeSheetDate,
  sheetFormat,
  focusedDate,
  isDirty,
  isSliding,
  isZooming,
  shiftSheet,
  onHover,
  focusController,
}: NavigationParams) => {
  const moveFocus = useCallback(
    (offset: number, unit: NavStep) => {
      if (isSliding || isZooming) return;

      const { focusedDate } = focusController.getStatus();
      const next = new Date(focusedDate);

      if (sheetFormat === 'month') {
        next.setDate(next.getDate() + (unit === 'row' ? offset * 7 : offset));
      } else {
        next.setMonth(next.getMonth() + (unit === 'row' ? offset * 4 : offset));
      }

      const diff =
        sheetFormat === 'month'
          ? compareMonths(next, activeSheetDate)
          : compareYears(next, activeSheetDate);

      focusController.send('NAVIGATE', { nextDate: next });

      if (sheetFormat === 'month') {
        onHover(next);
      }

      if (diff !== 0) {
        requestAnimationFrame(() => {
          shiftSheet(diff);

          focusController.send('NAVIGATE', {
            nextDate: next,
            needsShift: true,
            show: true,
          });
        });
      }
    },
    [activeSheetDate, sheetFormat, isSliding, isZooming, focusController, onHover, shiftSheet],
  );

  const handleGridKeyDown: HandleGridKeyDown = useCallback(
    (e, onSelect) => {
      switch (e.key) {
        case 'ArrowRight':
          moveFocus(1, 'step');
          break;
        case 'ArrowLeft':
          moveFocus(-1, 'step');
          break;
        case 'ArrowDown':
          moveFocus(1, 'row');
          break;
        case 'ArrowUp':
          moveFocus(-1, 'row');
          break;
        case 'Enter':
        case ' ': {
          onSelect(focusController.getStatus().focusedDate, e);
          break;
        }
        case 'Tab': {
          onHover(null);
          return;
        }
        default:
          return;
      }

      e.preventDefault();
    },
    [moveFocus, focusController],
  );

  const handleFocusTrap = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const first = focusController.staticNodes.get('btn-prev');
      const last = focusController.staticNodes.get('btn-apply');

      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        focusController.send('FOCUS_STATIC', { id: 'btn-apply' });
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        focusController.send('FOCUS_STATIC', { id: 'btn-prev' });
      }
    },
    [focusController],
  );

  const handleNextKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        onHover(focusedDate);
      }
    },
    [focusedDate, onHover],
  );

  const handleApplyKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab' && e.shiftKey && !isDirty) {
        onHover(focusedDate);
      }
    },
    [isDirty, focusedDate, onHover],
  );

  const handleClearKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab' && e.shiftKey) {
        onHover(focusedDate);
      }
    },
    [focusedDate, onHover],
  );

  return {
    handleGridKeyDown,
    handleNextKeyDown,
    handleApplyKeyDown,
    handleClearKeyDown,
    handleFocusTrap,
  };
};

export default useKeyboardNavigation;
