import React, { ReactElement } from 'react';
import { Icon } from '@chakra-ui/react';

const Night = (props: React.ComponentProps<typeof Icon>): ReactElement => (
  <Icon
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 45 45"
    fill="none"
    {...props}
  >
    <mask
      id="night"
      width="45"
      height="45"
      x="0"
      y="0"
      maskUnits="userSpaceOnUse"
    >
      <path fill="#D9D9D9" d="M0 0h45v45H0z" />
    </mask>
    <g mask="url(#night)">
      <path
        fill="#FFF"
        d="M22.594 37.5c-4.157 0-7.696-1.46-10.617-4.383-2.922-2.922-4.383-6.46-4.383-10.617 0-3.813 1.242-7.11 3.726-9.89 2.485-2.782 5.555-4.422 9.211-4.922h.282c-.563.906-1 1.906-1.313 3a12.224 12.224 0 0 0-.469 3.374c0 3.344 1.172 6.18 3.516 8.508 2.344 2.328 5.172 3.492 8.484 3.492 1.157 0 2.282-.14 3.375-.421a11.62 11.62 0 0 0 3-1.22c-.031.095-.039.15-.023.165l.023.023c-.5 3.657-2.14 6.72-4.922 9.188-2.78 2.469-6.078 3.703-9.89 3.703Z"
      />
    </g>
  </Icon>
);

export default Night;
