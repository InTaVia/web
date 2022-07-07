import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { Allotment } from 'allotment';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { SidePaneHeader } from '@/features/ui/side-pane-header';

interface LeftPaneProps {
  children: ReactNode;
  preferredSize?: string;
}

export function CenterPane(props: LeftPaneProps): JSX.Element {
  const { children, preferredSize = '50%' } = props;
  const [open, setOpen] = useState(true);

  /* if (open) { */
  return (
    <Allotment.Pane
      key={`allotmentCenter${open}`}
      minSize={200}
      preferredSize={preferredSize}
      visible={open}
    >
      <SidePaneHeader
        orientation={'left'}
        onMinimize={() => {
          setOpen(false);
        }}
      />
      {children}
    </Allotment.Pane>
  );
  /* } else {
    return (
      <div style={{ height: '100%', width: '20px' }}>
        <button
          key="maximizeButton"
          onClick={() => {
            setOpen(true);
          }}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    );
  } */
}
