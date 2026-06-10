// @vitest-environment happy-dom
import type { Mock, Procedure } from '@vitest/spy';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ISubject } from './subject';
import Subject from './subject';

describe('Subject model', () => {
  let subject: ISubject<any>;
  let firstSub: Mock<Procedure>;
  let secondSub: Mock<Procedure>;
  let thirdSub: Mock<Procedure>;

  beforeEach(() => {
    vi.clearAllMocks();

    subject = new Subject();

    firstSub = vi.fn();
    secondSub = vi.fn();
    thirdSub = vi.fn();
  });

  describe('basic functionality', () => {
    it('should subscribe to notifications', () => {
      subject.subscribe(firstSub);
      subject.subscribe(secondSub);
      subject.subscribe(thirdSub);

      const payload = ['', 12, null];
      subject.notify([...payload]);

      expect(firstSub).toHaveBeenCalledWith(payload);
      expect(secondSub).toHaveBeenCalledWith(payload);
      expect(thirdSub).toHaveBeenCalledWith(payload);
    });

    it('should return an unsubscribe function', () => {
      const unsubscribeFirstSub = subject.subscribe(firstSub);
      subject.subscribe(secondSub);

      unsubscribeFirstSub();

      subject.notify(100);

      expect(firstSub).not.toHaveBeenCalled();
      expect(secondSub).toHaveBeenCalledWith(100);
    });

    it('should be able unsubscribe', () => {
      subject.subscribe(firstSub);
      subject.subscribe(secondSub);

      subject.unsubscribe(firstSub);

      subject.notify(100);

      expect(firstSub).not.toHaveBeenCalled();
      expect(secondSub).toHaveBeenCalledWith(100);
    });
  });
});
