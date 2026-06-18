import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { initRoomDetails } from '../../actions/roomDetails.actions';
import { useAppDispatch } from '../../hooks';
import { ROUTES } from '../../routes';
import { resetBooking } from '../../slices/booking';
import { resetRoomDetails } from '../../slices/roomDetails';
import { isKnownError } from '../../utils/utils';
import ErrorView from '../ErrorView/ErrorView';

interface FallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

export const BookingErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'errorBoudary' });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { roomId } = useParams<{ roomId: string }>();

  const handleReturn = () => {
    navigate(ROUTES.LANDING);

    dispatch(resetBooking());
    dispatch(resetRoomDetails());
  };

  const handleRetry = () => {
    dispatch(resetBooking());
    dispatch(resetRoomDetails());

    if (roomId) {
      dispatch(initRoomDetails(roomId));
    }

    resetErrorBoundary();
  };

  const isKnown = isKnownError(error);

  if (!roomId || (isKnown && error.status === 404)) {
    return (
      <ErrorView
        title={t('idError.title')}
        message={t('idError.description')}
        onRetry={handleReturn}
        btnText={t('idError.btnText')}
      />
    );
  }

  if (isKnown && error.status === 400) {
    return (
      <ErrorView
        title={t('badRequest.title')}
        message={t('badRequest.description')}
        onRetry={handleReturn}
        btnText={t('badRequest.btnText')}
      />
    );
  }

  return (
    <ErrorView
      title={t('serverError.title')}
      message={t('serverError.description')}
      onRetry={handleRetry}
      btnText={t('serverError.btnText')}
    />
  );
};
