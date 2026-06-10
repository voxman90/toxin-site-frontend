import Subject from './subject';

export type Ends = 'from' | 'to';

export interface RangeState {
  min: number;
  max: number;
  from: number;
  to: number;
  step: number;
  isFromFixed: boolean;
  isToFixed: boolean;
  isRangeFixed: boolean;
}

export type RangePayload = Partial<RangeState>;

export interface IRange extends Subject<RangePayload> {
  setFrom(x: number): void;
  setTo(x: number): void;
  setRange(from: number): void;
  setMin(x: number): void;
  setMax(x: number): void;
  setState(x: Partial<RangeState>): void;
  getLength(): number;
  getState(): RangeState;
  getClosestEnd(x: number): Ends;
  getPercent(x: number): number;
  getValue(percent: number): number;
}

const DEFAULT_STATE: RangeState = {
  min: 0,
  max: 1,
  from: 0,
  to: 0,
  step: 1,
  isFromFixed: false,
  isToFixed: false,
  isRangeFixed: false,
};

class Range extends Subject<RangePayload> implements IRange {
  protected state: RangeState;

  constructor() {
    super();
    this.state = DEFAULT_STATE;
  }

  static isStateValid(state: RangeState): void | never {
    if (
      state.min <= state.max &&
      state.min <= state.from &&
      state.from <= state.to &&
      state.to <= state.max &&
      state.step > 0
    ) {
      return;
    } else {
      throw new Error('State is not valid');
    }
  }

  private clamp(min: number, x: number, max: number): number {
    const clamped = Math.max(min, Math.min(x, max));
    const steps = Math.round((clamped - this.state.min) / this.state.step);
    const result = this.state.min + steps * this.state.step;

    return Math.min(result, max);
  }

  setFrom(x: number): void {
    if (this.state.isFromFixed) return;

    if (this.state.isRangeFixed) {
      return this.setRange(x);
    }

    const newFrom = this.clamp(this.state.min, x, this.state.to);

    if (this.state.from !== newFrom) {
      this.setState({ from: newFrom });
    }
  }

  setTo(x: number): void {
    if (this.state.isToFixed) return;

    if (this.state.isRangeFixed) {
      return this.setRange(x - this.getRange());
    }

    const newTo = this.clamp(this.state.from, x, this.state.max);

    if (this.state.to !== newTo) {
      return this.setState({ to: newTo });
    }
  }

  setRange(from: number): void {
    if (this.state.isToFixed || this.state.isFromFixed) return;

    const range = this.getRange();
    const newFrom = this.clamp(
      this.state.min,
      from,
      Math.max(this.state.min, this.state.max - range),
    );

    if (this.state.from === newFrom) return;

    this.setState({ from: newFrom, to: newFrom + range });
  }

  setMin(min: number): void {
    this.setState({ min });
  }

  setMax(max: number): void {
    this.setState({ max });
  }

  setState(state: Partial<RangeState>): void {
    const newState = { ...this.state, ...state };
    Range.isStateValid(newState);
    this.state = newState;
    this.notify({ ...newState });
  }

  getPercent(x: number): number {
    if (x <= this.state.min) {
      return 0;
    }

    if (x >= this.state.max) {
      return 100;
    }

    return ((x - this.state.min) * 100) / this.getLength();
  }

  getRange(): number {
    return this.state.to - this.state.from;
  }

  getRangePercent(): number {
    return (this.getRange() * 100) / this.getLength();
  }

  getLength(): number {
    return this.state.max - this.state.min;
  }

  getState(): RangeState {
    return { ...this.state };
  }

  getClosestEnd(x: number): Ends {
    if (x < this.state.from) {
      return 'from';
    }

    if (x > this.state.to) {
      return 'to';
    }

    if (x - this.state.from < this.state.to - x) {
      return 'from';
    } else {
      return 'to';
    }
  }

  getValue(percent: number): number {
    if (percent > 100) {
      return this.state.max;
    }

    if (percent < 0) {
      return this.state.min;
    }

    return this.state.min + (percent * this.getLength()) / 100;
  }
}

export default Range;
