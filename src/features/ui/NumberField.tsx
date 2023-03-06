interface NumberFieldProperties {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

export function NumberField(props: NumberFieldProperties): JSX.Element {
  const { value, onChange, min, max } = props;

  const ownClasses = `
  bg-white text-intavia-neutral-900
  rounded-md
  border
  outline-none focus:outline-none
  px-2 py-1
  border-intavia-neutral-500
  disabled:bg-intavia-neutral-100 disabled:text-intavia-neutral-500 disabled:border-intavia-neutral-700
  focus:border-intavia-brand-700 focus:text-intavia-brand-900 focus:bg-intavia-brand-50
  focus:invalid:text-intavia-red-900 focus:invalid:bg-intavia-red-50
  placeholder:text-intavia-neutral-600
  invalid:border-intavia-red-700
  invalid:empty:border-intavia-red-700
`;

  return (
    <input
      type="number"
      max={max}
      min={min}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        onChange(parseInt(newValue));
      }}
      value={value}
      className={ownClasses}
    ></input>
  );
}
