import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DocumentSearchIcon,
  HomeIcon,
  RefreshIcon,
} from '@heroicons/react/solid';
import { resolveCaa } from 'dns';
import { Fragment } from 'react';

import { withDictionaries } from '@/app/i18n/with-dictionaries';
import type { FullButtonProperties } from '@/features/ui/Button';
import Button from '@/features/ui/Button';
import ButtonLink from '@/features/ui/ButtonLink';
import Popover from '@/features/ui/Popover';
import TextField from '@/features/ui/TextField';
import { promise, toast } from '@/features/ui/toast';

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

      <section>
        <h2 className="m-2 mx-4 text-xl font-semibold text-gray-700">TextField</h2>

        <div className="my-10 grid grid-cols-[auto_auto] justify-center gap-5">
          <label htmlFor="textfield1">Regular</label>
          <TextField id="textfield1" />
          <label htmlFor="textfield2" className="text-lg">
            Larger
          </label>
          <TextField id="textfield2" className="text-lg" />
          <label htmlFor="textfield3">Disabled</label>
          <TextField id="textfield3" disabled />
          <label htmlFor="textfield4">With placeholder</label>
          <TextField id="textfield4" placeholder="Enter some text, please" />
          <label htmlFor="textfield5">With placeholder, disabled</label>
          <TextField id="textfield5" placeholder="Enter some text, please" disabled />
          <label htmlFor="textfield6">Required</label>
          <TextField id="textfield6" placeholder="Enter some text, please" required />
          <label htmlFor="textfield7">Validate: three numbers</label>
          <TextField id="textfield7" pattern="^[0-9]{3}$" />
        </div>
      </section>

      <section>
        <h2 className="m-2 mx-4 text-xl font-semibold text-gray-700">Popover</h2>

        <div className="my-10 mb-24 flex justify-center gap-5">
          <Popover buttonClassName="flex gap-1 items-center">
            {({ open, placement }) => {
              return (
                <>
                  Open popover
                  {open ? (
                    placement === 'bottom' ? (
                      <ChevronDownIcon className="h-5 w-5" />
                    ) : (
                      <ChevronUpIcon className="h-5 w-5" />
                    )
                  ) : (
                    <ChevronRightIcon className="h-5 w-5" />
                  )}
                </>
              );
            }}
            <Fragment>
              <span>Hello World!</span>
            </Fragment>
          </Popover>

          <Popover color="accent" size="large" round="pill" shadow="small">
            <Fragment>Click to open</Fragment>
            {({ close }) => {
              return (
                <Fragment>
                  <div className="w-80">
                    <h3 className="text-lg font-semibold text-intavia-gray-800">
                      This is a larger popover content
                    </h3>

                    <p className="justify font-thin">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium ipsum
                      fugit similique qui atque velit vel rem nihil quos sequi sit deserunt nobis
                      dolores, nam quibusdam modi soluta eligendi libero totam officiis animi magnam
                      nostrum inventore? Corrupti dolorum quae in quaerat dolores laudantium
                      voluptate iure placeat veritatis laborum, aspernatur totam alias culpa tempora
                      iste magnam ad a! Doloribus eveniet dolores, recusandae quibusdam consectetur
                      iusto quod reiciendis odit nihil animi minus sequi necessitatibus modi facilis
                      error nobis natus quo fuga adipisci neque pariatur dolorem explicabo! Quas
                      voluptas tempora asperiores adipisci hic aspernatur cupiditate in sint? Nihil
                      sed voluptatem velit quibusdam vero cum distinctio corrupti, amet voluptas
                      accusantium architecto? Itaque, odio, rem eaque maiores omnis sapiente tempore
                      eius minima veritatis porro id.
                    </p>

                    <div className="mt-2 flex">
                      <Button
                        size="small"
                        color="warning"
                        round="round"
                        onClick={() => {
                          return close();
                        }}
                        className="ml-auto self-end"
                      >
                        Close popover
                      </Button>
                    </div>
                  </div>
                </Fragment>
              );
            }}
          </Popover>
        </div>
      </section>

      <section>
        <h2 className="m-2 mx-4 text-xl font-semibold text-gray-700">Toasts</h2>

        <div className="my-10 flex justify-center gap-5">
          <Button
            size="small"
            round="round"
            onClick={() => {
              const p = new Promise<void>((resolve) => {
                setTimeout(() => {
                  return resolve();
                }, 2000);
              });
              promise(p, {
                loading: 'Waiting...',
                success: <b className="font-bold">Success in Promise</b>,
                error: <b className="font-bold">Error in Promise</b>,
              });
            }}
          >
            Successful promise (2s)
          </Button>
          <Button
            size="small"
            round="round"
            onClick={() => {
              const p = new Promise<void>((_, reject) => {
                setTimeout(() => {
                  return reject();
                }, 1000);
              });
              promise(p, {
                loading: 'Waiting...',
                success: <b className="font-bold">Success in Promise</b>,
                error: <b className="font-bold">Error in Promise</b>,
              });
            }}
          >
            Unsuccessful promise (1s)
          </Button>

          <Button
            size="small"
            round="round"
            onClick={() => {
              toast(
                <>
                  This is an&nbsp;<b className="font-extrabold">excellent</b>&nbsp;toast!
                </>,
              );
            }}
          >
            Toast with JSX
          </Button>

          <Button
            size="small"
            round="round"
            onClick={() => {
              toast(
                <>
                  <h3 className="text-lg font-semibold">Title of toast</h3>
                  <p className="max-w-sm">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorem nostrum
                    voluptatibus omnis beatae fuga eum ipsum dolorum quod similique soluta!
                  </p>
                </>,
                { color: 'accent' },
              );
            }}
          >
            Larger accent toast
          </Button>
          <Button
            size="small"
            round="round"
            onClick={() => {
              const id = toast('Foo bar');
              setTimeout(() => {
                return toast('Foo bar baz', { id });
              }, 500);
            }}
          >
            Toast with update
          </Button>

          <Button
            size="small"
            round="round"
            onClick={() => {
              toast(<>Error!</>, { color: 'warning' });
            }}
          >
            Warning toast
          </Button>
          <Button
            size="small"
            round="round"
            onClick={() => {
              toast(
                <span className="flex gap-2">
                  <RefreshIcon className="h-5 w-5" />
                  <span>Refresh complete</span>
                </span>,
                { color: 'success' },
              );
            }}
          >
            Toast with icon
          </Button>
        </div>
      </section>
    </Fragment>
  );
}
