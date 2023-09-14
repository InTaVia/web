import type { ReactNode } from 'react';

import { AppBar } from '@/features/ui/app-bar';

export interface PageLayoutProps {
  children?: ReactNode;
}

export function PageLayout(props: PageLayoutProps): JSX.Element {
  const { children } = props;

  return (
    <div className="grid h-full min-h-full grid-rows-[auto_1fr] bg-neutral-50">
      <AppBar />
      {children}
    </div>
  );
}
