import { DocumentSearchIcon, HomeIcon } from '@heroicons/react/solid';
import { Fragment } from 'react';

import { withDictionaries } from '@/app/i18n/with-dictionaries';
import type { FullButtonProperties } from '@/features/ui/Button';
import Button from '@/features/ui/Button';
import ButtonLink from '@/features/ui/ButtonLink';

export const getStaticProps = withDictionaries(['common']);

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

  const otherProperties: Array<Partial<FullButtonProperties> & { title: string }> = [
    { title: 'No border or shadow', border: false, shadow: 'none' },
    { title: 'Border', border: true, shadow: 'none' },
    { title: 'No border, small shadow', border: false, shadow: 'small' },
    { title: 'Border, small shadow', border: true, shadow: 'small' },
    { title: 'No border, large shadow', border: false, shadow: 'large' },
    { title: 'Border, large shadow', border: true, shadow: 'large' },
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
      <h1 className="text-xxl m-4 font-bold text-gray-900">UI Component Test Page</h1>

      <section>
        <h2 className="m-2 mx-4 text-xl font-semibold text-gray-700">Button</h2>

        {otherProperties.map(({ title, ...other }, i) => {
          return (
            <Fragment key={i}>
              <h3 className="m-1 mx-4 text-lg font-semibold text-gray-600">{title}</h3>
              <div className="grid grid-cols-10 place-items-center gap-4">
                <span className="grid-col-1 col-span-2 text-center font-semibold">Extra small</span>
                <span className="grid-col-3 col-span-2 text-center font-semibold">Small</span>
                <span className="grid-col-5 col-span-2 text-center font-semibold">Regular</span>
                <span className="grid-col-7 col-span-2 text-center font-semibold">Large</span>
                <span className="grid-col-9 col-span-2 text-center font-semibold">Extra large</span>

                {buttonData.map(([key, d]) => {
                  return (
                    <Button key={key} {...d} {...other}>
                      Button
                    </Button>
                  );
                })}
              </div>
            </Fragment>
          );
        })}

        <h3 className="m-1 mx-4 text-lg font-semibold text-gray-600">Icon-only Buttons</h3>

        <p>
          These use <code>round={'{circle}'}</code> instead of <code>round={'{pill}'}</code>.
        </p>

        {(['none', 'small', 'large'] as Array<FullButtonProperties['shadow']>).map((d) => {
          return (
            <div key={d} className="my-10 flex place-items-center justify-center gap-4">
              <Button shadow={d} size="extra-small" round="circle">
                <DocumentSearchIcon className="h-3 w-3" />
              </Button>
              <Button shadow={d} size="small" round="circle" color="accent" border>
                <DocumentSearchIcon className="h-5 w-5" />
              </Button>
              <Button shadow={d} size="regular" round="circle" color="warning" disabled>
                <DocumentSearchIcon className="h-7 w-7" />
              </Button>
              <Button shadow={d} size="large" round="circle" color="warning">
                <DocumentSearchIcon className="h-10 w-10" />
              </Button>
              <Button shadow={d} size="extra-large" round="circle" color="accent" border>
                <DocumentSearchIcon className="h-10 w-10" />
              </Button>
            </div>
          );
        })}
      </section>

      <section>
        <h2 className="m-2 mx-4 text-xl font-semibold text-gray-700">ButtonLink</h2>
        <p>Links that look like buttons.</p>

        <div className="my-10 flex place-items-center justify-center gap-5">
          <ButtonLink href="#">Click me</ButtonLink>
          <ButtonLink href="#" size="extra-large" round="round" color="accent">
            Click me
          </ButtonLink>
          <ButtonLink href="#" size="large" round="circle" color="warning" shadow="large">
            <HomeIcon className="h-10 w-10" />
          </ButtonLink>
        </div>
      </section>
    </Fragment>
  );
}
