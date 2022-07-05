import { Popover, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/solid';
import { Fragment, useRef } from 'react';

import type { LayoutButtonProps } from '@/features/ui/analyse-page-toolbar/layout-popover';
import LayoutPopover from '@/features/ui/analyse-page-toolbar/layout-popover';

interface AnalysePageToolbarProps {
  onLayoutSelected: LayoutButtonProps['onLayoutSelected'];
}

export default function AnalysePageToolbar(props: AnalysePageToolbarProps): JSX.Element {
  return (
    <div className="flex gap-2 p-2 bg-teal-50">
      <LayoutPopover onLayoutSelected={props.onLayoutSelected} />
    </div>
  );
}
