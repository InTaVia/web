import type { LayoutButtonProps } from '@/features/ui/analyse-page-toolbar/layout-popover';
import LayoutPopover from '@/features/ui/analyse-page-toolbar/layout-popover';
import { PaneToggle } from '@/features/ui/analyse-page-toolbar/PaneToggle';

interface AnalysePageToolbarProps {
  onLayoutSelected: LayoutButtonProps['onLayoutSelected'];
}

export default function AnalysePageToolbar(props: AnalysePageToolbarProps): JSX.Element {
  return (
    <div className="w-100 flex justify-between gap-2 bg-teal-50 p-2">
      <div className="flex gap-3">
        <PaneToggle orientation="left" />
        <LayoutPopover onLayoutSelected={props.onLayoutSelected} />
      </div>
      <div className="flex">
        <PaneToggle orientation="right" />
      </div>
    </div>
  );
}
