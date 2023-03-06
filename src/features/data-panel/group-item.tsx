import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@intavia/ui';
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
      <Collapsible>
        <CollapsibleTrigger className="flex w-full flex-row items-center justify-between p-2 text-left hover:bg-slate-200">
          <div className="flex flex-row items-center gap-1">
            {icon}
            {showCount && <span>{group.count}</span>}
            <span className="text-sm font-medium text-slate-900">{group.label}</span>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>{group.children}</CollapsibleContent>
      </Collapsible>
    </div>
  );
}
