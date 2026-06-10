import Range from './range';
import type { IRange, RangeState } from './range';

export type RangeMappedToArrayState<T> = RangeState & {
  displayedValues: T[];
};

export interface IRangeMappedToArray<T> extends IRange {
  setDisplayedValues: (displayedValues: T[]) => void | never;
  getDisplayedValue: (i: number) => T;
  getDisplayedValues: () => T[];
  getCurrentDisplayedValues: () => { from: T; to: T };
  setStep: (newStep: number) => void | never;
}

const isNonNegativeInteger = (x: number) => Number.isInteger(x) && x >= 0;

class RangeMappedToArray<T> extends Range implements IRangeMappedToArray<T> {
  protected displayedValues: T[];

  constructor(initialValues: T[]) {
    super();

    if (!initialValues || initialValues.length === 0) {
      throw new Error('Requires at least one displayed value');
    }

    this.displayedValues = [...initialValues];

    const lastIndex = Math.max(0, initialValues.length - 1);
    this.state = {
      ...this.state,
      min: 0,
      max: lastIndex,
      from: 0,
      to: lastIndex,
      step: 1,
    };
  }

  setState(state: Partial<RangeState>) {
    const newState = { ...this.state, ...state };

    const { max, min, to, from, step } = newState;
    if (![min, max, to, from, step].every(isNonNegativeInteger)) {
      throw new Error('Values not integer or negative');
    }

    if (max >= this.displayedValues.length) {
      throw new Error('Max index out of bounds for displayedValues');
    }

    super.setState(newState);
  }

  setMin(min: number) {
    if (isNonNegativeInteger(min)) {
      super.setMin(min);
    } else {
      throw new Error('Invalid min value');
    }
  }

  setMax(max: number) {
    if (isNonNegativeInteger(max) && max < this.displayedValues.length) {
      super.setMax(max);
    } else {
      throw new Error('Invalid max value');
    }
  }

  setDisplayedValues(newValues: Array<T>) {
    if (!newValues || newValues.length === 0) {
      throw new Error('Array can not be empty');
    }

    this.displayedValues = [...newValues];

    const state = this.getState();
    const newMin = 0;
    const newMax = newValues.length - 1;
    const newTo = newMin <= state.to && state.to <= newMax ? state.to : newMax;
    const newFrom = newMin <= state.from && state.from <= newTo ? state.from : newMin;

    this.setState({
      min: newMin,
      max: newMax,
      to: newTo,
      from: newFrom,
    });
  }

  setStep(step: number): void {
    if (isNonNegativeInteger(step)) {
      super.setState({ step });
    } else {
      throw new Error('Invalid step value');
    }
  }

  setTo(to: number): void {
    super.setTo(Math.round(to));
  }

  setFrom(from: number): void {
    super.setFrom(Math.round(from));
  }

  getDisplayedValues(): T[] {
    return [...this.displayedValues];
  }

  getDisplayedValue(i: number) {
    return this.displayedValues[i];
  }

  getCurrentDisplayedValues() {
    const { from, to } = this.getState();

    return {
      from: this.displayedValues[from],
      to: this.displayedValues[to],
    };
  }
}

export default RangeMappedToArray;
