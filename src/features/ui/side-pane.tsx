import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import type { ReactNode } from 'react';

import { SidePaneHeader } from '@/features/ui/side-pane-header';

interface SidePaneProps {
  orientation?: 'left' | 'right';
  setVisible: (i_visible: boolean) => void;
  children: Array<ReactNode>;
}

export default function SidePane(props: SidePaneProps): JSX.Element {
  const { orientation = 'left', children, setVisible } = props;
  const childrenFlat = [children].flat() as Array<ReactNode>;

  return (
    <>
      <SidePaneHeader
        orientation={orientation}
        onMinimize={() => {
          setVisible(false);
          console.log('MIN');
        }}
      />
      <div className="w-full px-2 pt-1">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
          {childrenFlat.map((element, index) => {
            return (
              <Disclosure
                as="div"
                className="mt-2"
                key={`disclosure${index}`}
                defaultOpen={index === 0 ? true : false}
              >
                {({ open }) => {
                  return (
                    <>
                      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                        <span>{element.props.disclosureTitle}</span>
                        <ChevronUpIcon
                          className={`${
                            !open ? 'rotate-180 transform' : ''
                          } h-5 w-5 text-purple-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                        {element}
                      </Disclosure.Panel>
                    </>
                  );
                }}
              </Disclosure>
            );
          })}
        </div>
      </div>
    </>
  );
}
