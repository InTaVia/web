import { LoginIcon } from '@heroicons/react/outline';

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
      <button
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
        <LoginIcon className={`${!isOpen ? 'rotate-180' : ''} h-5 w-5 text-neutral-800`} />
      </button>
    );
  } else {
    return (
      <button
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
        <LoginIcon className={`${isOpen ? 'rotate-180' : ''} h-5 w-5 text-neutral-800`} />
      </button>
    );
  }
}
