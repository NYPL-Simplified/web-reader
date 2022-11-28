import React, { ReactElement } from 'react';
import { Icon } from '@chakra-ui/react';

const TableOfContents = (
  props: React.ComponentProps<typeof Icon>
): ReactElement => (
  <Icon
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 50 50"
    {...props}
  >
    <mask
      id="tableOfContents"
      width="50"
      height="50"
      x="0"
      y="0"
      maskUnits="userSpaceOnUse"
    >
      <path fill="#D9D9D9" d="M0 0h49.264v49.264H0z" />
    </mask>
    <g mask="url(#a)">
      <path
        fill={props.fill as string}
        d="M7.544 33.376v-2.118h27.454v2.118H7.544Zm0-8.47v-2.118h27.454v2.117H7.544Zm0-8.47v-2.118h27.454v2.117H7.544Zm32.842 17.257c-.376 0-.692-.132-.948-.398a1.347 1.347 0 0 1-.386-.978c0-.388.129-.715.386-.98.256-.264.572-.396.948-.396s.693.132.95.396c.256.265.384.592.384.98s-.128.714-.383.978a1.272 1.272 0 0 1-.95.398Zm0-8.47c-.376 0-.692-.133-.948-.398a1.347 1.347 0 0 1-.386-.978c0-.389.129-.715.386-.98.256-.265.572-.397.948-.397s.693.132.95.396c.256.266.384.592.384.98 0 .389-.128.715-.383.979a1.272 1.272 0 0 1-.95.398Zm0-8.47c-.376 0-.692-.133-.948-.398a1.347 1.347 0 0 1-.386-.979c0-.388.129-.715.386-.98.256-.264.572-.396.948-.396s.693.132.95.396c.256.265.384.592.384.98 0 .389-.128.715-.383.979a1.272 1.272 0 0 1-.95.398Z"
      />
    </g>
  </Icon>
);

export default TableOfContents;
