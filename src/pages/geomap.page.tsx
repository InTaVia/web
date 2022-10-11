import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import Link from 'next/link';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/app/store/entities.slice';
import { EntityEventsLineStringLayer } from '@/features/geomap/entity-events-line-string-layer';
import { EntityEventyPinLayer } from '@/features/geomap/entity-events-pin-layer';
import { GeoMap } from '@/features/geomap/geo-map';
import { base as baseMap } from '@/features/geomap/maps.config';
import { PageTitle } from '@/features/ui/page-title';

export const getStaticProps = withDictionaries(['common']);

export default function GeoMapPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: t(['common', 'geomap', 'metadata', 'title']) };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <GeoMapScreen />
    </Fragment>
  );
}

function GeoMapScreen(): JSX.Element {
  const entitiesByKind = useAppSelector(selectEntitiesByKind);
  const persons = Object.values(entitiesByKind.person);

  if (persons.length === 0) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', height: '800px' }}>
        <Typography paragraph>
          Nothing to see - Please do a{' '}
          <Link href="/search">
            <a>search</a>
          </Link>
          !
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ padding: 4, height: '80vh' }}>
      <PageTitle>Map of Lifespans</PageTitle>
      <GeoMap {...baseMap}>
        <EntityEventsLineStringLayer entities={persons} eventTypes={['beginning', 'end']} />
        <EntityEventyPinLayer entities={persons} eventTypes={['beginning', 'end']} />
      </GeoMap>
    </Container>
  );
}
