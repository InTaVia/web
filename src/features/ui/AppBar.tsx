import { DownloadIcon, InformationCircleIcon } from '@heroicons/react/outline';
import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { useI18n } from '@/app/i18n/use-i18n';
import { usePathname } from '@/app/route/use-pathname';
import Button from '@/features/ui/Button';
import IntaviaLogo from '~/public/assets/images/logo.svg';

interface Link {
  id: string;
  href: { pathname: string };
  label: JSX.Element | string;
  current: boolean;
}

export function AppBar(): JSX.Element {
  const { t } = useI18n<'common'>();
  const currentPath = usePathname();

  const linksLeft: Array<Link> = [
    {
      id: 'data-curation-lab',
      href: { pathname: '/search' },
      label: t(['common', 'data-curation-lab']),
      current: false,
    },
    {
      id: 'visual-analytics-studio',
      href: { pathname: '/visual-analytics-studio' },
      label: t(['common', 'visual-analytics-studio']),
      current: false,
    },
    {
      id: 'storytelling-creator',
      href: { pathname: '/storycreator' },
      label: t(['common', 'storytelling-creator']),
      current: false,
    },
  ];

  const linksRight: Array<Link> = [
    {
      id: 'info',
      href: { pathname: '/info' },
      label: <InformationCircleIcon strokeWidth="1.25" className="h-8 w-8" />,
      current: false,
    },
  ];

  const currentLink = linksLeft.concat(linksRight).find((link) => {
    return link.href.pathname === currentPath;
  });
  if (currentLink) {
    currentLink.current = true;
  }

  return (
    <div className="h-16 w-full bg-white">
      <div className="flex flex-row flex-nowrap justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="relative h-14 w-32">
            <Link href="/">
              <a>
                <Image src={IntaviaLogo} layout="fill" objectFit="contain" />
              </a>
            </Link>
          </div>
          <div className="flex h-16 flex-row items-center gap-3">
            {linksLeft.map((item) => {
              return (
                <Link key={item.id} href={item.href.pathname}>
                  <a
                    className={clsx(
                      item.current ? 'text-intavia-brand-900' : 'text-black',
                      'px-3 text-base hover:text-intavia-brand-900',
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex h-16 flex-row items-center gap-6 pr-6">
          <Button color="accent" round="pill" className="flex items-center gap-2">
            <DownloadIcon className="h-5 w-5" strokeWidth="1.75" />
            {t(['common', 'data-import'])}
          </Button>
          {linksRight.map((item) => {
            return (
              <Link key={item.id} href={item.href.pathname}>
                <a
                  className={clsx(
                    item.current ? 'text-intavia-brand-900' : 'text-black',
                    'hover:text-intavia-brand-900',
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
