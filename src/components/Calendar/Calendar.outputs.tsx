import { clsx } from 'clsx';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Icon from '../Icon/Icon';
import Label from '../Label/Label';

import { I18N } from './Calendar.constants';
import type { CalendarOutputRangeProps, CalendarOutputSeparateProps } from './Calendar.types';
import { convertDateToDDMMYYYY, convertDatesToDDMDDM } from './Calendar.utils';
import { useFocus } from './FocusContext';

const CalendarOutputRange = memo(
  ({
    output,
    focusedTarget,
    label = '',
    isExpanded = false,
    isInvalidFrom = false,
    isInvalidTo = false,
    errorFrom,
    errorTo,
    handleOutputClick,
  }: CalendarOutputRangeProps) => {
    const { t } = useTranslation(I18N.NS, { keyPrefix: I18N.PREFIX });
    const focusController = useFocus();
    const isPropgrammaticFocus = focusedTarget === 'output-from' || focusedTarget === 'output-to';

    return (
      <Label text={label}>
        <button
          ref={(node) => focusController.registerStatic('output-from', node)}
          type="button"
          className={clsx('calendar__output', {
            'calendar__output--filled': output.from || output.to,
            'calendar__output--invalid': isInvalidFrom || isInvalidTo,
            'is-programmatic-focus': isPropgrammaticFocus,
          })}
          onClick={handleOutputClick}
          aria-invalid={isInvalidFrom || isInvalidTo}
          aria-expanded={isExpanded}
          aria-haspopup="dialog"
        >
          {convertDatesToDDMDDM(output, t('ddmPlaceholder'), t)}
          <span className="calendar__icon-expand" aria-hidden="true">
            <Icon name="expand_more" />
          </span>
        </button>
        <ErrorMessage message={errorFrom || errorTo} />
      </Label>
    );
  },
);

const CalendarOutputSeparate = memo(
  ({
    output,
    focusedTarget,
    labelFrom = '',
    labelTo = '',
    isExpanded = false,
    isInvalidFrom = false,
    isInvalidTo = false,
    errorFrom,
    errorTo,
    handleOutputClick,
  }: CalendarOutputSeparateProps) => {
    const { from, to } = output;
    const { t } = useTranslation(I18N.NS, { keyPrefix: I18N.PREFIX });
    const focusController = useFocus();
    const isPropgrammaticFocusFrom = focusedTarget === 'output-from';
    const isPropgrammaticFocusTo = focusedTarget === 'output-to';

    return (
      <div className="calendar__output-separate">
        <Label text={labelFrom}>
          <button
            ref={(node) => focusController.registerStatic('output-from', node)}
            type="button"
            className={clsx('calendar__output', 'calendar__output--from', {
              'calendar__output--filled': from,
              'calendar__output--invalid': isInvalidFrom,
              'is-programmatic-focus': isPropgrammaticFocusFrom,
            })}
            onClick={handleOutputClick}
            aria-invalid={isInvalidFrom}
            aria-expanded={isExpanded}
            aria-haspopup="dialog"
          >
            {convertDateToDDMMYYYY(from, t('ddmmyyyyPlacecholder'))}
            <span className="calendar__icon-expand" aria-hidden="true">
              <Icon name="expand_more" />
            </span>
          </button>
          <ErrorMessage message={errorFrom} />
        </Label>
        <Label text={labelTo}>
          <button
            ref={(node) => focusController.registerStatic('output-to', node)}
            type="button"
            className={clsx('calendar__output', 'calendar__output--to', {
              'calendar__output--filled': to,
              'calendar__output--invalid': isInvalidTo,
              'is-programmatic-focus': isPropgrammaticFocusTo,
            })}
            onClick={handleOutputClick}
            aria-invalid={isInvalidTo}
            aria-expanded={isExpanded}
            aria-haspopup="dialog"
          >
            {convertDateToDDMMYYYY(to, t('ddmmyyyyPlacecholder'))}
            <span className="calendar__icon-expand" aria-hidden="true">
              <Icon name="expand_more" />
            </span>
          </button>
          <ErrorMessage message={errorTo} />
        </Label>
      </div>
    );
  },
);

export { CalendarOutputRange, CalendarOutputSeparate };
