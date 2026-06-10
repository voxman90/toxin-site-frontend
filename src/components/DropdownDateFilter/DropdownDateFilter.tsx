import type { FieldValues } from 'react-hook-form';

import Calendar from '../Calendar/Calendar';
import type { CalendarProps } from '../Calendar/Calendar.types';

import './DropdownDateFilter.scss';

type DropdownDateFilterProps<T extends FieldValues> = Omit<
  CalendarProps<T>,
  'outputFormat' | 'label'
> & { label: string };

const DropdownDateFilter = <T extends FieldValues>(props: DropdownDateFilterProps<T>) => {
  return (
    <div className="dropdown-date-filter">
      <Calendar {...props} outputFormat="range" />
    </div>
  );
};

export default DropdownDateFilter;
