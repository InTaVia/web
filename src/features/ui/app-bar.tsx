import { cn, Dialog, DialogTrigger } from '@intavia/ui';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { usePathname } from '@/app/route/use-pathname';
import { DataImportDialog } from '@/features/data-import/data-import-dialog';
import IntaviaLogo from '~/public/assets/images/logo.svg';

interface Link {
  id: string;
  href: { pathname: string };
  label: JSX.Element | string;
}

export function AppBar(): JSX.Element {
  const { t } = useI18n<'common'>();
  const currentPath = usePathname();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const links: Array<Link> = [
    {
      id: 'data-curation-lab',
      href: { pathname: '/search' },
      label: t(['common', 'app-bar', 'data-curation-lab']),
    },
    {
      id: 'visual-analytics-studio',
      href: { pathname: '/visual-analytics-studio' },
      label: t(['common', 'app-bar', 'visual-analytics-studio']),
    },
    {
      id: 'storytelling-creator',
      href: { pathname: '/storycreator' },
      label: t(['common', 'app-bar', 'story-creator']),
    },
  ];

  return (
    <div className="h-16 w-full border-b bg-white">
      <div className="flex flex-row flex-nowrap justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="relative h-14 w-32">
            <Link href="/">
              <a aria-current={currentPath === '/' ? 'page' : undefined}>
                <span className="sr-only">Home</span>
                <Image alt="" src={IntaviaLogo} layout="fill" objectFit="contain" />
              </a>
            </Link>
          </div>
          <div className="flex h-16 flex-row items-center gap-3">
            {links.map((item) => {
              const isCurrent = currentPath === item.href.pathname;

              return (
                <Link key={item.id} href={item.href.pathname}>
                  <a
                    className={cn(
                      'px-3 text-base transition hover:text-neutral-700',
                      isCurrent && 'text-neutral-700',
                    )}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex h-16 flex-row items-center gap-6 pr-6">
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>Import data</DialogTrigger>
            <DataImportDialog
              onClose={() => {
                setDialogOpen(false);
              }}
            />
          </Dialog>
        </div>
      </div>
    </div>
  );
}
