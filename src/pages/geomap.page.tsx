import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';

import type { DictionariesProps } from '@/app/i18n/dictionaries';
import { load } from '@/app/i18n/load';
import { useI18n } from '@/app/i18n/use-i18n';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/features/common/entities.slice';
import { LineStringLayer } from '@/features/geomap/LineStringLayer';
import { MapLibre } from '@/features/geomap/MaplibreMap';
import { PinLayer } from '@/features/geomap/PinLayer';
import { PageTitle } from '@/features/ui/page-title';
import type { Locale } from '~/config/i18n.config';

type GeoMapPageProps = DictionariesProps<'common'>;

export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<GeoMapPageProps>> {
  const locale = context.locale as Locale;
  const dictionaries = await load(locale, ['common']);

  return { props: { dictionaries } };
}

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
      <MapLibre>
        <LineStringLayer persons={persons} showEventTypes={['beginning', 'end']} />
        <PinLayer persons={persons} showEventTypes={['beginning', 'end']} />
      </MapLibre>
    </Container>
  );
}
