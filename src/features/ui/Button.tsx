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
};

export interface FullButtonProperties {
  // component properties
  children: Array<JSX.Element> | JSX.Element | string;
  className: string;

  // own properties
  size: keyof typeof buttonSizes;
  color: keyof typeof buttonColors;
  round: keyof typeof buttonRoundness;
  disabled: boolean;
}

export type ButtonProperties = Partial<FullButtonProperties> &
  Pick<FullButtonProperties, 'children'>;

const defaultButtonProperties: Omit<FullButtonProperties, 'children'> = {
  size: 'regular',
  disabled: false,
  color: 'primary',
  className: '',
  round: 'none',
};

const extraButtonClasses = 'disabled:cursor-not-allowed';

export default function Button(extraProps: ButtonProperties): JSX.Element {
  const props = { ...defaultButtonProperties, ...extraProps };

  const sizeClasses = buttonSizes[props.size];
  const colorClasses = buttonColors[props.color];
  const roundClasses = buttonRoundness[props.round];

  const className = [
    sizeClasses,
    colorClasses,
    roundClasses,
    extraButtonClasses,
    props.className,
  ].join(' ');

  return (
    <button className={className} disabled={props.disabled}>
      foo
    </button>
  );
}
