import SlideLayoutButton from '@/features/storycreator/slide-layout-popover';
import type { PanelLayout } from '@/features/ui/analyse-page-toolbar/layout-popover';
import { PaneToggle } from '@/features/ui/analyse-page-toolbar/PaneToggle';
import Button from '@/features/ui/Button';

interface StroyCreatorToolbarProps {
  onLayoutSelected: (layout: PanelLayout) => void;
  desktop: boolean;
  onDesktopChange: (desktop: boolean) => void;
  timescale: boolean;
  onTimescaleChange: (timescale: boolean) => void;
  onExportStory: () => void;
  onOpenSettingsDialog: () => void;
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
  } = props;

  return (
    <div className="w-100 flex h-fit justify-between gap-2 bg-intavia-brand-100 p-2">
      <div className="flex gap-3">
        <PaneToggle parentComponent="stc" orientation="left" />
        <SlideLayoutButton onLayoutSelected={props.onLayoutSelected} />
        <Button
          size="small"
          round="pill"
          color="accent"
          onClick={() => {
            onDesktopChange(!desktop);
          }}
        >
          {desktop ? 'Mobile' : 'Desktop'}
        </Button>
        <Button
          size="small"
          round="pill"
          color="accent"
          onClick={() => {
            onOpenSettingsDialog();
          }}
        >
          Settings
        </Button>
        <Button
          size="small"
          round="pill"
          color="accent"
          onClick={() => {
            onExportStory();
          }}
        >
          Export
        </Button>
        {/* <Button
          size="small"
          round="pill"
          color="accent"
          onClick={() => {
            onTimescaleChange(!timescale);
          }}
        >
          {timescale ? 'Timescale' : 'No Timescale'}
        </Button> */}
      </div>
      <div className="flex">
        <PaneToggle parentComponent="stc" orientation="right" />
      </div>
    </div>
  );
}
