import { Container } from '@mui/material';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useParams } from '@/app/route/use-params';
import { useAppSelector } from '@/app/store';
import { StoryCreator } from '@/features/storycreator/StoryCreator';
import { selectStories } from '@/features/storycreator/storycreator.slice';

export const getServerSideProps = withDictionaries(['common']);

export default function StoryPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: t(['common', 'story', 'metadata', 'title']) };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      {/* <StoryScreen /> */}
    </Fragment>
  );
}

function StoryScreen(): JSX.Element | null {
  const router = useRouter();
  const params = useParams();
  const stories = useAppSelector(selectStories);
  const id = params?.get('id');
  const story = id != null ? stories[id] : null;

  useEffect(() => {
    /** Router is not ready yet. */
    if (params == null) return;

    if (story == null) {
      void router.replace({ pathname: '/storycreator' });
    }
  }, [router, params, story]);

  if (story == null) {
    return null;
  }

  return (
    <Container maxWidth={false} sx={{ height: '95vh', display: 'grid', gap: 4, padding: 4 }}>
      <StoryCreator story={story} />
    </Container>
  );
}
