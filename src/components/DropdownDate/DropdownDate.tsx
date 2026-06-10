import type { FieldValues } from 'react-hook-form';

import Calendar from '../Calendar/Calendar';
import type { CalendarProps } from '../Calendar/Calendar.types';

import './DropdownDate.scss';

type DropdownDateProps<T extends FieldValues> = Omit<CalendarProps<T>, 'outputFormat' | 'label'> & {
  labelFrom: string;
  labelTo: string;
};

const DropdownDate = <T extends FieldValues>(props: DropdownDateProps<T>) => {
  return (
    <div className="date-dropdown">
      <Calendar {...props} outputFormat="separate" />
    </div>
  );
};

export default DropdownDate;
