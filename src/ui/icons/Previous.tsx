import React, { ReactElement } from 'react';
import { Icon } from '@chakra-ui/react';

const Previous = (props: React.ComponentProps<typeof Icon>): ReactElement => (
  <Icon
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 48 48"
    {...props}
  >
    <mask
      id="previous"
      width="48"
      height="48"
      x="0"
      y="0"
      maskUnits="userSpaceOnUse"
    >
      <path fill="#D9D9D9" d="M0 0h48v48H0z" />
    </mask>
    <g mask="url(#previous)">
      <path
        fill={props.fill as string}
        d="M20 42.6 1.4 24 20 5.4l1.8 1.8L4.95 24 21.8 40.8 20 42.6Z"
      />
    </g>
  </Icon>
);

export default Previous;
