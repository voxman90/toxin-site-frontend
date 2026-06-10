import clsx from 'clsx';

import './ErrorMessage.scss';

type ErrorMessageProps = {
  message?: string;
} & React.ComponentPropsWithoutRef<'div'>;

const ErrorMessage = ({ message, className, ...props }: ErrorMessageProps) => {
  return (
    <div {...props} className={clsx('error-message', className)}>
      {message && (
        <div className="error-message__text" role="alert" aria-live="polite">
          {message}
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
