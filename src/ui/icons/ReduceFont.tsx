import React, { ReactElement } from 'react';
import { Icon } from '@chakra-ui/react';

const ReduceFont = (props: React.ComponentProps<typeof Icon>): ReactElement => (
  <Icon
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 46 46"
    {...props}
  >
    <mask
      id="reduceFont"
      width="46"
      height="46"
      x="0"
      y="0"
      maskUnits="userSpaceOnUse"
    >
      <path fill="#D9D9D9" d="M0 0h45.639v45.639H0z" />
    </mask>
    <g mask="url(#a)">
      <path
        fill={props.fill as string}
        d="M3.09 35.18 13.121 10.46h1.854L25.006 35.18h-2.282l-2.757-6.893H7.987L5.229 35.18H3.09Zm5.562-8.747h10.65L14.12 13.502h-.238l-5.23 12.93Zm20.586-2.663V21.87h13.311v1.901H29.238Z"
      />
    </g>
  </Icon>
);

export default ReduceFont;
