import { Button } from '@intavia/ui';
import { useMemo } from 'react';

import SlideLayoutButton from '@/features/storycreator/slide-layout-popover';
import type { PanelLayout } from '@/features/ui/analyse-page-toolbar/layout-popover';
import { PaneToggle } from '@/features/ui/analyse-page-toolbar/PaneToggle';

interface StroyCreatorToolbarProps {
  onLayoutSelected: (layout: PanelLayout) => void;
  desktop: boolean;
  onDesktopChange: (desktop: boolean) => void;
  timescale: boolean;
  onTimescaleChange: (timescale: boolean) => void;
  onExportStory: () => void;
  onOpenSettingsDialog: () => void;
  onPreviewStory: () => void;
  previewStatus: 'default' | 'error' | 'loading';
}

export default function StroyCreatorToolbar(props: StroyCreatorToolbarProps): JSX.Element {
  /* const { split = false, onSplit, onSave } = props; */
  const {
    desktop,
    onDesktopChange,
    timescale,
    onTimescaleChange,
    onExportStory,
    onOpenSettingsDialog,
    onPreviewStory,
    previewStatus,
  } = props;

  const previewStatusText = useMemo(() => {
    switch (previewStatus) {
      case 'loading':
        return 'Loading';
      case 'error':
        return 'Error';
      case 'default':
      default:
        return 'Preview';
    }
  }, [previewStatus]);

  return (
    <div className="w-100 flex h-fit justify-between gap-2 bg-intavia-brand-100 p-2">
      <div className="flex gap-3">
        <PaneToggle parentComponent="stc" orientation="left" />
        <SlideLayoutButton onLayoutSelected={props.onLayoutSelected} />
        {/* <Button
          onClick={() => {
            onDesktopChange(!desktop);
          }}
        >
          {desktop ? 'Mobile' : 'Desktop'}
        </Button> */}

        <Button
          size={'xs'}
          onClick={() => {
            onExportStory();
          }}
        >
          Export
        </Button>
        <Button
          size={'xs'}
          onClick={() => {
            onPreviewStory();
          }}
        >
          {previewStatusText}
        </Button>
      </div>
      <div className="flex gap-3">
        <Button
          size={'xs'}
          onClick={() => {
            onOpenSettingsDialog();
          }}
        >
          Settings
        </Button>
        <PaneToggle parentComponent="stc" orientation="right" />
      </div>
    </div>
  );
}
