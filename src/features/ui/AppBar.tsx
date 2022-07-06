import { InformationCircleIcon, UploadIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import { useRouter } from 'next/router';

import IntaviaLogo from '~/public/assets/images/logo.svg';

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(' ');
}

export function AppBar(): JSX.Element {
  const router = useRouter();
  const currentPath = router.pathname;

  const linksLeft = [
    {
      id: 'data-curation-lab',
      href: { pathname: '/search' },
      label: 'Data Curation Lab',
      current: true,
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

  return (
    <div className="w-full h-16 bg-white">
      <div className="flex flex-row flex-nowrap justify-between">
        <div className="flex flex-row">
          <div className="h-14 w-40 relative">
            <Image src={IntaviaLogo} layout="fill" objectFit="contain" />
          </div>
          <div className="flex flex-row h-16 gap-3 items-center">
            {linksLeft.map((item) => {
              return (
                <a
                  key={item.id}
                  href={item.href.pathname}
                  className={classNames(
                    currentPath === item.href.pathname ? 'text-intavia-green' : 'text-black',
                    'hover:text-intavia-green px-3',
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
        <div className="flex flex-row h-16 gap-6 items-center pr-6">
          <button className="bg-intavia-green px-4 py-1 text-white rounded-lg flex items-center gap-2 text-base hover:text-intavia-green hover:bg-white hover:border hover:border-intavia-green">
            <UploadIcon className="h-5 w-5" strokeWidth="1.75" />
            Data Import
          </button>
          <a href="/info">
            <InformationCircleIcon
              strokeWidth="1.25"
              className={classNames(
                currentPath === '/info' ? 'text-intavia-green' : 'text-black',
                'hover:text-intavia-green h-8 w-8 hover:text-intavia-green',
              )}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
