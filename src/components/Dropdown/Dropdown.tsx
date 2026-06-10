import { FocusScope, useFocusManager } from '@react-aria/focus';
import { getInteractionModality, useFocusWithin } from '@react-aria/interactions';
import clsx from 'clsx';
import { useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useExpandable } from '../../hooks/useExpandable';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import Button from '../Button';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Icon from '../Icon/Icon';
import Label from '../Label/Label';

import './Dropdown.scss';

export type DropdownSize = 'md' | 'lg';

export type DropdownValues = Record<string, number>;

export interface DropdownRef {
  focus: () => void;
}

export interface DropdownOption {
  name: string;
  label: string;
  defaultValue: number;
  range: [number, number];
}

export interface DropdownOptionRowProps {
  option: DropdownOption;
  value: number;
  onChange: (value: number) => void;
}

export interface DropdownControlsProps {
  onClear: () => void;
  onApply: () => void;
  isDirty: boolean;
  applyBtnRef: React.RefObject<HTMLButtonElement | null>;
}

export interface DropdownProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: DropdownOption[];
  getDisplayedValue: (state: DropdownValues) => string;
  labelText?: string;
  labelAppendix?: string;
  isExpanded?: boolean;
  isExpandingDisabled?: boolean;
  hasControls?: boolean;
  size?: DropdownSize;
  ref?: React.RefObject<DropdownRef | null>;
}

const I18N = {
  NS: 'components',
  PREFIX: 'dropdown',
} as const;

const DropdownOptionRow = ({ option, value, onChange }: DropdownOptionRowProps) => {
  const {
    range: [min, max],
    label,
  } = option;
  const { t } = useTranslation(I18N.NS, { keyPrefix: I18N.PREFIX });
  const handleKeyDown = useKeyboardNavigation();
  const focusManager = useFocusManager();

  const handleAdjust = (direction: 'inc' | 'dec') => {
    const isIncrement = direction === 'inc';
    const newValue = isIncrement ? value + 1 : value - 1;
    onChange(newValue);

    if ((isIncrement && newValue >= max) || (direction === 'dec' && newValue <= min)) {
      focusManager?.focusNext();
    }
  };

  return (
    <div className="dropdown__option" role="group" aria-label={label} onKeyDown={handleKeyDown}>
      <div className="dropdown__option-label" aria-hidden="true">
        {label}
      </div>
      <div className="dropdown__option-controls">
        <button
          type="button"
          className="dropdown__option-btn"
          aria-label={t('decrease', { option: label })}
          disabled={value <= min}
          onClick={() => handleAdjust('dec')}
        >
          -
        </button>
        <div
          className="dropdown__option-output"
          aria-live="polite"
          aria-atomic="true"
          data-testid={t('output', { option: label })}
        >
          {value}
        </div>
        <button
          type="button"
          className="dropdown__option-btn"
          aria-label={t('increase', { option: label })}
          disabled={value >= max}
          onClick={() => handleAdjust('inc')}
        >
          +
        </button>
      </div>
    </div>
  );
};

const DropdownControls = ({ onClear, onApply, isDirty, applyBtnRef }: DropdownControlsProps) => {
  const { t } = useTranslation(I18N.NS, { keyPrefix: I18N.PREFIX });
  const handleKeyDown = useKeyboardNavigation();

  return (
    <div className="dropdown__controls">
      <Button
        variant="text"
        size="content"
        ref={applyBtnRef}
        onClick={onApply}
        onKeyDown={handleKeyDown}
        data-testid={t('apply')}
      >
        {t('apply')}
      </Button>
      <Button
        variant="text"
        size="content"
        onClick={onClear}
        onKeyDown={handleKeyDown}
        data-testid={t('clear')}
        disabled={!isDirty}
      >
        {t('clear')}
      </Button>
    </div>
  );
};

const Dropdown = <T extends FieldValues>({
  name,
  control,
  options,
  getDisplayedValue,
  labelText = '',
  labelAppendix = '',
  isExpandingDisabled = false,
  isExpanded: isInitiallyExpanded = false,
  hasControls = false,
  size = 'lg',
  ref,
  ...props
}: DropdownProps<T>) => {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name, control });
  const {
    ref: expandableRef,
    isExpanded,
    setIsExpanded,
  } = useExpandable<HTMLDivElement>(isInitiallyExpanded, isExpandingDisabled);
  const labelId = useId();
  const applyBtnRef = useRef<HTMLButtonElement>(null);
  const displayRef = useRef<HTMLButtonElement>(null);
  const isModalBehavior = hasControls && !isExpandingDisabled;

  const [isProgrammaticFocus, setIsProgrammaticFocus] = useState(false);
  const { focusWithinProps } = useFocusWithin({
    onBlurWithin: () => {
      if (!isExpandingDisabled && isExpanded && getInteractionModality() !== 'pointer') {
        setIsExpanded(false);
      }
    },
  });

  const defaultValues = useMemo(() => {
    return Object.fromEntries(options.map((o) => [o.name, o.defaultValue]));
  }, [options]);

  const [draft, setDraft] = useState<DropdownValues>(field.value ?? defaultValues);

  const focusApi = useMemo(
    () => ({
      focus: () => {
        setIsProgrammaticFocus(true);
        displayRef.current?.focus();
      },
    }),
    [],
  );

  useImperativeHandle(ref, () => focusApi, [focusApi]);

  useEffect(() => {
    field.ref(focusApi);
  }, [field.ref, focusApi]);

  useEffect(() => {
    setDraft(field.value ?? defaultValues);
  }, [field.value, defaultValues]);

  useEffect(() => {
    if (!isProgrammaticFocus) return;

    const clearProgrammaticFocus = () => setIsProgrammaticFocus(false);

    document.addEventListener('keydown', clearProgrammaticFocus, { once: true, capture: true });
    document.addEventListener('click', clearProgrammaticFocus, { once: true, capture: true });

    return () => {
      document.removeEventListener('keydown', clearProgrammaticFocus, { capture: true });
      document.removeEventListener('click', clearProgrammaticFocus, { capture: true });
    };
  }, [isProgrammaticFocus]);

  useEffect(() => {
    if (!isExpanded || isExpandingDisabled) return;

    const returnFocusOnEscape = (e: KeyboardEvent) => {
      if (isExpanded && e.key === 'Escape') {
        requestAnimationFrame(() => {
          setIsProgrammaticFocus(true);
          displayRef.current?.focus();
        });
      }
    };

    document.addEventListener('keydown', returnFocusOnEscape, true);

    return () => {
      document.removeEventListener('keydown', returnFocusOnEscape, true);
    };
  }, [isExpanded, isExpandingDisabled]);

  const isDirty = useMemo(() => {
    const currentValues = (hasControls ? draft : field.value) || defaultValues;
    return Object.keys(defaultValues).some((key) => currentValues[key] !== defaultValues[key]);
  }, [field.value, draft, defaultValues, hasControls]);

  const handleOptionChange = (name: string, newValue: number) => {
    const updated = { ...draft, [name]: newValue };
    setDraft(updated);

    if (!hasControls) {
      field.onChange(updated);
    }
  };

  const handleApply = () => {
    field.onChange(draft);

    if (!isExpandingDisabled) {
      setIsExpanded(false);

      if (getInteractionModality() !== 'pointer') {
        requestAnimationFrame(() => {
          setIsProgrammaticFocus(true);
          displayRef.current?.focus();
        });
      }
    }
  };

  const handleClear = () => {
    setDraft(defaultValues);

    applyBtnRef.current?.focus();
  };

  return (
    <div {...props} className={clsx('dropdown', `dropdown--width-${size}`)} ref={expandableRef}>
      <Label as="h3" text={labelText} appendix={labelAppendix} id={labelId} />
      <button
        type="button"
        className={clsx('dropdown__display', {
          'dropdown__display--expanded': isExpanded,
          'dropdown__display--invalid': invalid,
          'dropdown__display--focused': isProgrammaticFocus,
        })}
        onClick={() => setIsExpanded(!isExpanded)}
        onBlur={() => setIsProgrammaticFocus(false)}
        ref={displayRef}
        aria-expanded={isExpanded}
        aria-haspopup="dialog"
        aria-labelledby={labelId}
        disabled={isExpandingDisabled}
        data-testid="display"
      >
        <span className="dropdown__value" data-testid="display-value">
          {getDisplayedValue(field.value ?? defaultValues)}
        </span>
        <span className="dropdown__icon" aria-hidden="true">
          <Icon name="expand_more" />
        </span>
      </button>
      <ErrorMessage message={error?.message} />

      {isExpanded && (
        <div
          className="dropdown__bar"
          role={isModalBehavior ? 'dialog' : 'region'}
          aria-modal={isModalBehavior}
          aria-labelledby={labelId}
          {...focusWithinProps}
        >
          <FocusScope contain={isModalBehavior} autoFocus>
            <div className="dropdown__options">
              {options.map((option) => (
                <DropdownOptionRow
                  key={option.name}
                  option={option}
                  value={draft[option.name] ?? option.defaultValue}
                  onChange={(val) => handleOptionChange(option.name, val)}
                />
              ))}
            </div>
            {hasControls && (
              <DropdownControls
                onClear={handleClear}
                onApply={handleApply}
                isDirty={isDirty}
                applyBtnRef={applyBtnRef}
              />
            )}
          </FocusScope>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
