import { Tab } from '@headlessui/react';
import clsx from 'clsx';

import { CollectionPanel } from '@/features/data-panel/collection-panel';
import { VisualizedPanel } from '@/features/data-panel/visualized-panel';

export function DataPanel(): JSX.Element {
  const tabs = [
    { label: 'Collections', panel: <CollectionPanel /> },
    { label: 'Visualized', panel: <VisualizedPanel /> },
  ];

  return (
    <Tab.Group as="div" className="grid h-full grid-rows-[auto_1fr] bg-gray-100">
      <Tab.List className="flex w-full" as="div">
        {tabs.map((tab) => {
          return (
            <Tab
              key={`tab-${tab.label}`}
              className={({ selected }) => {
                return clsx({
                  ['flex-grow cursor-pointer rounded-sm px-2 py-2 text-sm font-medium leading-5 text-intavia-brand-800']:
                    true, //always applies
                  ['bg-white text-gray-400 hover:text-intavia-brand-800']: !selected,
                  ['hover:bg-white/[0.12] hover:text-intavia-brand-800']: selected,
                });
              }}
            >
              {tab.label}
            </Tab>
          );
        })}
      </Tab.List>
      <Tab.Panels as="div" className="h-full overflow-hidden">
        {tabs.map((tab) => {
          return (
            <Tab.Panel
              key={`tab-panel-${tab.label}`}
              as="div"
              className="flex h-full flex-col gap-1"
            >
              {tab.panel}
            </Tab.Panel>
          );
        })}
      </Tab.Panels>
    </Tab.Group>
  );
}
