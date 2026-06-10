import Button from '.';

const ButtonLong = (props: Omit<React.ComponentProps<typeof Button>, 'size'>) => (
  <Button {...props} size="long" />
);

export default ButtonLong;
