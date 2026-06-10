import { useController } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import InputWithMask from '../Input/InputWithMask';
import type { InputWithMaskProps } from '../Input/InputWithMask';
import InputGroup from '../InputGroup/InputGroup';
import type { InputGroupProps } from '../InputGroup/InputGroup';

type MaskedFieldDateProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
} & Pick<InputWithMaskProps, 'isInvalid'> &
  Omit<InputGroupProps, 'children' | 'error'>;

const SEMICORRECT_DATE_REGEX =
  '^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[13-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$';

const MaskedFieldDate = <T extends FieldValues>({
  name,
  control,
  labelText,
  labelAppendix,
  showErrors,
  ...props
}: MaskedFieldDateProps<T>) => {
  const { t } = useTranslation('components', { keyPrefix: 'maskedFieldDate' });
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <InputGroup
      error={error}
      showErrors={showErrors}
      labelText={labelText}
      labelAppendix={labelAppendix}
    >
      <InputWithMask
        {...props}
        ref={ref}
        placeholder={t('placeholder')}
        defaultValue={value}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
          onChange(e.target.value);
          onBlur();
        }}
        mask="datetime"
        maskOptions={{
          inputFormat: 'dd.mm.yyyy',
          regex: SEMICORRECT_DATE_REGEX,
          placeholder: t('placeholder'),
          oncleared: () => onChange(null),
          oncomplete: function (this: HTMLInputElement) {
            onChange(this.value);
          },
          prefillYear: false,
          clearIncomplete: true,
          clearMaskOnLostFocus: true,
        }}
        isInvalid={!!error}
      />
    </InputGroup>
  );
};

export default MaskedFieldDate;
