import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';

import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/features/common/entities.slice';
import { Professions } from '@/features/professions/professions';
import { ProfessionsPageHeader } from '@/features/professions/professions-page-header';
import { Origin } from '@/features/visual-querying/Origin';
import type { ProfessionConstraint } from '@/features/visual-querying/visualQuerying.slice';
import {
  addConstraint,
  ConstraintType,
  selectConstraints,
} from '@/features/visual-querying/visualQuerying.slice';

export default function ProfessionsPage(): JSX.Element | null {
  const metadata = { title: 'Profession Hierarchy' };

  const dispatch = useAppDispatch();
  const titleTemplate = usePageTitleTemplate();
  const entities = useAppSelector(selectEntitiesByKind);
  const persons = Object.values(entities.person);
  const router = useRouter();

  const origin = new Origin();

  useEffect(() => {
    if (persons.length === 0) {
      void router.push({ pathname: '/search' });
    }
  }, [router, persons.length]);

  // TODO: testing only
  useEffect(() => {
    const constraint: ProfessionConstraint = {
      id: 'Profession',
      opened: true,
      type: ConstraintType.Profession,
      selection: ['Developer', 'Liaison', 'Strategist'],
    };
    dispatch(addConstraint(constraint));
  }, [dispatch]);
  const constraints = useAppSelector(selectConstraints);
  const constraint = constraints.find((d) => {
    return d.type === 'Profession';
  }) as ProfessionConstraint | undefined;

  if (persons.length === 0) {
    return null;
  }

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
        <ProfessionsPageHeader />
        <Paper sx={{ minHeight: '50vh', display: 'grid' }}>
          <Professions constraint={constraint} origin={origin} />
        </Paper>
      </Container>
    </Fragment>
  );
}
