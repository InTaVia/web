import { Fragment } from 'react';

import type { FullButtonProperties } from '@/features/ui/Button';
import Button from '@/features/ui/Button';

export default function UiTestPage(): JSX.Element {
  const columnProperties: Array<Partial<FullButtonProperties>> = [
    { size: 'extra-small' },
    { size: 'extra-small', disabled: true },
    { size: 'small' },
    { size: 'small', disabled: true },
    { size: 'regular' },
    { size: 'regular', disabled: true },
    { size: 'large' },
    { size: 'large', disabled: true },
    { size: 'extra-large' },
    { size: 'extra-large', disabled: true },
  ];

  const rowProperties: Array<Partial<FullButtonProperties>> = [
    { color: 'primary' },
    { color: 'primary', round: 'round' },
    { color: 'primary', round: 'pill' },
    { color: 'warning', round: 'round' },
    { color: 'accent', round: 'round' },
  ];

  const buttonData: Array<[string, Partial<FullButtonProperties>]> = [];
  rowProperties.forEach((row, i) => {
    columnProperties.forEach((col, j) => {
      buttonData.push([
        `${i}:${j}`,
        {
          ...row,
          ...col,
        },
      ]);
    });
  });

  return (
    <Fragment>
      <h1 className="m-4 text-xl font-bold text-gray-900">UI Component Test Page</h1>

      <section>
        <h2 className="m-2 text-lg font-semibold text-gray-700">Button</h2>

        <div className="grid grid-cols-10 place-items-center gap-4">
          <span className="grid-col-1 col-span-2 text-center font-semibold">Extra small</span>
          <span className="grid-col-3 col-span-2 text-center font-semibold">Small</span>
          <span className="grid-col-5 col-span-2 text-center font-semibold">Regular</span>
          <span className="grid-col-7 col-span-2 text-center font-semibold">Large</span>
          <span className="grid-col-9 col-span-2 text-center font-semibold">Extra large</span>

          {buttonData.map(([key, d]) => {
            return (
              <Button key={key} {...d}>
                Foo bar
              </Button>
            );
          })}
        </div>
      </section>
    </Fragment>
  );
}
