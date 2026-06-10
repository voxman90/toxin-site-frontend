import { useState } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';

import RangeSliderPresenter from './RangeSliderPresenter';
import type { Ends, RangeState } from './range';
import Range from './range';

export type Orientation = 'horizontal' | 'vertical';

interface RangeSliderProps<T extends FieldValues> {
  nameFrom: Path<T>;
  nameTo: Path<T>;
  control: Control<T>;
  config?: Partial<RangeState>;
  orientation?: Orientation;
  onMouseDown?: (end: Ends | 'range') => void;
  onKeyDown?: (e: React.KeyboardEvent, end: Ends | 'range') => void;
  onKeyUp?: (e: React.KeyboardEvent, end: Ends | 'range') => void;
  disabled?: boolean;
  isRangeDraggable?: boolean;
}

const RangeSlider = <T extends FieldValues>({
  nameFrom,
  nameTo,
  control,
  config,
  onMouseDown,
  onKeyDown,
  onKeyUp,
  ...props
}: RangeSliderProps<T>) => {
  const [range] = useState(() => {
    const model = new Range();

    if (config) {
      model.setState(config);
    }

    return model;
  });
  const [prevConfig, setPrevConfig] = useState(config);

  if (config !== prevConfig) {
    setPrevConfig(config);
    if (config) {
      range.setState(config);
    }
  }

  return (
    <RangeSliderPresenter
      {...props}
      range={range}
      nameFrom={nameFrom}
      nameTo={nameTo}
      control={control}
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    />
  );
};

export default RangeSlider;
