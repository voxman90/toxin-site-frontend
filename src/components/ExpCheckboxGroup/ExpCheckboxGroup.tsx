import clsx from 'clsx';
import { useState } from 'react';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';
import type { CheckboxGroupOption } from '../CheckboxGroup/CheckboxGroup';
import Heading from '../Heading/Heading';
import Icon from '../Icon/Icon';

import './ExpCheckboxGroup.scss';

interface ExpandableCheckboxGroupProps<T extends FieldValues> {
  name: Path<T>;
  legend: string;
  options: CheckboxGroupOption<T>[];
  register: UseFormRegister<T>;
  isExpanded?: boolean;
}

const ExpandableCheckboxGroup = <T extends FieldValues>({
  name,
  legend,
  options,
  register,
  isExpanded: isExpandedInitially = false,
}: ExpandableCheckboxGroupProps<T>) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedInitially);

  const handleExpandBtnClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <fieldset className="exp-checkbox-group">
      <legend className="exp-checkbox-group__legend">
        <div className="exp-checkbox-group__heading">
          <Heading type="label">{legend}</Heading>
        </div>
        <button
          type="button"
          className={clsx('exp-checkbox-group__expand-btn', {
            'exp-checkbox-group__expand-btn--active': isExpanded,
          })}
          role="button"
          onClick={handleExpandBtnClick}
        >
          <Icon name="expand_more" />
        </button>
      </legend>
      <div
        className={clsx('exp-checkbox-group__content', {
          'exp-checkbox-group__content--expanded': isExpanded,
        })}
      >
        <CheckboxGroup name={name} options={options} register={register} />
      </div>
    </fieldset>
  );
};

export default ExpandableCheckboxGroup;
