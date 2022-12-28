import React, { ReactElement } from 'react';
import { Icon } from '@chakra-ui/react';

const Sepia = (props: React.ComponentProps<typeof Icon>): ReactElement => (
  <Icon
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 45 45"
    {...props}
  >
    <mask
      id="sepia"
      width="45"
      height="45"
      x="0"
      y="0"
      maskUnits="userSpaceOnUse"
    >
      <path fill="#D9D9D9" d="M0 0h45v45H0z" />
    </mask>
    <g mask="url(#sepia)">
      <path
        fill="#1C1B1F"
        d="m22.5 41.063-5.484-5.438H9.375v-7.64L3.844 22.5l5.531-5.484V9.375h7.64L22.5 3.844l5.484 5.531h7.641v7.64l5.531 5.485-5.531 5.484v7.641h-7.64L22.5 41.063Zm-.047-6.891c3.281 0 6.055-1.133 8.32-3.399 2.266-2.265 3.399-5.023 3.399-8.273 0-3.281-1.133-6.055-3.399-8.32-2.265-2.266-5.039-3.399-8.32-3.399-.812 0-1.601.094-2.367.281-.766.188-1.57.454-2.414.797a11.296 11.296 0 0 1 4.992 4.29c1.234 1.921 1.852 4.038 1.852 6.351 0 2.281-.618 4.383-1.852 6.305a11.296 11.296 0 0 1-4.992 4.289c.781.312 1.562.57 2.344.773a9.65 9.65 0 0 0 2.437.305Z"
      />
    </g>
  </Icon>
);

export default Sepia;
