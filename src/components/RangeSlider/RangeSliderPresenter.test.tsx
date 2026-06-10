// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { Mock, Procedure } from '@vitest/spy';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { RangeSliderPresenterProps } from './RangeSliderPresenter';
import RangeSliderPresenter from './RangeSliderPresenter';
import type { IRange } from './range';
import Range from './range';

interface TestWrapperProps extends Partial<
  Omit<RangeSliderPresenterProps<any, IRange>, 'nameFrom' | 'nameTo'>
> {
  range: IRange;
  defaultValues?: {
    from: number;
    to: number;
  };
}

const DEFAULT_VALUES = { from: 20, to: 80 };

const TestWrapper = ({ range, defaultValues = DEFAULT_VALUES, ...props }: TestWrapperProps) => {
  const { control } = useForm({ defaultValues });

  return (
    <RangeSliderPresenter<{ from: number; to: number }, IRange>
      range={range}
      control={control}
      nameFrom="from"
      nameTo="to"
      {...props}
    />
  );
};

const simulateDrag = async (elem: HTMLElement, fromX: number, toX: number) => {
  fireEvent.mouseDown(elem, { clientX: fromX });
  await Promise.resolve();
  fireEvent.mouseMove(window, { clientX: toX });
  await Promise.resolve();
  fireEvent.mouseUp(window);
};

const clickElement = async (elem: HTMLElement, x: number) => {
  fireEvent.mouseDown(elem, { clientX: x });
  await Promise.resolve();
  fireEvent.mouseUp(window);
};

describe('RangeSliderPresenter', () => {
  let range: Range;

  beforeEach(() => {
    vi.clearAllMocks();

    range = new Range();
    range.setState({ min: 0, max: 100, from: 20, to: 80, step: 1 });

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 100,
      height: 10,
      top: 0,
      left: 0,
      bottom: 10,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);
  });

  it('should sync model state with view on init', () => {
    render(<TestWrapper range={range} />);

    const handleFrom = screen.getByLabelText('from');
    const handleTo = screen.getByLabelText('to');

    expect(handleFrom.getAttribute('aria-valuenow')).toBe('20');
    expect(handleTo.getAttribute('aria-valuenow')).toBe('80');
  });

  describe('keyboard navigation', () => {
    it('should increment "from" value on ArrowRight or ArrowUp', () => {
      render(<TestWrapper range={range} />);
      const handleFrom = screen.getByLabelText('from');

      fireEvent.keyDown(handleFrom, { key: 'ArrowRight' });

      expect(range.getState().from).toBe(21);

      fireEvent.keyDown(handleFrom, { key: 'ArrowUp' });

      expect(range.getState().from).toBe(22);
    });

    it('should decrement "to" value on ArrowLeft or ArrowDown', () => {
      render(<TestWrapper range={range} />);
      const handleTo = screen.getByLabelText('to');

      fireEvent.keyDown(handleTo, { key: 'ArrowLeft' });

      expect(range.getState().to).toBe(79);

      fireEvent.keyDown(handleTo, { key: 'ArrowDown' });

      expect(range.getState().to).toBe(78);
    });

    it('should move "from" by big step (step * 10) on PageUp and PageDown', () => {
      render(<TestWrapper range={range} />);
      const handleFrom = screen.getByLabelText('from');

      fireEvent.keyDown(handleFrom, { key: 'PageUp' });

      expect(range.getState().from).toBe(30);

      fireEvent.keyDown(handleFrom, { key: 'PageDown' });

      expect(range.getState().from).toBe(20);
    });

    it('should move "to" by big step (step * 10) on PageUp and PageDown', () => {
      render(<TestWrapper range={range} />);
      const handleTo = screen.getByLabelText('to');

      fireEvent.keyDown(handleTo, { key: 'PageUp' });

      expect(range.getState().to).toBe(90);

      fireEvent.keyDown(handleTo, { key: 'PageDown' });

      expect(range.getState().to).toBe(80);
    });

    it('should jump to min/max on Home and End keys', () => {
      render(<TestWrapper range={range} />);
      const handleFrom = screen.getByLabelText('from');
      const handleTo = screen.getByLabelText('to');

      fireEvent.keyDown(handleFrom, { key: 'Home' });

      expect(range.getState().from).toBe(0);

      fireEvent.keyDown(handleTo, { key: 'End' });

      expect(range.getState().to).toBe(100);
    });

    it('should respect boundaries with keyboard ["from"]', () => {
      range.setState({ min: 75, from: 79, to: 80, step: 1 });
      render(<TestWrapper range={range} defaultValues={{ from: 79, to: 80 }} />);
      const handleFrom = screen.getByLabelText('from');

      fireEvent.keyDown(handleFrom, { key: 'PageDown' });

      expect(range.getState().from).toBe(75);

      fireEvent.keyDown(handleFrom, { key: 'PageUp' });

      expect(range.getState().from).toBe(80);
    });

    it('should respect boundaries with keyboard ["to"]', () => {
      range.setState({ min: 75, from: 79, to: 80, max: 84, step: 1 });

      render(<TestWrapper range={range} defaultValues={{ from: 79, to: 80 }} />);

      const handleTo = screen.getByLabelText('to');

      fireEvent.keyDown(handleTo, { key: 'PageDown' });

      expect(range.getState().to).toBe(79);

      fireEvent.keyDown(handleTo, { key: 'PageUp' });

      expect(range.getState().to).toBe(84);
    });

    it('should ignore keyboard events when disabled', () => {
      render(<TestWrapper range={range} disabled />);
      const handleFrom = screen.getByLabelText('from');
      const handleTo = screen.getByLabelText('to');

      fireEvent.keyDown(handleFrom, { key: 'ArrowRight' });

      expect(range.getState().from).toBe(20);

      fireEvent.keyDown(handleTo, { key: 'ArrowLeft' });

      expect(range.getState().to).toBe(80);
    });

    it('should ignore keyboard events for fixed handles ["from" is fixed]', () => {
      range.setState({ isFromFixed: true, from: 20 });
      render(<TestWrapper range={range} />);
      const handleFrom = screen.getByLabelText('from');

      fireEvent.keyDown(handleFrom, { key: 'ArrowRight' });

      expect(range.getState().from).toBe(20);
    });

    it('should ignore keyboard events for fixed handles ["to" is fixed]', () => {
      range.setState({ isToFixed: true, from: 20 });
      render(<TestWrapper range={range} />);
      const handleTo = screen.getByLabelText('to');

      fireEvent.keyDown(handleTo, { key: 'ArrowRight' });

      expect(range.getState().to).toBe(80);
    });

    it('should move both handles for fixed range', () => {
      range.setState({ isRangeFixed: true, from: 20 });
      render(<TestWrapper range={range} />);
      const handleFrom = screen.getByLabelText('from');

      fireEvent.keyDown(handleFrom, { key: 'PageUp' });

      const state = range.getState();
      expect(state.from).toBe(30);
      expect(state.to).toBe(90);
    });

    it('should move range when isRangeDraggable is true', () => {
      range.setState({ from: 20 });
      render(<TestWrapper range={range} isRangeDraggable />);
      const handleFrom = screen.getByTestId('range');

      fireEvent.keyDown(handleFrom, { key: 'PageUp' });

      const state = range.getState();
      expect(state.from).toBe(30);
      expect(state.to).toBe(90);
    });
  });

  describe('mouse events', () => {
    describe('direct handle dragging', () => {
      it('should update "from" when dragging the first handle', async () => {
        render(<TestWrapper range={range} />);
        const handleFrom = screen.getByLabelText('from');

        await act(async () => {
          simulateDrag(handleFrom, 20, 35);
        });

        expect(range.getState().from).toBe(35);
      });

      it('should update "to" when dragging the second handle', async () => {
        render(<TestWrapper range={range} />);
        const handleTo = screen.getByLabelText('to');

        await act(async () => {
          simulateDrag(handleTo, 80, 55);
        });

        expect(range.getState().to).toBe(55);
      });

      it('should not allow handles to cross each other during drag', async () => {
        render(<TestWrapper range={range} />);
        const handleFrom = screen.getByLabelText('from');

        await act(async () => {
          simulateDrag(handleFrom, 20, 100);
        });

        expect(range.getState().from).toBe(80);
      });

      it('should ignore "from" dragging when isFromFixed is true', async () => {
        range.setState({ isFromFixed: true });
        render(<TestWrapper range={range} />);
        const handleFrom = screen.getByLabelText('from');

        await act(async () => {
          simulateDrag(handleFrom, 20, 35);
        });

        const state = range.getState();
        expect(state.from).toBe(20);
        expect(state.to).toBe(80);
      });

      it('should ignore "to" dragging when isToFixed is true', async () => {
        range.setState({ isToFixed: true });
        render(<TestWrapper range={range} />);
        const handleTo = screen.getByLabelText('to');

        await act(async () => {
          simulateDrag(handleTo, 80, 65);
        });

        const state = range.getState();
        expect(state.from).toBe(20);
        expect(state.to).toBe(80);
      });

      it('should move both handles when dragging and isRangeFixed is true', async () => {
        range.setState({ isRangeFixed: true });
        render(<TestWrapper range={range} />);
        const handleFrom = screen.getByLabelText('from');

        await act(async () => {
          simulateDrag(handleFrom, 20, 35);
        });

        const state = range.getState();
        expect(state.from).toBe(35);
        expect(state.to).toBe(95);
      });
    });

    describe('track interactions', () => {
      it('should move the closest handle to the clicked position on the track', async () => {
        render(<TestWrapper range={range} />);
        const track = screen.getByTestId('target');

        await act(async () => {
          clickElement(track, 15);
        });

        expect(range.getState().from).toBe(15);

        await act(async () => {
          clickElement(track, 90);
        });

        expect(range.getState().to).toBe(90);
      });

      it('should move both handles when isRangeFixed is true', async () => {
        range.setState({ isRangeFixed: true });
        render(<TestWrapper range={range} />);
        const track = screen.getByTestId('target');

        await act(async () => {
          clickElement(track, 10);
        });

        const state = range.getState();
        expect(state.from).toBe(10);
        expect(state.to).toBe(70);
      });

      it('should move "from" when isToFixed is true', async () => {
        range.setState({ isToFixed: true });
        render(<TestWrapper range={range} />);
        const track = screen.getByTestId('target');

        await act(async () => {
          clickElement(track, 90);
        });

        const state = range.getState();
        expect(state.from).toBe(80);
        expect(state.to).toBe(80);
      });

      it('should move "to" when isFromFixed is true', async () => {
        range.setState({ isFromFixed: true });
        render(<TestWrapper range={range} />);
        const track = screen.getByTestId('target');

        await act(async () => {
          clickElement(track, 10);
        });

        const state = range.getState();
        expect(state.from).toBe(20);
        expect(state.to).toBe(20);
      });
    });

    describe('range interaction', () => {
      it('should move the closest handle to the clicked position on the range', async () => {
        render(<TestWrapper range={range} />);
        const rangeElement = screen.getByTestId('range');

        await act(async () => {
          clickElement(rangeElement, 40);
        });

        expect(range.getState().from).toBe(40);

        await act(async () => {
          clickElement(rangeElement, 70);
        });

        expect(range.getState().to).toBe(70);
      });

      it('should move both handles when dragging the active range segment', async () => {
        render(<TestWrapper range={range} isRangeDraggable />);
        const rangeElement = screen.getByTestId('range');

        await act(async () => {
          simulateDrag(rangeElement, 30, 40);
        });

        const state = range.getState();
        expect(state.from).toBe(30);
        expect(state.to).toBe(90);

        await act(async () => {
          simulateDrag(rangeElement, 70, 40);
        });

        const stateSec = range.getState();
        expect(stateSec.from).toBe(0);
        expect(stateSec.to).toBe(60);
      });

      it.each(['isFromFixed', 'isToFixed'])(
        'should prevent range dragging when %s is true',
        async (isFixed) => {
          range.setState({ [isFixed]: true });
          render(<TestWrapper range={range} isRangeDraggable />);
          const rangeElement = screen.getByTestId('range');

          await act(async () => {
            simulateDrag(rangeElement, 30, 40);
          });

          const state = range.getState();
          expect(state.from).toBe(20);
          expect(state.to).toBe(80);
        },
      );

      it('should move "from" when isToFixed is true', async () => {
        range.setState({ isToFixed: true });
        render(<TestWrapper range={range} />);
        const rangeElement = screen.getByTestId('range');

        await act(async () => {
          clickElement(rangeElement, 50);
        });

        const state = range.getState();
        expect(state.from).toBe(50);
        expect(state.to).toBe(80);
      });

      it('should move "to" when isFromFixed is true', async () => {
        range.setState({ isFromFixed: true });
        render(<TestWrapper range={range} />);
        const rangeElement = screen.getByTestId('range');

        await act(async () => {
          clickElement(rangeElement, 50);
        });

        const state = range.getState();
        expect(state.from).toBe(20);
        expect(state.to).toBe(50);
      });
    });

    it('should ignore mouse events when slider is disabled', async () => {
      render(<TestWrapper range={range} disabled />);

      const rangeElem = screen.getByTestId('range');
      const target = screen.getByTestId('target');
      const handleFrom = screen.getByLabelText('from');
      const handleTo = screen.getByLabelText('to');

      await act(async () => {
        clickElement(rangeElem, 50);
        await clickElement(rangeElem, 70);
        await clickElement(target, 10);
        await clickElement(target, 90);
      });

      const state = range.getState();
      expect(state.from).toBe(20);
      expect(state.to).toBe(80);

      await act(async () => {
        simulateDrag(handleFrom, 20, 50);
        await simulateDrag(handleTo, 80, 65);
      });

      const stateSec = range.getState();
      expect(stateSec.from).toBe(20);
      expect(stateSec.to).toBe(80);

      await act(async () => {
        simulateDrag(rangeElem, 30, 50);
      });

      const stateThird = range.getState();
      expect(stateThird.from).toBe(20);
      expect(stateThird.to).toBe(80);
    });
  });

  describe('form integration', () => {
    let onFromChange: Mock<Procedure>;
    let onToChange: Mock<Procedure>;

    const FormWatcher = ({ range, ...props }: TestWrapperProps) => {
      const { control, watch } = useForm({
        defaultValues: { from: 20, to: 80 },
      });

      const watchedFrom = watch('from');
      const watchedTo = watch('to');

      useEffect(() => {
        onFromChange(watchedFrom);
      }, [watchedFrom]);
      useEffect(() => {
        onToChange(watchedTo);
      }, [watchedTo]);

      return (
        <RangeSliderPresenter<{ from: number; to: number }, IRange>
          range={range}
          control={control}
          nameFrom="from"
          nameTo="to"
          {...props}
        />
      );
    };

    beforeEach(() => {
      vi.clearAllMocks();

      onFromChange = vi.fn();
      onToChange = vi.fn();

      render(<FormWatcher range={range} />);

      onFromChange.mockClear();
      onToChange.mockClear();
    });

    it('should call onChange for the correct field during drag', async () => {
      const handleFrom = screen.getByLabelText('from');
      await act(async () => {
        simulateDrag(handleFrom, 20, 30);
      });

      expect(onFromChange).toHaveBeenCalledWith(30);

      const handleTo = screen.getByLabelText('to');
      await act(async () => {
        simulateDrag(handleTo, 80, 70);
      });

      expect(onToChange).toHaveBeenCalledWith(70);
    });

    it('should call onChange for the correct field when clicking target', async () => {
      const target = screen.getByTestId('target');
      await act(async () => {
        clickElement(target, 10);
      });

      expect(onFromChange).toHaveBeenCalledWith(10);

      await act(async () => {
        clickElement(target, 90);
      });

      expect(onToChange).toHaveBeenCalledWith(90);
    });

    it('should call onChange for the correct field when clicking range', async () => {
      const rangeElem = screen.getByTestId('range');
      await act(async () => {
        clickElement(rangeElem, 40);
      });

      expect(onFromChange).toHaveBeenCalledWith(40);

      await act(async () => {
        clickElement(rangeElem, 70);
      });

      expect(onToChange).toHaveBeenCalledWith(70);
    });

    it('should call onChange for "from" and "to" when range is dragging', async () => {
      cleanup();

      render(<FormWatcher range={range} isRangeDraggable />);

      const rangeElem = screen.getByTestId('range');
      await act(async () => {
        simulateDrag(rangeElem, 40, 60);
      });

      expect(onFromChange).toHaveBeenCalledWith(40);
      expect(onToChange).toHaveBeenCalledWith(100);
    });
  });

  describe('vertical orientation', () => {
    const simulateDragVertical = async (elem: HTMLElement, fromY: number, toY: number) => {
      fireEvent.mouseDown(elem, { clientY: fromY });
      await Promise.resolve();
      fireEvent.mouseMove(elem, { clientY: toY });
      await Promise.resolve();
      fireEvent.mouseUp(elem);
    };

    const clickElementVertical = async (elem: HTMLElement, y: number) => {
      fireEvent.mouseDown(elem, { clientY: y });
      await Promise.resolve();
      fireEvent.mouseUp(elem);
    };

    beforeEach(() => {
      vi.resetAllMocks();

      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
        width: 10,
        height: 100,
        top: 0,
        left: 0,
        bottom: 100,
        right: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      } as DOMRect);
    });

    it('should apply orientation prop', async () => {
      const { container } = render(<TestWrapper range={range} orientation="vertical" />);

      const rangeSlider = container.firstChild as HTMLElement;
      expect(rangeSlider.className.includes('--vertical')).toBe(true);
    });

    it('should process vertical track clicks', async () => {
      render(<TestWrapper range={range} orientation="vertical" />);

      const track = screen.getByTestId('target');

      await act(async () => {
        clickElementVertical(track, 10);
      });

      expect(range.getState().to).toBe(90);

      await act(async () => {
        clickElementVertical(track, 90);
      });

      expect(range.getState().from).toBe(10);
    });

    it('should process vertical range clicks', async () => {
      render(<TestWrapper range={range} orientation="vertical" />);

      const rangeElem = screen.getByTestId('range');

      await act(async () => {
        clickElementVertical(rangeElem, 70);
      });

      const state = range.getState();
      expect(state.from).toBe(30);
      expect(state.to).toBe(80);
    });

    it('should process vertical handle drag', async () => {
      render(<TestWrapper range={range} orientation="vertical" />);

      const handleFrom = screen.getByLabelText('from');
      const handleTo = screen.getByLabelText('to');

      await act(async () => {
        simulateDragVertical(handleTo, 20, 30);
      });

      expect(range.getState().to).toBe(70);

      await act(async () => {
        simulateDragVertical(handleFrom, 80, 60);
      });

      expect(range.getState().from).toBe(40);
    });

    it('should process vertical range drag when range is draggable', async () => {
      render(<TestWrapper range={range} orientation="vertical" isRangeDraggable />);

      const rangeElem = screen.getByTestId('range');

      await act(async () => {
        simulateDragVertical(rangeElem, 40, 55);
      });

      const state = range.getState();
      expect(state.from).toBe(5);
      expect(state.to).toBe(65);
    });
  });
});
