import React from 'react';

export type ButtonProps = React.ComponentPropsWithRef<'button'>;

const Button: React.FC<ButtonProps> = (props) => <button {...props} />;

export default Button;
