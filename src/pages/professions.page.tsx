import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Fragment, useEffect } from 'react';

import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { useGetProfessionsQuery } from '@/features/common/intavia-api.service';
import { usePersonsSearchFilters } from '@/features/entities/use-persons-search-filters';
import { Professions } from '@/features/professions/professions';
import { ProfessionsPageHeader } from '@/features/professions/professions-page-header';
import { LeafSizing } from '@/features/professions/professions-svg';
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

  const searchFilters = usePersonsSearchFilters();
  const { data, isLoading } = useGetProfessionsQuery(searchFilters);

  const origin = new Origin();

  // for testing only
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

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
        <ProfessionsPageHeader />
        <Paper sx={{ minHeight: '50vh', display: 'grid' }}>
          {isLoading ? (
            <Typography role="status">Loading...</Typography>
          ) : (
            <Professions
              constraint={constraint}
              origin={origin}
              leafSizing={LeafSizing.QualitativeWithBar}
              professions={data!}
            />
          )}
        </Paper>
      </Container>
    </Fragment>
  );
}
