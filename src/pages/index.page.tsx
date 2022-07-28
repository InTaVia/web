import { ChevronRightIcon } from '@heroicons/react/outline';
import {
  ChatAlt2Icon,
  DatabaseIcon,
  DownloadIcon,
  InformationCircleIcon,
  LightBulbIcon,
} from '@heroicons/react/solid';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { SearchForm } from '@/features/entities/search-form';
import ButtonLink from '@/features/ui/ButtonLink';
import IntaviaLogo from '~/public/assets/images/logo.svg';

export const getStaticProps = withDictionaries(['common']);

export default function HomePage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: t(['common', 'home', 'metadata', 'title']) };
  const cards = [
    {
      id: 'card-dcl',
      title: t(['common', 'home', 'card-dcl', 'title']),
      text: t(['common', 'home', 'card-dcl', 'text']),
      href: { pathname: '/search' },
      icon: <DatabaseIcon className="h-10 w-10" />,
      img: { src: '/assets/images/EC_logo_s.png', alt: 'Data Curation Lab' },
      button: 'Data Curation Lab',
    },
    {
      title: t(['common', 'home', 'card-vas', 'title']),
      text: t(['common', 'home', 'card-vas', 'text']),
      href: { pathname: '/visual-analytics-studio' },
      icon: <LightBulbIcon className="h-10 w-10" />,
      img: { src: '/assets/images/teaser_vas.png', alt: 'Visual Analytics Studio' },
      button: 'Visual Analytics Studio',
    },
    {
      title: t(['common', 'home', 'card-stc', 'title']),
      text: t(['common', 'home', 'card-stc', 'text']),
      href: { pathname: '/storycreator' },
      icon: <ChatAlt2Icon className="h-10 w-10" />,
      img: { src: '/assets/images/teaser_stc.png', alt: 'Storytelling Creator' },
      button: 'Storytelling Creator',
    },
  ];

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <div className="flex h-full w-full flex-col justify-between">
        <section className="flex max-h-[400px] min-h-[300px] place-content-center items-center gap-2 bg-gradient-to-r from-intavia-brand-400 to-intavia-green-400">
          <div className="relative h-28 w-64">
            <Link href="/">
              <a>
                <Image src={IntaviaLogo} layout="fill" objectFit="contain" />
              </a>
            </Link>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-600">In/Tangible European Heritage</h1>
            <h2 className="text-2xl text-gray-600">Some Subheader</h2>
          </div>
          <div className="w-96">
            <SearchForm round="pill" size="regular" />
          </div>
          <ButtonLink
            href="/search"
            color="accent"
            round="pill"
            className="inline-flex items-center gap-2"
          >
            <DownloadIcon className="h-5 w-5" strokeWidth="1.75" />
            {t(['common', 'data-import'])}
          </ButtonLink>
          <ButtonLink
            href="/info"
            size="regular"
            round="pill"
            color="primary"
            className="inline-flex items-center gap-2"
          >
            <InformationCircleIcon className="h-5 w-5" />
            {t(['common', 'learn-more'])}
          </ButtonLink>
        </section>
        <section className="flex place-content-evenly">
          {cards.map((card) => {
            return (
              <div
                key={card.title}
                className="w-96 max-w-sm rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="p-5">
                  <Link href={card.href.pathname}>
                    <a className="flex place-content-center items-center gap-2 text-indigo-600">
                      <div>{card.icon}</div>
                      <div className="text-lg font-medium dark:text-white">{card.title}</div>
                    </a>
                  </Link>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{card.text}</p>
                  <ButtonLink
                    href={card.href.pathname}
                    size="small"
                    round="round"
                    color="primary"
                    className="inline-flex items-center gap-2 font-medium"
                  >
                    {card.button}
                    <ChevronRightIcon className="h-5 w-5" />
                  </ButtonLink>
                </div>
              </div>
            );
          })}
        </section>
        <footer className="flex h-16 place-content-center items-center justify-between gap-4 bg-gray-200 px-20 text-gray-900">
          <Image src="/assets/images/EC_logo_s.png" alt="EC Logo" width={55} height={36} />
          <p>
            This project has received funding from the European Union’s Horizon 2020 research and
            innovation programme under grant agreement No. 101004825. This website reflects only the
            authors’ views and the European Union is not liable for any use that may be made of the
            information contained therein.
          </p>
        </footer>
      </div>
    </Fragment>
  );
}
