// @vitest-environment happy-dom
import { fireEvent, render, screen } from '@testing-library/react';
import type { Mock, Procedure } from '@vitest/spy';
import React, { act, useEffect, useMemo } from 'react';
import type { DefaultValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DropdownOption, DropdownProps, DropdownRef, DropdownValues } from './Dropdown';
import Dropdown from './Dropdown';

interface TestDropdownOpts {
  options: {
    a: number;
    b: number;
  };
}

type FormWatcherProps = {
  values?: TestDropdownOpts;
  defaultValues?: DefaultValues<TestDropdownOpts>;
} & Partial<DropdownProps<TestDropdownOpts>>;

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { option: string }) => {
      return !options ? key : `${key} ${options.option}`;
    },
  }),
}));

const { focusNextMock } = vi.hoisted(() => ({
  focusNextMock: vi.fn(),
}));

vi.mock('@react-aria/focus', () => ({
  FocusScope: ({ children }: { children: React.ReactNode }) => children,
  useFocusManager: vi.fn(() => ({
    focusNext: focusNextMock,
  })),
}));

describe('Dropdown', () => {
  let onOptionsChange: Mock<Procedure>;

  const FormWatcher = ({ values, defaultValues, ...rest }: FormWatcherProps) => {
    const { t } = useTranslation();
    const { control, watch } = useForm<TestDropdownOpts>({
      values,
      defaultValues,
    });

    const options: DropdownOption[] = useMemo(
      () => [
        { name: 'a', label: t('optA'), defaultValue: 0, range: [0, 10] },
        { name: 'b', label: t('optB'), defaultValue: 0, range: [0, 10] },
      ],
      [t],
    );

    const watchedOptions = watch('options');

    useEffect(() => {
      onOptionsChange(watchedOptions);
    }, [watchedOptions]);

    return (
      <Dropdown
        control={control}
        options={options}
        getDisplayedValue={(state: DropdownValues) =>
          Object.entries(state)
            .map(([key, value]) => `${key}:${value}`)
            .join(', ')
        }
        name="options"
        {...rest}
      />
    );
  };

  const getFormOutputs = () => ({
    display: screen.getByTestId('display-value').textContent,
    optA: screen.getByTestId('output optA').textContent,
    optB: screen.getByTestId('output optB').textContent,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    onOptionsChange = vi.fn();
  });

  describe('initial rendering and validation', () => {
    it('should render default values when form state is empty', () => {
      render(<FormWatcher isExpanded />);

      const outputs = getFormOutputs();

      expect(outputs.display).toBe('a:0, b:0');
      expect(outputs.optA).toBe('0');
      expect(outputs.optB).toBe('0');
    });

    it('should render field values when defaultValues in form state is provided', () => {
      render(<FormWatcher defaultValues={{ options: { a: 1, b: 2 } }} isExpanded />);

      const outputs = getFormOutputs();

      expect(outputs.display).toBe('a:1, b:2');
      expect(outputs.optA).toBe('1');
      expect(outputs.optB).toBe('2');
    });

    it('should synchronize values with form values', () => {
      render(<FormWatcher values={{ options: { a: 1, b: 2 } }} isExpanded />);

      const outputs = getFormOutputs();

      expect(outputs.display).toBe('a:1, b:2');
      expect(outputs.optA).toBe('1');
      expect(outputs.optB).toBe('2');
    });

    it('should not render controls by default', () => {
      render(<FormWatcher isExpanded values={{ options: { a: 1, b: 2 } }} />);

      expect(screen.queryByTestId('clear')).toBeNull();
      expect(screen.queryByTestId('apply')).toBeNull();
    });

    it('should render controls when hasControls is true', () => {
      render(<FormWatcher isExpanded values={{ options: { a: 1, b: 2 } }} hasControls />);

      screen.getByTestId('clear');
      screen.getByTestId('apply');
    });
  });

  describe('expansion behavior', () => {
    it('should not be expanded by default', () => {
      render(<FormWatcher />);

      expect(screen.queryByLabelText('optA')).toBeNull();
    });

    it('should be expanded when isExpanded is true', () => {
      render(<FormWatcher isExpanded />);

      screen.getByLabelText('optA');
    });

    it('should toggle when display button is clicked', () => {
      render(<FormWatcher />);
      const display = screen.getByTestId('display');

      fireEvent.click(display);

      screen.getByLabelText('optA');

      fireEvent.click(display);

      expect(screen.queryByLabelText('optA')).toBeNull();
    });

    it('should not expand when isExpandingDisabled is true', () => {
      render(<FormWatcher isExpandingDisabled />);
      const display = screen.getByTestId('display');

      fireEvent.click(display);

      expect(screen.queryByLabelText('optA')).toBeNull();
    });

    it('should close when Ecs pressed', () => {
      render(<FormWatcher isExpanded />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(screen.queryByLabelText('optA')).toBeNull();
    });

    it('should close when clicked outside the dropdown', () => {
      render(<FormWatcher isExpanded />);

      fireEvent.mouseDown(document.body);

      expect(screen.queryByLabelText('optA')).toBeNull();
    });
  });

  describe('clear behavior', () => {
    it('should disable clear button when draft is not dirty', () => {
      render(
        <FormWatcher
          isExpanded
          hasControls
          values={{ options: { a: 5, b: 5 } }}
          options={[
            { name: 'a', label: 'optA', defaultValue: 5, range: [0, 10] },
            { name: 'b', label: 'optB', defaultValue: 5, range: [0, 10] },
          ]}
        />,
      );

      expect((screen.getByTestId('clear') as HTMLButtonElement).disabled).toBe(true);
    });

    it('should handle clear workflow when draft is dirty', () => {
      render(<FormWatcher isExpanded hasControls values={{ options: { a: 2, b: 4 } }} />);

      const clearBtn = screen.getByTestId('clear') as HTMLButtonElement;

      expect(clearBtn.disabled).toBe(false);

      fireEvent.click(clearBtn);

      const options = getFormOutputs();
      expect(options.display).toBe('a:2, b:4');
      expect(options.optA).toBe('0');
      expect(options.optB).toBe('0');
    });
  });

  describe('apply behavior', async () => {
    it('should close dropdown when apply button is pressed', () => {
      render(<FormWatcher isExpanded hasControls />);

      fireEvent.click(screen.getByTestId('apply'));

      expect(screen.queryByTestId('output optA')).toBeNull();
    });

    it('should apply changes from the draft', async () => {
      render(<FormWatcher isExpanded hasControls values={{ options: { a: 1, b: 2 } }} />);

      fireEvent.click(screen.getByLabelText('decrease optA'));
      fireEvent.click(screen.getByLabelText('increase optB'));
      fireEvent.click(screen.getByTestId('apply'));

      expect(screen.getByTestId('display-value').textContent).toBe('a:0, b:3');
    });
  });

  describe('decrement and increment behavior (hasControls is true)', () => {
    it('should decrement and increment value', () => {
      render(<FormWatcher isExpanded hasControls values={{ options: { a: 2, b: 4 } }} />);

      fireEvent.click(screen.getByLabelText('decrease optA'));
      fireEvent.click(screen.getByLabelText('increase optB'));

      const options = getFormOutputs();
      expect(options.optA).toBe('1');
      expect(options.optB).toBe('5');
    });

    it('should disable controls when value reaches boundaries', () => {
      const { rerender } = render(
        <FormWatcher isExpanded hasControls values={{ options: { a: 0, b: 5 } }} />,
      );

      const decBtn = screen.getByLabelText('decrease optA') as HTMLButtonElement;
      expect(decBtn.disabled).toBe(true);

      rerender(<FormWatcher isExpanded hasControls values={{ options: { a: 10, b: 5 } }} />);

      const incBtn = screen.getByLabelText('increase optA') as HTMLButtonElement;
      expect(incBtn.disabled).toBe(true);
    });
  });

  describe('decrement and increment behavior (hasControls = false)', () => {
    it('should update displayedValue immediately on option increment or decrement', () => {
      render(<FormWatcher isExpanded values={{ options: { a: 2, b: 2 } }} />);

      fireEvent.click(screen.getByLabelText('decrease optA'));

      expect(screen.getByTestId('display-value').textContent).toBe('a:1, b:2');

      fireEvent.click(screen.getByLabelText('increase optB'));

      expect(screen.getByTestId('display-value').textContent).toBe('a:1, b:3');
    });
  });

  describe('form interaction', () => {
    it('should update form state only on apply (hasControls is true)', () => {
      render(<FormWatcher isExpanded hasControls values={{ options: { a: 2, b: 2 } }} />);

      vi.clearAllMocks();

      fireEvent.click(screen.getByTestId('clear'));
      fireEvent.click(screen.getByLabelText('increase optA'));
      fireEvent.click(screen.getByLabelText('decrease optB'));

      expect(onOptionsChange).not.toHaveBeenCalled();

      fireEvent.click(screen.getByTestId('apply'));

      expect(onOptionsChange).toHaveBeenCalledWith({ a: 1, b: 0 });
    });

    it('should update form state immediately on option increment or decrement (hasControls is false)', () => {
      render(<FormWatcher isExpanded values={{ options: { a: 2, b: 2 } }} />);

      vi.clearAllMocks();

      fireEvent.click(screen.getByLabelText('increase optA'));

      expect(onOptionsChange).toHaveBeenCalledWith({ a: 3, b: 2 });

      fireEvent.click(screen.getByLabelText('increase optB'));

      expect(onOptionsChange).toHaveBeenCalledWith({ a: 3, b: 3 });
    });
  });

  describe('imperative handle and focus management', () => {
    it('should expose focus method through ref', async () => {
      const ref = React.createRef<DropdownRef>();

      render(<FormWatcher ref={ref} />);

      await act(async () => {
        ref.current?.focus();
      });

      const displayBtn = screen.getByTestId('display');
      expect(displayBtn.className.includes('--focused')).toBe(true);
      expect(document.activeElement === displayBtn).toBe(true);
    });

    it('should focus display button and set programmatic focus state when focus method is called', async () => {
      const ref = React.createRef<DropdownRef>();

      render(<FormWatcher ref={ref} />);

      await act(async () => {
        ref.current?.focus();
      });

      const displayBtn = screen.getByTestId('display');
      expect(displayBtn.className.includes('--focused')).toBe(true);
      expect(document.activeElement === displayBtn).toBe(true);
    });

    describe('programmatic focus cleanup', () => {
      let unmount: () => void;
      const removeSpy = vi.spyOn(document, 'removeEventListener');

      beforeEach(async () => {
        const ref = React.createRef<DropdownRef>();

        const { unmount: watcherUnmount } = render(<FormWatcher ref={ref} />);

        unmount = watcherUnmount;

        await act(async () => {
          ref.current?.focus();
        });
      });

      it('should clear programmatic focus state on outside click', () => {
        fireEvent.click(document.body, { bubbles: true });

        const display = screen.getByTestId('display');
        expect(display.className.includes('--focused')).toBe(false);
      });

      it.each(['Escape', 'Tab', 'Enter'])(
        'should clear programmatic focus state on keydown [key is %s]',
        (key) => {
          const display = screen.getByTestId('display');

          fireEvent.keyDown(display, { key });

          expect(display.className.includes('--focused')).toBe(false);
        },
      );

      it('should clean up document event listeners on unmount', () => {
        removeSpy.mockClear();

        unmount();

        expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function), { capture: true });
        expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function), { capture: true });
      });
    });
  });
});
