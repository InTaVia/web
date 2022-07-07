import type { DOMAttributes } from 'react';

export interface TextFieldProps {
  disabled?: boolean;
  className?: string;
}

export default function TextField(
  props: Partial<DOMAttributes<HTMLInputElement>> &
    React.InputHTMLAttributes<HTMLInputElement> &
    TextFieldProps,
): JSX.Element {
  const { disabled = false, className = '', ...otherProps } = props;
  const ownClasses = `
    bg-white text-intavia-gray-900
    rounded-md
    border
    outline-none focus:outline-none
    px-2 py-1
    border-intavia-gray-500
    disabled:bg-intavia-gray-100 disabled:text-intavia-gray-500 disabled:border-intavia-gray-700
    focus:border-intavia-brand-700 focus:text-intavia-brand-900 focus:bg-intavia-brand-50
    focus:invalid:text-intavia-red-900 focus:invalid:bg-intavia-red-50
    placeholder:text-intavia-gray-600
    invalid:border-intavia-red-700
    invalid:empty:border-intavia-red-700
  `;

  return (
    <input
      type="text"
      className={`${ownClasses} ${className}`}
      disabled={disabled}
      {...otherProps}
    />
  );
}
