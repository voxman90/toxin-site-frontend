import clsx from 'clsx';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import './Pagination.scss';
import { getPageNumbers } from './Pagination.utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  caption?: string;
}

const Pagination = ({
  page: activePage,
  totalPages: lastPage,
  onChange,
  caption = '',
}: PaginationProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'pagination' });
  const pageNumbers = useMemo(() => getPageNumbers(activePage, lastPage), [activePage, lastPage]);

  const firstPageBtnRef = useRef<HTMLButtonElement>(null);
  const lastPageBtnRef = useRef<HTMLButtonElement>(null);

  const handleClick =
    (end: 'next' | 'prev', page: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
      const isKeyboardClick = e.clientX === 0 && e.clientY === 0;

      onChange(page);

      if (isKeyboardClick) {
        if (activePage === 2 && end === 'prev') {
          requestAnimationFrame(() => {
            firstPageBtnRef.current?.focus();
          });
        }

        if (activePage === lastPage - 1 && end === 'next') {
          requestAnimationFrame(() => {
            lastPageBtnRef.current?.focus();
          });
        }
      }
    };

  if (lastPage <= 1) return null;

  return (
    <nav className="pagination" aria-label={t('label')}>
      <button
        type="button"
        className={clsx('pagination__btn', 'pagination__btn--prev', {
          'pagination__btn--hidden': activePage <= 1,
        })}
        onClick={handleClick('prev', activePage - 1)}
        disabled={activePage <= 1}
        aria-label={t('prev')}
      >
        arrow_forward
      </button>
      <ul className="pagination__items">
        {pageNumbers.map((page, i) => {
          const isEllipsis = page === null;
          const isCurrent = page === activePage;

          return (
            <li key={isEllipsis ? `ellipsis-${i}` : page}>
              {isEllipsis ? (
                <span className="pagination__ellipsis" aria-hidden="true" data-testid="ellipsis">
                  &hellip;
                </span>
              ) : (
                <button
                  type="button"
                  className={clsx('pagination__item', {
                    'pagination__item--current': isCurrent,
                  })}
                  ref={
                    page === 1 ? firstPageBtnRef : page === lastPage ? lastPageBtnRef : undefined
                  }
                  onClick={() => onChange(page)}
                  aria-current={isCurrent ? 'page' : undefined}
                  aria-label={t('toPage', { number: page })}
                >
                  {page}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className={clsx('pagination__btn', 'pagination__btn--next', {
          'pagination__btn--hidden': activePage >= lastPage,
        })}
        onClick={handleClick('next', activePage + 1)}
        disabled={activePage >= lastPage}
        aria-label={t('next')}
      >
        arrow_forward
      </button>
      {caption && <div className="pagination__caption">{caption}</div>}
    </nav>
  );
};

export default Pagination;
