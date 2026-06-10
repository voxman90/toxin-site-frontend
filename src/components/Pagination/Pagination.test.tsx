// @vitest-environment happy-dom
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Pagination from './Pagination';
import { getPageNumbers } from './Pagination.utils';

const mockOnChange = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options: { number: number }) => {
      return options ? `${key} ${options.number}` : key;
    },
  }),
}));

beforeEach(() => {
  mockOnChange.mockClear();
});

describe('getPageNumbers()', () => {
  it('should return [] when totalPages is 0', () => {
    expect(getPageNumbers(0, 0)).toEqual([]);
  });

  it('should return [1] when totalPages is 1', () => {
    expect(getPageNumbers(1, 1)).toEqual([1]);
  });

  it('should return [1..7] when totalPages is 7', () => {
    const cases = [1, 2, 3, 4, 5, 6, 7];

    cases.forEach((activePage) => {
      expect(getPageNumbers(activePage, 7), `Failed on activePage: ${activePage}`).toEqual([
        1, 2, 3, 4, 5, 6, 7,
      ]);
    });
  });

  it('should return [1, 2, 3, 4, 5, null, 21]', () => {
    const cases = [1, 2, 3, 4];

    cases.forEach((activePage) => {
      expect(getPageNumbers(activePage, 21), `Failed on activePage: ${activePage}`).toEqual([
        1,
        2,
        3,
        4,
        5,
        null,
        21,
      ]);
    });
  });

  it('should return [1, null, 4, 5, 6, null, 21] when activePage is 5', () => {
    expect(getPageNumbers(5, 21)).toEqual([1, null, 4, 5, 6, null, 21]);
  });

  it('should return [1, null, 9, 10, 11, null, 21] when activePage is 10', () => {
    expect(getPageNumbers(10, 21)).toEqual([1, null, 9, 10, 11, null, 21]);
  });

  it('should return [1, null, 16, 17, 18, null, 21] when activePage is 17', () => {
    expect(getPageNumbers(17, 21)).toEqual([1, null, 16, 17, 18, null, 21]);
  });

  it('should return [1, null, 17, 18, 19, 20, 21]', () => {
    const cases = [18, 19, 20, 21];

    cases.forEach((activePage) => {
      expect(getPageNumbers(activePage, 21), `Failed on activePage: ${activePage}`).toEqual([
        1,
        null,
        17,
        18,
        19,
        20,
        21,
      ]);
    });
  });
});

describe('Pagination', () => {
  describe('rendering & layout', () => {
    it('should render correct number of page buttons based on getPageNumbers logic', () => {
      const { rerender } = render(<Pagination page={10} totalPages={15} onChange={() => {}} />);

      [1, 9, 10, 11, 15].forEach((i) => screen.getByLabelText(`toPage ${i}`));
      expect(screen.getAllByTestId('ellipsis').length).toBe(2);
      screen.getByLabelText('next');
      screen.getByLabelText('prev');

      rerender(<Pagination page={1} totalPages={4} onChange={() => {}} />);

      [1, 2, 3, 4].forEach((i) => screen.getByLabelText(`toPage ${i}`));
    });
  });

  describe('disabled states', () => {
    it('should disable the prev button when activePage is 1', () => {
      render(<Pagination page={1} totalPages={10} onChange={() => {}} />);

      expect((screen.getByLabelText('prev') as HTMLButtonElement).disabled).toBe(true);
    });

    it('should disable the next button when activePage is equal to totalPages', () => {
      render(<Pagination page={10} totalPages={10} onChange={() => {}} />);

      expect((screen.getByLabelText('next') as HTMLButtonElement).disabled).toBe(true);
    });

    it('should keep both prev and next buttons active when activePage is in the middle', () => {
      render(<Pagination page={5} totalPages={10} onChange={() => {}} />);

      expect((screen.getByLabelText('prev') as HTMLButtonElement).disabled).toBe(false);
      expect((screen.getByLabelText('next') as HTMLButtonElement).disabled).toBe(false);
    });
  });

  describe('mouse interactions', () => {
    it('should call onChange with exact page number when page button is clicked', () => {
      render(<Pagination page={5} totalPages={10} onChange={mockOnChange} />);

      const pageSixBtn = screen.getByLabelText('toPage 6');
      fireEvent.click(pageSixBtn);

      expect(mockOnChange).toHaveBeenCalledWith(6);
    });

    it('should call onChange with decreased page number when prev button is clicked', () => {
      render(<Pagination page={5} totalPages={10} onChange={mockOnChange} />);

      const prevBtn = screen.getByLabelText('prev');
      fireEvent.click(prevBtn);

      expect(mockOnChange).toHaveBeenCalledWith(4);
    });

    it('should call onChange with increased page number when next button is clicked', () => {
      render(<Pagination page={5} totalPages={10} onChange={mockOnChange} />);

      const nextBtn = screen.getByLabelText('next');
      fireEvent.click(nextBtn);

      expect(mockOnChange).toHaveBeenCalledWith(6);
    });

    it('should not call onChange when ellipsis element is clicked', () => {
      render(<Pagination page={5} totalPages={10} onChange={mockOnChange} />);

      const ellipsis = screen.getAllByTestId('ellipsis')[0];
      fireEvent.click(ellipsis);

      expect(mockOnChange).not.toHaveBeenCalledOnce();
    });
  });
});
