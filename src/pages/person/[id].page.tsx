import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Fragment } from 'react';

import { useGetEntitiesByIdQuery } from '@/api/intavia.service';
import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useParams } from '@/app/route/use-params';
import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind, selectLocalEntitiesByKind } from '@/app/store/intavia.slice';
import { PersonDetails } from '@/features/entities/person-details';

export const getServerSideProps = withDictionaries(['common']);

export default function PersonPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: t(['common', 'person', 'metadata', 'title']) };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <PersonScreen />
    </Fragment>
  );
}

//https://intavia-backend.acdh-dev.oeaw.ac.at/api/entities/id?ids=
//http%3A%2F%2Fdata.biographynet.nl%2Frdf%2FPersonDes-10010273_02
//http%3A%2F%2Fdata.biographynet.nl%2Frdf%2FPersonDes-10010273_02

//https://intavia-backend.acdh-dev.oeaw.ac.at/api/entities/id?page=1&limit=50&ids=

function PersonScreen(): JSX.Element {
  const params = useParams();
  const tempId = params?.get('id');
  const id = tempId != null ? decodeURIComponent(tempId) : null;
  console.log('id', id);
  const entitiesByKind = useAppSelector(selectEntitiesByKind);
  const localEntitiesByKind = useAppSelector(selectLocalEntitiesByKind);
  // TODO: force displaying upstream entity with `upstream` search param
  const entity =
    id != null ? localEntitiesByKind.person[id] ?? entitiesByKind.person[id] : undefined;
  // TODO: check if rtkq has something similar to react query's `initialData`
  const entityByIdQuery = useGetEntitiesByIdQuery(id != null ? { ids: [id] } : skipToken);

  console.log('entityByIdQuery', entityByIdQuery);
  const person = entity ?? entityByIdQuery.data?.results[0];

  if (id == null || entityByIdQuery.isLoading) {
    return (
      <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4, placeItems: 'center' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (person == null) {
    return (
      <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4, placeItems: 'center' }}>
        <Typography>Not found.</Typography>
      </Container>
    );
  }

  if (person?.kind !== 'person') {
    return <></>;
  }

  return (
    <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
      <PersonDetails person={person} />
    </Container>
  );
}
