import { useEffect, useRef, useState } from 'react';
import { useController } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';

import type { IRange, RangeState } from './range';

export interface UseFormRangeAdapterProps<T extends FieldValues, RModel extends IRange> {
  range: RModel;
  nameFrom: Path<T>;
  nameTo: Path<T>;
  control: Control<T>;
}

export const useFormRangeAdapter = <T extends FieldValues, RModel extends IRange>({
  range,
  nameFrom,
  nameTo,
  control,
}: UseFormRangeAdapterProps<T, RModel>) => {
  const [sliderState, setSliderState] = useState<RangeState>(() => range.getState());
  const { field: fieldFrom } = useController({ name: nameFrom, control });
  const { field: fieldTo } = useController({ name: nameTo, control });

  const onChangeRef = useRef({
    from: fieldFrom.onChange,
    to: fieldTo.onChange,
  });

  useEffect(() => {
    onChangeRef.current = {
      from: fieldFrom.onChange,
      to: fieldTo.onChange,
    };
  }, [fieldFrom, fieldTo]);

  useEffect(() => {
    const update = (payload: Partial<RangeState>) => {
      setSliderState((state) => ({ ...state, ...payload }));

      if (payload.from !== undefined) {
        onChangeRef.current.from(payload.from);
      }

      if (payload.to !== undefined) {
        onChangeRef.current.to(payload.to);
      }
    };

    range.subscribe(update);

    return () => range.unsubscribe(update);
  }, [range]);

  useEffect(() => {
    const externalFrom = fieldFrom.value;
    const externalTo = fieldTo.value;

    if (externalFrom !== undefined && externalFrom !== range.getState().from) {
      range.setFrom(externalFrom);
      setSliderState(() => range.getState());
    }

    if (externalTo !== undefined && externalTo !== range.getState().to) {
      range.setTo(externalTo);
      setSliderState(() => range.getState());
    }
  }, [fieldFrom, fieldTo, range]);

  return sliderState;
};
