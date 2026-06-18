import clsx from 'clsx';
import type { TFunction } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { fetchRooms } from '../../actions/searchActions';
import EmptyState from '../../components/EmptyState/EmptyState';
import Heading from '../../components/Heading/Heading';
import MiniErrorPlaceholder from '../../components/MiniErrorPlaceholder/MiniErrorPlaceholder';
import Pagination from '../../components/Pagination/Pagination';
import RoomCard from '../../components/RoomCard/RoomCard';
import RoomCardSkeleton from '../../components/RoomCard/RoomCardSkeleton';
import SearchSidebar from '../../components/SearchSidebar/SearchSidebar';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useSearchFilters } from '../../hooks/useSearchFilters';
import { ROUTES } from '../../routes';
import { getSearchSchema } from '../../schemas/search.schema';
import { clearSearch } from '../../slices/search';
import { getBookingParams } from '../../utils/utils';

import './Search.scss';

const getCaption = ({
  page,
  totalRooms,
  roomsPerPage,
  t,
}: {
  page: number;
  totalRooms: number;
  roomsPerPage: number;
  t: TFunction<'pages', 'search'>;
}) => {
  const from = (page - 1) * roomsPerPage + 1;
  const to = Math.min(from + roomsPerPage, totalRooms) - 1;

  const total = totalRooms > 100 ? '100+' : `${totalRooms}`;
  const form = totalRooms === 1 ? 'paginationCaption_one' : 'paginationCaption';

  return t(form, { from, to, total });
};

const Search = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'search' });
  const { t: tErr } = useTranslation('components', { keyPrefix: 'errors' });

  const { filters, applyFilters } = useSearchFilters();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const schema = useMemo(() => getSearchSchema(tErr), [tErr]);

  const [isUrlValid, setIsUrlValid] = useState(true);
  const [isPriceDebouncing, setIsPriceDebouncing] = useState(false);
  const {
    rooms,
    isLoading: isSeverLoading,
    error: roomsError,
  } = useAppSelector((state) => state.search);
  const { totalPages, totalRooms, roomsPerPage } = useAppSelector(
    (state) => state.search.pagination,
  );

  const skeletonCount = roomsPerPage || 12;
  const ROOM_SKELETONS = useMemo(
    () => Array.from({ length: skeletonCount }, (_, i) => i),
    [skeletonCount],
  );
  const currentPage = filters.page || 1;
  const caption = getCaption({ page: currentPage, totalRooms, roomsPerPage, t });

  const hasServerError = roomsError && (!roomsError.status || roomsError.status >= 500);
  const isAnyLoadingActive = isPriceDebouncing || isSeverLoading;
  const shouldShowSkeletons =
    isAnyLoadingActive && rooms.length === 0 && !hasServerError && isUrlValid;
  const isRoomsNotFound =
    !isAnyLoadingActive && rooms.length === 0 && !hasServerError && isUrlValid;
  const shouldShowRoomsGrid = rooms.length !== 0 && !hasServerError && isUrlValid;
  const shouldShowPagination = rooms.length !== 0 && !hasServerError && isUrlValid;

  useEffect(() => {
    const isValid = schema.isValidSync(filters);
    setIsUrlValid(isValid);

    if (!isValid) {
      setIsPriceDebouncing(false);
      return;
    }

    const promise = dispatch(fetchRooms(filters));

    promise
      .unwrap()
      .then(() => {
        setIsPriceDebouncing(false);
      })
      .catch((reason) => {
        if (reason?.name === 'AbortError') return;

        setIsPriceDebouncing(false);
      });

    return () => promise.abort();
  }, [dispatch, filters, tErr, schema]);

  useEffect(() => {
    if (!isUrlValid) {
      dispatch(clearSearch());
    }
  }, [isUrlValid]);

  const handlePriceDebouncing = useCallback((isDebouncing: boolean) => {
    if (isDebouncing) {
      setIsPriceDebouncing(true);
    }
  }, []);

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      applyFilters({ page: pageNumber });
    },
    [applyFilters],
  );

  const handleRefetch = useCallback(() => {
    dispatch(fetchRooms(filters))
      .unwrap()
      .catch((reason) => {
        if (reason?.name === 'AbortError') return;
      });
  }, [dispatch, filters]);

  const handleRoomClick = useCallback(
    (id: string) => {
      const bookingParams = getBookingParams(filters);
      navigate(`${ROUTES.BOOKING(id)}?${bookingParams}`);
    },
    [filters, navigate],
  );

  return (
    <main className="search">
      <SearchSidebar onDebounceChange={handlePriceDebouncing} />
      <div className="search__content">
        <Heading type="h1" style={{ marginTop: 0 }}>
          {t('heading')}
        </Heading>
        <div className="search__rooms">
          {shouldShowSkeletons && (
            <div className="search__rooms-grid">
              {ROOM_SKELETONS.map((i) => (
                <RoomCardSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
          )}

          {!isUrlValid && (
            <div className="search__rooms-full-width">
              <EmptyState title={t('invalidUrlTitle')} description={t('invalidUrlDescription')} />
            </div>
          )}

          {isRoomsNotFound && (
            <div className="search__rooms-full-width">
              <EmptyState title={t('notFoundTitle')} description={t('notFoundDescription')} />
            </div>
          )}

          {hasServerError && (
            <div className="search__rooms-full-width">
              <MiniErrorPlaceholder
                message={t('serverErrorDescription', {
                  status: roomsError.status ?? 500,
                  message: roomsError.data.message ?? tErr('unknownError'),
                })}
                onRetry={() => {
                  dispatch(clearSearch());
                  handleRefetch();
                }}
              />
            </div>
          )}

          {shouldShowRoomsGrid && (
            <div
              className={clsx('search__rooms-grid', {
                'search__rooms-grid--loading': isAnyLoadingActive,
              })}
            >
              {rooms.map((room) => (
                <RoomCard {...room} key={room.id} onClick={handleRoomClick} />
              ))}
            </div>
          )}

          {shouldShowPagination && (
            <div className="search__rooms-pagination">
              <Pagination
                page={filters.page}
                caption={caption}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Search;
