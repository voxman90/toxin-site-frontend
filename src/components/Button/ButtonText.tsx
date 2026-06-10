import Button from '.';

const ButtonText = (props: Omit<React.ComponentProps<typeof Button>, 'variant' | 'size'>) => {
  return <Button {...props} variant="text" size="content" />;
};

export default ButtonText;
