import type { LayoutButtonProps } from '@/features/ui/analyse-page-toolbar/layout-popover';
import LayoutPopover from '@/features/ui/analyse-page-toolbar/layout-popover';
import { PaneToggle } from '@/features/ui/analyse-page-toolbar/PaneToggle';

interface AnalysePageToolbarProps {
  onLayoutSelected: LayoutButtonProps['onLayoutSelected'];
}

export default function AnalysePageToolbar(props: AnalysePageToolbarProps): JSX.Element {
  return (
    <div className="w-100 bg-brand-500 flex h-fit justify-between gap-2 bg-neutral-200 p-2">
      <div className="flex gap-3">
        <PaneToggle parentComponent="vas" orientation="left" />
        <LayoutPopover onLayoutSelected={props.onLayoutSelected} />
      </div>
      <div className="flex">
        <PaneToggle parentComponent="vas" orientation="right" />
      </div>
    </div>
  );
}
