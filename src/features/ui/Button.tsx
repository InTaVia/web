import type React from 'react';
import type { DOMAttributes } from 'react';

const buttonSizes = {
  'extra-small': 'text-xs px-2 py-1 font-extralight',
  small: 'text-sm px-3 py-1.5 font-light',
  regular: 'text-base px-4 py-2 font-normal',
  large: 'text-lg px-5 py-2.5 font-semibold',
  'extra-large': 'text-xl px-8 py-4 font-bold',
};

const buttonColors = {
  primary: `text-slate-900 dark:text-slate-50
    bg-slate-200 dark:bg-slate-700
    hover:bg-slate-50 dark:hover:bg-slate-900
    active:text-slate-50 active:dark:text-slate-900 active:bg-slate-700 active:dark:bg-slate-200
    focus:outline-2 focus:outline-offset-2 outline-current
    disabled:text-gray-600 disabled:dark:text-gray-300 disabled:bg-gray-300 disabled:dark:bg-gray-600
    `,
  warning: `text-gray-900 dark:text-gray-50
    bg-red-200 dark:bg-red-700
    hover:bg-red-50 dark:hover:bg-red-900
    active:text-gray-50 active:dark:text-gray-900 active:bg-red-700 active:dark:bg-red-200
    focus:outline-2 focus:outline-offset-2 outline-current
    disabled:text-gray-600 disabled:dark:text-gray-300 disabled:bg-gray-300 disabled:dark:bg-gray-600
    `,
  accent: `text-gray-900 dark:text-gray-50
    bg-emerald-200 dark:bg-emerald-700
    hover:bg-emerald-50 dark:hover:bg-emerald-900
    active:text-gray-50 active:dark:text-gray-900 active:bg-emerald-700 active:dark:bg-emerald-200
    focus:outline-2 focus:outline-offset-2 outline-current
    disabled:text-gray-600 disabled:dark:text-gray-300 disabled:bg-gray-300 disabled:dark:bg-gray-600
    `,
};

const buttonRoundness = {
  none: '',
  round: 'rounded-md',
  pill: 'rounded-full',
  circle: 'rounded-full aspect-1',
};

const shadows = {
  none: '',
  small:
    'drop-shadow-md disabled:drop-shadow-sm disabled:translate-y-0 transition-transform hover:drop-shadow-sm hover:translate-y-0 -translate-y-1 isolate',
  large:
    'drop-shadow-lg disabled:drop-shadow-sm disabled:translate-y-0 transition-transform hover:drop-shadow-lg hover:translate-y-0 -translate-y-2 isolate',
};

export interface FullButtonProperties {
  // component properties
  children: React.ReactNode;
  className: string;

  // own properties
  size: keyof typeof buttonSizes;
  color: keyof typeof buttonColors;
  round: keyof typeof buttonRoundness;
  disabled: boolean;
  border: boolean;
  shadow: keyof typeof shadows;
}

export type ButtonProperties = Partial<DOMAttributes<HTMLButtonElement>> &
  Partial<FullButtonProperties> &
  Pick<FullButtonProperties, 'children'>;

const defaultButtonProperties: Omit<FullButtonProperties, 'children'> = {
  size: 'regular',
  disabled: false,
  color: 'primary',
  className: '',
  round: 'none',
  border: false,
  shadow: 'none',
};

const extraButtonClasses = 'disabled:cursor-not-allowed box-border';

export function getButtonClasses(passedProps: ButtonProperties): Pick<
  FullButtonProperties,
  'children' | 'disabled'
> & {
  className: string;
  extraProps: Omit<ButtonProperties, 'children'>;
} {
  const allProps = { ...defaultButtonProperties, ...passedProps };
  const { children, size, disabled, color, className, round, border, shadow, ...extraProps } =
    allProps;

  const sizeClasses = buttonSizes[size];
  const colorClasses = buttonColors[color];
  const roundClasses = buttonRoundness[round];
  const borderClasses = border ? 'border-2 border-solid border-current' : 'border-none';
  const shadowClasses = shadows[shadow];

  let classNames = [
    sizeClasses,
    colorClasses,
    roundClasses,
    borderClasses,
    shadowClasses,
    extraButtonClasses,
    className,
  ].join(' ');

  if (round === 'circle') {
    // equalize block and inline padding for circle buttons
    classNames = classNames.replaceAll(/\bpx-[0-9.]+\b/g, '').replaceAll(/\bpy-/g, 'p-');
  }

  return {
    className: classNames,
    disabled,
    children,
    extraProps,
  };
}

export default function Button(passedProps: ButtonProperties): JSX.Element {
  const { className, children, disabled, extraProps } = getButtonClasses(passedProps);

  return (
    <button className={className} disabled={disabled} {...extraProps}>
      {children}
    </button>
  );
}
