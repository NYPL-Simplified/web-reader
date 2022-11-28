import React, { ReactElement } from 'react';
import { Icon } from '@chakra-ui/react';

const Reset = (props: React.ComponentProps<typeof Icon>): ReactElement => (
  <Icon
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 45 45"
    {...props}
  >
    <mask id="a" width="45" height="45" x="0" y="0" maskUnits="userSpaceOnUse">
      <path fill="#D9D9D9" d="M0 0h45v45H0z" />
    </mask>
    <g mask="url(#reset)">
      <path
        fill={props.fill as string}
        d="M20.11 37.266c-3.126-.563-5.696-2.047-7.712-4.453-2.015-2.407-3.023-5.22-3.023-8.438 0-1.781.367-3.484 1.102-5.11a13.358 13.358 0 0 1 3.117-4.312c.094-.094.226-.133.398-.117.172.016.32.086.445.21a.537.537 0 0 1 .258.517.787.787 0 0 1-.304.562 10.21 10.21 0 0 0-2.672 3.75 11.674 11.674 0 0 0-.89 4.5c0 2.813.882 5.281 2.648 7.406 1.765 2.125 4.023 3.469 6.773 4.032.188 0 .336.078.445.234a.88.88 0 0 1 .164.516c0 .218-.078.39-.234.515a.807.807 0 0 1-.516.188Zm4.828.047a.628.628 0 0 1-.516-.141.624.624 0 0 1-.235-.516.88.88 0 0 1 .165-.515.655.655 0 0 1 .445-.282c2.719-.656 4.96-2.03 6.726-4.125 1.766-2.093 2.649-4.547 2.649-7.359 0-3.25-1.125-6.008-3.375-8.273-2.25-2.266-5.016-3.399-8.297-3.399h-1.547l2.86 2.86a.6.6 0 0 1 .234.492.741.741 0 0 1-.235.539.741.741 0 0 1-.539.234.74.74 0 0 1-.539-.234l-3.656-3.703a1.33 1.33 0 0 1-.281-.399 1.203 1.203 0 0 1-.094-.492c0-.188.031-.36.094-.516.062-.156.156-.296.281-.421l3.656-3.704a.838.838 0 0 1 .54-.187c.203 0 .382.062.538.187a.906.906 0 0 1 .235.586.6.6 0 0 1-.235.493l-2.859 2.812H22.5c3.656 0 6.758 1.281 9.305 3.844 2.547 2.562 3.82 5.656 3.82 9.281 0 3.188-1.008 5.984-3.023 8.39-2.016 2.407-4.57 3.922-7.664 4.547Z"
      />
    </g>
  </Icon>
);

export default Reset;
