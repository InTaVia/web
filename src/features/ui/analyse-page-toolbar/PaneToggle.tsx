import { Button } from '@intavia/ui';
import { ChevronFirstIcon } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import type { ComponentName, PaneOrientation } from '@/features/ui/ui.slice';
import { selectPaneOpen, setSidePane } from '@/features/ui/ui.slice';

interface PaneToggleProps {
  parentComponent: ComponentName;
  orientation: PaneOrientation;
}

export function PaneToggle(props: PaneToggleProps): JSX.Element {
  const { orientation, parentComponent } = props;
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector((state) => {
    return selectPaneOpen(state, parentComponent, orientation);
  });

  if (orientation === 'left') {
    return (
      <Button
        variant="ghost"
        className="hover:bg-neutral-200"
        size="xs"
        onClick={() => {
          dispatch(
            setSidePane({
              component: parentComponent,
              paneOrientation: orientation,
              isOpen: !isOpen,
            }),
          );
        }}
      >
        <ChevronFirstIcon className={`${!isOpen ? 'rotate-180' : ''} h-5 w-5 `} />
      </Button>
    );
  } else {
    return (
      <Button
        variant="ghost"
        className="hover:bg-neutral-200"
        size="xs"
        onClick={() => {
          dispatch(
            setSidePane({
              component: parentComponent,
              paneOrientation: orientation,
              isOpen: !isOpen,
            }),
          );
        }}
      >
        <ChevronFirstIcon className={`${isOpen ? 'rotate-180' : ''} h-5 w-5`} />
      </Button>
    );
  }
}
