import * as React from 'react';
import * as pimwrap from '@repo/pimwrap';
import * as zerowrap from '@repo/zerowrap';

import { FC, HTMLAttributes } from 'react';
export interface Props extends HTMLAttributes<HTMLDivElement> {
  /** custom content, defaults to 'the snozzberries taste like snozzberries' */
}

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * A custom Thing component. Neat!
 */
export const Thing: FC<Props> = ({ children }) => {
  return <div>{children || `the snozzberries taste like snozzberries`}</div>;
};

export {
  pimwrap,
  zerowrap,
};
