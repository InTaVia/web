import PersonIcon from '@mui/icons-material/Person';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

import type { Entity, Person } from '@/api/intavia.models';
import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/app/store/intavia.slice';
import type { EventType } from '@/features/common/event-types';
import { eventTypes as allEventTypes } from '@/features/common/event-types';
import { EntityEventsLineStringLayer } from '@/features/geomap/entity-events-line-string-layer';
import { EntityEventyPinLayer } from '@/features/geomap/entity-events-pin-layer';
import { GeoMap } from '@/features/geomap/geo-map';
import { base as baseMap } from '@/features/geomap/maps.config';
import { selectZoomToTimeRange } from '@/features/timeline/timeline.slice';
import { TimelineSvg } from '@/features/timeline/timeline-svg';
import { PageTitle } from '@/features/ui/page-title';
import { getTranslatedLabel } from '@/lib/get-translated-label';

export const getStaticProps = withDictionaries(['common']);

export default function CoordinationPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: t(['common', 'coordination', 'metadata', 'title']) };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <CoordinationScreen />
    </Fragment>
  );
}

function CoordinationScreen(): JSX.Element | null {
  const router = useRouter();
  const zoomToTimeRange = useAppSelector(selectZoomToTimeRange);
  const entitiesByKind = useAppSelector(selectEntitiesByKind);
  const persons = useMemo(() => {
    return Object.values(entitiesByKind.person);
  }, [entitiesByKind.person]);
  const allPersonIds = persons.map((person) => {
    return person.id;
  });
  const [filteredPersons, setFilteredPersons] = useState<Array<Person>>(persons);
  const [visibleEntityIds, setVisibleEntityIds] = useState<Set<Person['id']>>(() => {
    return new Set(allPersonIds);
  });
  const [hoveredEntityId, setHoveredEntityId] = useState<Person['id'] | null>(null);
  const [eventTypes, setEventTypes] = useState<Array<EventType>>(['beginning', 'end']);

  useEffect(() => {
    setFilteredPersons(
      persons.filter((person) => {
        return visibleEntityIds.has(person.id);
      }),
    );
  }, [persons, visibleEntityIds]);

  const timelineParent = useRef<HTMLDivElement>(null);

  function onChange(event: SelectChangeEvent<typeof eventTypes>) {
    const { value } = event.target;
    setEventTypes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? (value.split(',') as Array<EventType>) : value,
    );
  }

  useEffect(() => {
    if (persons.length === 0) {
      void router.push('/search');
    }
  }, [persons, router]);

  if (persons.length === 0) {
    return null;
  }

  return (
    <Fragment>
      <PageTitle>Multiple Views</PageTitle>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        sx={{ height: '80vh' }}
      >
        <Grid item xs={2}>
          <EntitySelectionList
            entities={persons}
            checked={visibleEntityIds}
            setChecked={setVisibleEntityIds}
            hovered={hoveredEntityId}
            setHovered={setHoveredEntityId}
          />
        </Grid>
        <Grid item xs={5} ref={timelineParent}>
          <TimelineSvg
            parentRef={timelineParent}
            persons={filteredPersons}
            zoomToData={zoomToTimeRange}
            renderLabel={false}
            hoveredEntityId={hoveredEntityId}
            setHoveredEntityId={setHoveredEntityId}
          />
        </Grid>
        <Grid item xs={5}>
          <GeoMap {...baseMap}>
            {eventTypes.length >= 2 ? (
              <EntityEventsLineStringLayer entities={filteredPersons} eventTypes={eventTypes} />
            ) : null}
            <EntityEventyPinLayer
              entities={filteredPersons}
              eventTypes={eventTypes}
              hoveredEntityId={hoveredEntityId}
              setHoveredEntityId={setHoveredEntityId}
            />
          </GeoMap>
          <FormControl
            sx={{ m: 1, minWidth: 120, position: 'absolute', top: 100, backgroundColor: 'white' }}
            size="small"
          >
            <InputLabel id="select-event-type">Event Type</InputLabel>
            <Select
              labelId="select-event-type"
              multiple
              value={eventTypes}
              label="Event Type"
              onChange={onChange}
            >
              {Object.values(allEventTypes).map((eventType) => {
                return (
                  <MenuItem key={eventType.id} value={eventType.id}>
                    {eventType.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Fragment>
  );
}

interface EntitySelectionListProps {
  entities: Array<Entity>;
  checked: Set<Entity['id']>;
  setChecked: (ids: Set<Entity['id']>) => void;
  hovered: Entity['id'] | null;
  setHovered: (id: Entity['id'] | null) => void;
}

function EntitySelectionList(props: EntitySelectionListProps): JSX.Element {
  const { entities, checked, setChecked, hovered, setHovered } = props;

  function onToggle(entityId: Entity['id']) {
    const newChecked = new Set(checked);
    if (checked.has(entityId)) {
      newChecked.delete(entityId);
    } else {
      newChecked.add(entityId);
    }
    setChecked(newChecked);
  }

  function onMouseEnter(entityId: Entity['id']) {
    setHovered(entityId);
  }

  function onMouseLeave() {
    setHovered(null);
  }

  return (
    <List
      dense
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        overflow: 'auto',
        maxHeight: '80vh',
      }}
    >
      {entities.map((value) => {
        const labelId = `entity-list-secondary-label-${value.id}`;
        return (
          <ListItem
            sx={value.id === hovered ? { backgroundColor: 'salmon' } : undefined}
            key={value.id}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={() => {
                  onToggle(value.id);
                }}
                checked={checked.has(value.id)}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
            onMouseEnter={() => {
              onMouseEnter(value.id);
            }}
            onMouseLeave={onMouseLeave}
          >
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${getTranslatedLabel(value.label)}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
