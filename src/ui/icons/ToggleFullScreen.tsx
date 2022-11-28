import React, { ReactElement } from 'react';
import { Icon } from '@chakra-ui/react';

const ToggleFullScreen = (
  props: React.ComponentProps<typeof Icon>
): ReactElement => (
  <Icon
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 49 49"
    {...props}
  >
    <mask id="a" width="49" height="49" x="0" y="0" maskUnits="userSpaceOnUse">
      <path fill="#D9D9D9" d="M0 0h49v49H0z" />
    </mask>
    <g mask="url(#a)">
      <path
        fill={props.fill as string}
        d="M10.208 41.487V30.956h2.042v8.425h8.167v2.106H10.208Zm0-18.956V12h10.209v2.106H12.25v8.425h-2.042Zm18.375 18.956v-2.106h8.167v-8.425h2.042v10.531H28.583Zm8.167-18.956v-8.425h-8.167V12h10.209v10.531H36.75Z"
      />
    </g>
  </Icon>
);

export default ToggleFullScreen;
