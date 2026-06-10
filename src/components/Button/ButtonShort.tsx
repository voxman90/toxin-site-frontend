import Button from '.';

const ButtonShort = (props: Omit<React.ComponentProps<typeof Button>, 'size'>) => (
  <Button {...props} size="short" />
);

export default ButtonShort;
