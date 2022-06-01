import { PageMetadata } from '@stefanprobst/next-page-metadata';
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import { Fragment } from 'react';

import type { DictionariesProps } from '@/app/i18n/dictionaries';
import { load } from '@/app/i18n/load';
import { useI18n } from '@/app/i18n/use-i18n';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { VisualQuerying } from '@/features/visual-querying/VisualQuerying';
import type { Locale } from '~/config/i18n.config';

type VisualQueryPageProps = DictionariesProps<'common'>;

export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<VisualQueryPageProps>> {
  const locale = context.locale as Locale;
  const dictionaries = await load(locale, ['common']);

  return { props: { dictionaries } };
}

export default function VisualQueryPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: t(['common', 'visual-query', 'metadata', 'title']) };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <main>
        <VisualQuerying />
      </main>
    </Fragment>
  );
}
