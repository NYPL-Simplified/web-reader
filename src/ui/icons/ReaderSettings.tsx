import React, { ReactElement } from 'react';
import { Icon } from '@chakra-ui/react';

const ReaderSettings = (
  props: React.ComponentProps<typeof Icon>
): ReactElement => (
  <Icon
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 49 49"
    {...props}
  >
    <mask
      id="readerSettings"
      width="49"
      height="49"
      x="0"
      y="0"
      maskUnits="userSpaceOnUse"
    >
      <path fill="#D9D9D9" d="M0 0h49v49H0z" />
    </mask>
    <g mask="url(#a)">
      <path
        fill={props.fill as string}
        d="M30.37 37.014V9.633H20.16V7h22.97v2.633H32.92v27.38H30.37Zm-18.375 0v-16.85H5.87V17.53h14.802v2.633h-6.125v16.85h-2.552Z"
      />
    </g>
  </Icon>
);

export default ReaderSettings;
