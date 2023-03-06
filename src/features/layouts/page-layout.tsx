import type { ReactNode } from 'react';

import { AppBar } from '@/features/ui/AppBar';

export interface PageLayoutProps {
  children?: ReactNode;
}

export function PageLayout(props: PageLayoutProps): JSX.Element {
  const { children } = props;

  return (
    <div className="grid min-h-full grid-rows-[auto_1fr] bg-gray-50">
      <AppBar />
      <main>{children}</main>
    </div>
  );
}
