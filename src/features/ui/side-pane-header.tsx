import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

import styles from '@/features/ui/ui.module.css';

interface SidePaneHeaderProps {
  orientation?: 'left' | 'right';
  onMinimize?: () => void;
}

export function SidePaneHeader(props: SidePaneHeaderProps): JSX.Element {
  const { orientation = 'left', onMinimize } = props;

  const buttonArea: Array<JSX.Element> = [];

  if (onMinimize) {
    buttonArea.push(
      <button
        key="minimizeButton"
        className={styles['button-area-button']}
        onClick={() => {
          onMinimize();
        }}
      >
        {orientation === 'left' ? (
          <ChevronLeftIcon className="h-5 w-5" />
        ) : (
          <ChevronRightIcon className="h-5 w-5" />
        )}
        {/* <ClearOutlinedIcon fontSize="medium" /> */}
      </button>,
    );
  }

  return (
    <div
      style={{
        float: orientation === 'left' ? 'right' : 'left',
      }}
    >
      {orientation === 'left' ? buttonArea : buttonArea.reverse()}
    </div>
  );
}
