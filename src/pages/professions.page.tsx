import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';

import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/features/common/entities.slice';
import { Professions } from '@/features/professions/professions';
import { ProfessionsPageHeader } from '@/features/professions/professions-page-header';

export default function ProfessionsPage(): JSX.Element | null {
  const metadata = { title: 'Profession Hierarchy' };

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

  // TODO: testing only
  const constraint = {
    id: 'foo bar',
    opened: true,
    type: 'Profession',
    selection: new Set<string>(['Developer', 'Liaison', 'Strategist']),
  };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
        <ProfessionsPageHeader />
        <Paper>
          <Professions constraint={constraint} />
        </Paper>
      </Container>
    </Fragment>
  );
}
