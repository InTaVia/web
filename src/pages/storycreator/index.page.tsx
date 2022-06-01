import Container from '@mui/material/Container';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import { Fragment } from 'react';

import type { DictionariesProps } from '@/app/i18n/dictionaries';
import { load } from '@/app/i18n/load';
import { useI18n } from '@/app/i18n/use-i18n';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { StoryOverview } from '@/features/storycreator/StoryOverview';
import type { Locale } from '~/config/i18n.config';

type StoriesPageProps = DictionariesProps<'common'>;

export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<StoriesPageProps>> {
  const locale = context.locale as Locale;
  const dictionaries = await load(locale, ['common']);

  return { props: { dictionaries } };
}

export default function StoriesPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: t(['common', 'stories', 'metadata', 'title']) };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <StoriesScreen />
    </Fragment>
  );
}

function StoriesScreen(): JSX.Element {
  return (
    <Container maxWidth={false} sx={{ display: 'grid', gap: 4, padding: 4 }}>
      <StoryOverview />
    </Container>
  );
}
