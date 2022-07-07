import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/features/common/entities.slice';
import { Timeline } from '@/features/timeline/timeline';
import { TimelinePageHeader } from '@/features/timeline/timeline-page-header';
import { ZoomRangeToggle } from '@/features/timeline/zoom-range-toggle';

export const getStaticProps = withDictionaries(['common']);

export default function TimelinePage(): JSX.Element | null {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();
  const entities = useAppSelector(selectEntitiesByKind);
  const persons = Object.values(entities.person);
  const router = useRouter();

  useEffect(() => {
    if (persons.length === 0) {
      void router.push({ pathname: '/search' });
    }
  }, [router, persons.length]);

  if (persons.length === 0) {
    return null;
  }

  const metadata = { title: t(['common', 'timeline', 'metadata', 'title']) };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
        <TimelinePageHeader />
        <Paper>
          <ZoomRangeToggle />
          <Timeline />
        </Paper>
      </Container>
    </Fragment>
  );
}
