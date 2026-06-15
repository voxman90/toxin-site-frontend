export type FocusEvent =
  | 'EXPANDED'
  | 'COLLAPSED'
  | 'NAVIGATE'
  | 'SET_FOCUSED_DATE'
  | 'ANIMATION_END'
  | 'RANGE_PICKED'
  | 'CLEARED'
  | 'EXTERNAL_FOCUS_REQUEST'
  | 'FOCUS_STATIC';

export type FocusTarget =
  | 'btn-apply'
  | 'btn-clear'
  | 'btn-title'
  | 'btn-prev'
  | 'btn-next'
  | 'output-from'
  | 'output-to'
  | 'grid';

export interface FocusSetters {
  setFocusedDate: (d: Date) => void;
  setFocusedTarget: (id: FocusTarget | null) => void;
}

export interface FocusStatus {
  focusedDate: Date;
  isSliding: boolean;
  isZooming: boolean;
}

export interface FocusPayload {
  nextDate?: Date;
  needsShift?: boolean;
  id?: FocusTarget;
  show?: boolean;
  initialDate?: Date;
}

class FocusController {
  private abortController: AbortController | null = null;
  gridRef: HTMLElement | null = null;
  staticNodes = new Map<string, HTMLElement>();
  triggerNode: HTMLElement | null = null;
  pendingDate: Date | null = null;
  setters: FocusSetters;
  getStatus: () => FocusStatus;

  constructor(setters: FocusSetters, getStatus: () => FocusStatus) {
    this.registerStatic = this.registerStatic.bind(this);
    this.registerGrid = this.registerGrid.bind(this);
    this.send = this.send.bind(this);
    this.setters = setters;
    this.getStatus = getStatus;
  }

  registerStatic(id: FocusTarget, node: HTMLElement | null): void {
    if (node) {
      this.staticNodes.set(id, node);
    } else {
      this.staticNodes.delete(id);
    }
  }

  registerGrid(node: HTMLElement | null): void {
    this.gridRef = node;

    if (node && this.pendingDate) {
      this.executeGridFocus(this.pendingDate);
      this.pendingDate = null;
    }
  }

  send(event: FocusEvent, payload?: FocusPayload): void {
    const { isSliding, isZooming } = this.getStatus();

    switch (event) {
      case 'EXPANDED': {
        this.triggerNode = document.activeElement as HTMLElement;

        if (payload?.initialDate) {
          const target = payload.initialDate;
          this.setters.setFocusedDate(target);

          this.pendingDate = target;

          if (payload.show) {
            this.setters.setFocusedTarget('grid');
            this.attachCleanup();
          }

          if (this.gridRef) {
            this.executeGridFocus(target, payload.show);
            this.pendingDate = null;
          }
        }

        break;
      }

      case 'COLLAPSED': {
        this.setters.setFocusedTarget(null);

        if (this.triggerNode) {
          const node = this.triggerNode;
          this.triggerNode = null;
          requestAnimationFrame(() => node.focus({ preventScroll: true }));
        }

        break;
      }

      case 'SET_FOCUSED_DATE': {
        if (payload?.nextDate) {
          this.setters.setFocusedDate(payload.nextDate);
        }

        break;
      }

      case 'NAVIGATE': {
        if (payload?.nextDate) {
          const { nextDate, needsShift } = payload;

          this.setters.setFocusedDate(nextDate);

          if (needsShift) {
            this.pendingDate = nextDate;
          } else if (!isSliding && !isZooming) {
            this.executeGridFocus(nextDate);
          }
        }

        if (payload?.show) {
          this.setters.setFocusedTarget('grid');
          this.attachCleanup();
        }

        break;
      }

      case 'ANIMATION_END': {
        if (this.pendingDate) {
          this.executeGridFocus(this.pendingDate);
          this.pendingDate = null;
        }

        break;
      }

      case 'FOCUS_STATIC': {
        if (payload?.id) {
          const node = this.staticNodes.get(payload.id);
          if (node) {
            node.focus({ preventScroll: true });
          }
        }

        break;
      }

      case 'RANGE_PICKED': {
        this.send('FOCUS_STATIC', { id: 'btn-apply' });
        break;
      }

      case 'CLEARED': {
        if (payload?.nextDate) {
          this.setters.setFocusedDate(payload.nextDate);
        }

        this.send('FOCUS_STATIC', { id: 'btn-apply' });
        break;
      }

      case 'EXTERNAL_FOCUS_REQUEST': {
        if (payload?.id) {
          this.setters.setFocusedTarget(payload.id);
          this.send('FOCUS_STATIC', { id: payload.id });
          this.attachCleanup();
        }

        break;
      }
    }
  }

  private attachCleanup() {
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();
    const { signal } = this.abortController;

    const cleanup = () => {
      this.setters.setFocusedTarget(null);

      if (this.abortController) {
        this.abortController.abort();
        this.abortController = null;
      }
    };

    queueMicrotask(() => {
      if (signal.aborted) return;

      window.addEventListener('focus', cleanup, { once: true, capture: true, signal });
    });

    setTimeout(() => {
      if (signal.aborted) return;

      window.addEventListener('keydown', cleanup, { once: true, capture: true, signal });
      window.addEventListener('mousedown', cleanup, { once: true, capture: true, signal });
    }, 0);
  }

  private executeGridFocus(date: Date, show = true): void {
    const cell = this.gridRef?.querySelector<HTMLElement>(`[data-date="${date.getTime()}"]`);

    if (cell) {
      if (!show) {
        cell.setAttribute('data-focus-silent', 'true');

        const removeSilent = (e: KeyboardEvent | Event) => {
          if (e instanceof KeyboardEvent) {
            const navKeys = [
              'ArrowUp',
              'ArrowDown',
              'ArrowLeft',
              'ArrowRight',
              'Tab',
              'Enter',
              ' ',
            ];
            if (!navKeys.includes(e.key)) return;
          }

          cell.removeAttribute('data-focus-silent');
          cell.removeEventListener('blur', removeSilent);
          cell.removeEventListener('keydown', removeSilent);
        };

        cell.addEventListener('blur', removeSilent, { once: true });
        cell.addEventListener('keydown', removeSilent, { once: true });
      }

      cell.focus({ preventScroll: true });
    }
  }
}

export default FocusController;
