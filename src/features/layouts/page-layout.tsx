import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

import { AppBar } from '@/features/ui/AppBar';

export interface PageLayoutProps {
  children?: ReactNode;
}

export function PageLayout(props: PageLayoutProps): JSX.Element {
  const { children } = props;

  return (
    <div className="grid min-h-full grid-rows-[0px_auto_1fr] bg-gray-50">
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'text-intavia-gray-900 bg-intavia-gray-100 drop-shadow-lg',
            success: {
              className: 'text-intavia-green-900 bg-intavia-green-100',
            },
            error: {
              className: 'text-intavia-red-900 bg-intavia-red-100',
            },
          }}
        />
      </div>
      <AppBar />
      <main>{children}</main>
    </div>
  );
}
