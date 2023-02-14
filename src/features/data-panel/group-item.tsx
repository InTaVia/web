import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import type { ReactNode } from 'react';

import type { GroupData } from '@/features/data-panel/data-list';

interface GroupItemProps {
  group: GroupData;
  showCount?: boolean;
  icon?: ReactNode;
}

export function GroupItem(props: GroupItemProps): JSX.Element {
  const { group, showCount = true, icon = null } = props;
  return (
    <div className="grid border border-neutral-200">
      <Disclosure>
        {({ open }) => {
          return (
            <>
              <Disclosure.Button
                as="div"
                className="flex w-full flex-row items-center justify-between px-2 py-2 text-left hover:bg-slate-200"
              >
                <div className="flex flex-row items-center gap-1">
                  {icon}
                  {showCount && <span>{group.count}</span>}
                  <span className="text-sm font-medium text-slate-900">{group.label}</span>
                </div>
                <ChevronUpIcon
                  className={`${open ? '' : 'rotate-180 transform'} h-5 w-5 text-slate-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel>{group.children}</Disclosure.Panel>
            </>
          );
        }}
      </Disclosure>
    </div>
  );
}
