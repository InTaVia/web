import {
  ChartSquareBarIcon,
  ChatIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  SearchIcon,
} from '@heroicons/react/outline';
import { Button, Input } from '@intavia/ui';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import Image from 'next/image';
import Link from 'next/link';
import type { FormEvent } from 'react';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useSearchEntities } from '@/components/search/use-search-entities';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';
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
      icon: <SearchIcon className="h-6 w-6" />,
      img: { src: '/assets/images/EC_logo_s.png', alt: 'Data Curation Lab' },
      button: t(['common', 'app-bar', 'data-curation-lab']),
    },
    {
      title: t(['common', 'home', 'card-vas', 'title']),
      text: t(['common', 'home', 'card-vas', 'text']),
      href: { pathname: '/visual-analytics-studio' },
      icon: <ChartSquareBarIcon className="h-6 w-6" />,
      img: { src: '/assets/images/teaser_vas.png', alt: 'Visual Analytics Studio' },
      button: t(['common', 'app-bar', 'visual-analytics-studio']),
    },
    {
      title: t(['common', 'home', 'card-stc', 'title']),
      text: t(['common', 'home', 'card-stc', 'text']),
      href: { pathname: '/storycreator' },
      icon: <ChatIcon className="h-6 w-6" />,
      img: { src: '/assets/images/teaser_stc.png', alt: 'Storytelling Creator' },
      button: t(['common', 'app-bar', 'story-creator']),
    },
  ];

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <div className="flex h-full w-full flex-col justify-between">
        <section className="flex max-h-[500px] min-h-[400px] flex-col place-content-center items-center gap-10 bg-gradient-to-r from-intavia-brand-400 to-intavia-green-400">
          <div className="flex flex-row items-center gap-8">
            <div className="relative h-28 w-32">
              <Link href="/">
                <a>
                  <Image src={IntaviaLogo} layout="fill" objectFit="contain" />
                </a>
              </Link>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-600">
                {t(['common', 'home', 'hero', 'title'])}
              </h1>
              <h2 className="text-2xl text-gray-600">
                {t(['common', 'home', 'hero', 'subtitle'])}
              </h2>
            </div>
            <Link href={'/info'}>
              <a>
                <InformationCircleIcon strokeWidth="1.25" className="h-8 w-8" />
              </a>
            </Link>
          </div>
          <div className="w-full px-96">
            <SearchForm />
          </div>
        </section>
        <section className="flex justify-center gap-x-10">
          {cards.map((card) => {
            return (
              <div
                key={card.title}
                className="dark:border-gray-700 dark:bg-gray-800 flex w-96 max-w-sm flex-col flex-nowrap rounded-lg border border-gray-200 bg-white shadow-md"
              >
                <Link href={card.href.pathname}>
                  <a className="flex place-content-center gap-2 pt-3 text-intavia-green-900">
                    <div>{card.icon}</div>
                    <div className="dark:text-white text-lg font-medium">{card.title}</div>
                  </a>
                </Link>

                <p className="dark:text-gray-400 h-full px-5 py-2 text-justify font-normal text-gray-700">
                  {card.text}
                </p>
                <Link href={card.href.pathname} className="">
                  <a className="flex w-full place-content-end gap-2 rounded-b-lg bg-intavia-green-50 px-5 py-3 font-medium">
                    {card.button}
                    <ChevronRightIcon className="h-5 w-5" />
                  </a>
                </Link>
              </div>
            );
          })}
        </section>
        <footer className="flex h-16 place-content-center items-center gap-4 bg-gray-200 px-20 text-gray-900">
          <Image src="/assets/images/EC_logo_s.png" alt="EC Logo" width={55} height={36} />
          <p>
            This project has received funding from the European Union&apos;s Horizon 2020 research
            and innovation programme under grant agreement No. 101004825. This website reflects only
            the authors&apos; views and the European Union is not liable for any use that may be
            made of the information contained therein.
          </p>
        </footer>
      </div>
    </Fragment>
  );
}

function SearchForm(): JSX.Element {
  const { t } = useI18n<'common'>();

  const searchFilters = useSearchEntitiesFilters();
  const { search } = useSearchEntities();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    const searchTerm = formData.get('q') as string;

    search({ ...searchFilters, page: 1, q: searchTerm });

    event.preventDefault();
  }

  return (
    <form
      className="mx-auto w-full max-w-7xl px-8 py-4"
      autoComplete="off"
      name="search"
      noValidate
      onSubmit={onSubmit}
      role="search"
    >
      <div className="grid grid-cols-[1fr_auto_auto] gap-2">
        <Input
          aria-label={t(['common', 'search', 'search'])}
          className="bg-neutral-50"
          defaultValue={searchFilters.q}
          key={searchFilters.q}
          name="q"
          placeholder={t(['common', 'search', 'search-term'])}
          type="search"
        />

        <Button type="submit">{t(['common', 'search', 'search'])}</Button>
      </div>
    </form>
  );
}
