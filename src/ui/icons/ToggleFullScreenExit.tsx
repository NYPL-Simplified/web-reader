import React, { ReactElement } from 'react';
import { Icon } from '@chakra-ui/react';

const ToggleFullScreenExit = (
  props: React.ComponentProps<typeof Icon>
): ReactElement => (
  <Icon
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 51 51"
    {...props}
  >
    <mask id="a" width="51" height="51" x="0" y="0" maskUnits="userSpaceOnUse">
      <path fill="#D9D9D9" d="M0 0h51v51H0z" />
    </mask>
    <g mask="url(#a)">
      <path
        fill={props.fill as string}
        d="M19.125 38.69v-8.768h-8.5V27.73H21.25v10.96h-2.125Zm10.625 0V27.73h10.625v2.192h-8.5v8.769H29.75ZM10.625 18.96V16.77h8.5V8h2.125v10.96H10.625Zm19.125 0V8h2.125v8.769h8.5v2.192H29.75Z"
      />
    </g>
  </Icon>
);

export default ToggleFullScreenExit;
