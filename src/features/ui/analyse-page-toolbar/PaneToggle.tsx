import { LoginIcon } from '@heroicons/react/outline';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectPaneOpen, toggleLeftPane, toggleRightPane } from '@/features/ui/ui.slice';

interface PaneToggleProps {
  orientation: 'left' | 'right';
}

export function PaneToggle(props: PaneToggleProps): JSX.Element {
  const { orientation } = props;
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector((state) => {
    return selectPaneOpen(state, orientation);
  });

  if (orientation === 'left') {
    return (
      <button
        onClick={() => {
          dispatch(toggleLeftPane(!isOpen));
        }}
      >
        <LoginIcon className={`${!isOpen ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`} />
      </button>
    );
  } else {
    return (
      <button
        onClick={() => {
          dispatch(toggleRightPane(!isOpen));
        }}
      >
        <LoginIcon className={`${isOpen ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`} />
      </button>
    );
  }
}
