import Button from '../Button/';
import Heading from '../Heading/Heading';

import './EmptyState.scss';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
}

export const EmptyState = ({ title, description, actionText, onActionClick }: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <Heading type="h2" style={{ marginBottom: 'var(--gap-sm)' }}>
        {title}
      </Heading>
      <p className="empty-state__description">{description}</p>

      {onActionClick && (
        <Button type="button" variant="outlined" size="long" onClick={onActionClick}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
