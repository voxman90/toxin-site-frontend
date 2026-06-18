import clsx from 'clsx';

import Button from '../Button';
import CardFrame from '../CardFrame/CardFrame';
import Heading from '../Heading/Heading';
import Icon from '../Icon/Icon';

import './ErrorView.scss';

interface ErrorViewProps {
  title: string;
  message: string;
  onRetry: () => void;
  btnText: string;
  className?: string;
}

const ErrorView = ({ title, message, onRetry, btnText, className }: ErrorViewProps) => {
  return (
    <main className="error-view">
      <CardFrame as="section" className={clsx('error-view__card', className)}>
        <Icon name="error_outline" className="error-view__icon" size="lg" />
        <Heading type="h2" style={{ marginBottom: 0 }}>
          {title}
        </Heading>
        <p className="error-view__message">{message}</p>
        <Button size="long" variant="filled" type="button" onClick={onRetry}>
          {btnText}
        </Button>
      </CardFrame>
    </main>
  );
};

export default ErrorView;
