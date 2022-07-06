import { InformationCircleIcon, UploadIcon } from '@heroicons/react/outline';
import { clsx } from 'clsx';
import Image from 'next/image';

import { usePathname } from '@/app/route/use-pathname';
import IntaviaLogo from '~/public/assets/images/logo.svg';

interface Link {
  id: string;
  href: { pathname: string };
  label: JSX.Element | string;
  current: boolean;
}

export function AppBar(): JSX.Element {
  const currentPath = usePathname();

  const linksLeft: Array<Link> = [
    {
      id: 'data-curation-lab',
      href: { pathname: '/search' },
      label: 'Data Curation Lab',
      current: false,
    },
    {
      id: 'visual-analytics-studio',
      href: { pathname: '/visual-analytics-studio' },
      label: 'Visual Analytics Studio',
      current: false,
    },
    {
      id: 'storytelling-creator',
      href: { pathname: '/storycreator' },
      label: 'Storytelling Creator',
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
    <div className="w-full h-16 bg-white">
      <div className="flex flex-row flex-nowrap justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="h-14 w-40 relative">
            <a href="/">
              <Image src={IntaviaLogo} layout="fill" objectFit="contain" />
            </a>
          </div>
          <div className="flex flex-row h-16 gap-3 items-center">
            {linksLeft.map((item) => {
              return (
                <a
                  key={item.id}
                  href={item.href.pathname}
                  className={clsx(
                    item.current ? 'text-intavia-brand' : 'text-black',
                    'hover:text-intavia-brand px-3 text-base',
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
        <div className="flex flex-row h-16 gap-6 items-center pr-6">
          <button className="bg-intavia-brand px-4 py-1 text-white rounded-lg flex items-center gap-2 text-base hover:text-intavia-brand hover:bg-white hover:border hover:border-intavia-brand">
            <UploadIcon className="h-5 w-5" strokeWidth="1.75" />
            Data Import
          </button>

          {linksRight.map((item) => {
            return (
              <a
                key={item.id}
                href={item.href.pathname}
                className={clsx(
                  item.current ? 'text-intavia-brand' : 'text-black',
                  'hover:text-intavia-brand',
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
