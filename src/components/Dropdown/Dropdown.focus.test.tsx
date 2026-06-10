// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DropdownOption, DropdownProps } from './Dropdown';
import Dropdown from './Dropdown';

interface TestDropdownOpts {
  options: {
    a: number;
    b: number;
  };
}

type FormWatcherProps = {
  values?: TestDropdownOpts;
} & Partial<DropdownProps<TestDropdownOpts>>;

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { option: string }) => {
      return !options ? key : `${key} ${options.option}`;
    },
  }),
}));

describe('Dropdown accessibility', () => {
  const ControlledDropdown = ({ values, ...rest }: FormWatcherProps) => {
    const { t } = useTranslation();
    const { control } = useForm<TestDropdownOpts>({ values });

    const options: DropdownOption[] = useMemo(
      () => [
        { name: 'a', label: t('optA'), defaultValue: 0, range: [0, 5] },
        { name: 'b', label: t('optB'), defaultValue: 0, range: [0, 5] },
      ],
      [t],
    );

    return (
      <Dropdown
        control={control}
        options={options}
        getDisplayedValue={() => ''}
        name="options"
        {...rest}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should trap focus inside the dropdown container when hasControls is true', async () => {
    const user = userEvent.setup();

    render(<ControlledDropdown isExpanded hasControls values={{ options: { a: 1, b: 1 } }} />);

    const clearBtn = screen.getByTestId('clear');
    const firstOptionBtn = screen.getByLabelText('decrease optA');

    clearBtn.focus();

    await user.tab();

    expect(document.activeElement).toBe(firstOptionBtn);
  });

  it('should move focus to apply button after clear button is pressed', async () => {
    const user = userEvent.setup();

    render(<ControlledDropdown isExpanded hasControls values={{ options: { a: 1, b: 1 } }} />);

    const clearBtn = screen.getByTestId('clear');
    const applyBtn = screen.getByTestId('apply');

    clearBtn.focus();

    await user.keyboard('{ }');

    expect(document.activeElement).toBe(applyBtn);
  });

  it('should restore focus on display when apply is pressed', async () => {
    const user = userEvent.setup();

    render(<ControlledDropdown isExpanded hasControls values={{ options: { a: 1, b: 1 } }} />);

    const applyBtn = screen.getByTestId('apply');
    const display = screen.getByTestId('display');

    applyBtn.focus();

    await user.keyboard('{enter}');

    await waitFor(() => {
      expect(document.activeElement).toBe(display);
      expect(display.className.includes('--focused')).toBe(true);
      expect(screen.queryByLabelText('decrease optA')).toBeNull();
    });
  });

  it('should close dropdown when tabbed out (hasControls is false)', async () => {
    const user = userEvent.setup();

    render(<ControlledDropdown isExpanded values={{ options: { a: 1, b: 1 } }} />);

    const display = screen.getByTestId('display');
    const lastOptionBtn = screen.getByLabelText('increase optB');

    lastOptionBtn.focus();

    await user.tab();

    expect(document.activeElement).not.toBe(display);
    expect(display.className.includes('--focused')).toBe(false);
    expect(screen.queryByLabelText('decrease optA')).toBeNull();
  });

  it('should close dropdown and restore focus on display when Shift+Tab is pressed on first option (hasControls is false)', async () => {
    const user = userEvent.setup();

    render(<ControlledDropdown isExpanded values={{ options: { a: 1, b: 1 } }} />);

    const display = screen.getByTestId('display');
    const firstOptionBtn = screen.getByLabelText('decrease optA');

    firstOptionBtn.focus();

    await user.tab({ shift: true });

    expect(document.activeElement).toBe(display);
    expect(display.className.includes('--focused')).toBe(false);
    expect(screen.queryByLabelText('decrease optA')).toBeNull();
  });
});
