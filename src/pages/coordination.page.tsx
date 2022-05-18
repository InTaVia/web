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
import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

import { selectEntitiesByKind } from '@/features/common/entities.slice';
import type { Person } from '@/features/common/entity.model';
import type { EventType } from '@/features/common/event-types';
import { eventTypes } from '@/features/common/event-types';
import { useAppSelector } from '@/features/common/store';
import { LineStringLayer } from '@/features/geomap/LineStringLayer';
import { MapLibre } from '@/features/geomap/MaplibreMap';
import { PinLayer } from '@/features/geomap/PinLayer';
import { selectZoomToTimeRange } from '@/features/timeline/timeline.slice';
import { TimelineSvg } from '@/features/timeline/timeline-svg';
import { PageTitle } from '@/features/ui/page-title';

export default function CoordinationPage(): JSX.Element | null {
  const entitiesByKind = useAppSelector(selectEntitiesByKind);
  const zoomToTimeRange = useAppSelector(selectZoomToTimeRange);
  const router = useRouter();
  const personArray = useMemo(() => {
    return Object.values(entitiesByKind.person);
  }, [entitiesByKind.person]);
  const allEntityIds = personArray.map((person) => {
    return person.id;
  });
  const [filteredPersonArray, setFilteredPersonArray] = useState<Array<Person>>(personArray);
  const [visibleEntityIds, setVisibleEntityIds] = useState<Set<Person['id']>>(() => {
    return new Set(allEntityIds);
  });
  const [hoveredEntityId, setHoveredEntityId] = useState<Person['id'] | null>(null);
  const [showEventTypes, setShowEventTypes] = useState<Array<EventType>>(['beginning', 'end']);
  useEffect(() => {
    setFilteredPersonArray(
      personArray.filter((person) => {
        return visibleEntityIds.has(person.id);
      }),
    );
  }, [personArray, visibleEntityIds]);

  const timelineParent = useRef<HTMLDivElement>(null);

  function handleChange(event: SelectChangeEvent<typeof showEventTypes>) {
    const {
      target: { value },
    } = event;
    setShowEventTypes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? (value.split(',') as Array<EventType>) : value,
    );
  }

  useEffect(() => {
    if (personArray.length === 0) {
      void router.push('/search');
    }
  }, [personArray, router]);

  if (personArray.length === 0) {
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
            entities={personArray}
            checked={visibleEntityIds}
            setChecked={setVisibleEntityIds}
            hovered={hoveredEntityId}
            setHovered={setHoveredEntityId}
          />
        </Grid>
        <Grid item xs={5} ref={timelineParent}>
          <TimelineSvg
            parentRef={timelineParent}
            persons={filteredPersonArray}
            zoomToData={zoomToTimeRange}
            renderLabel={false}
            hovered={hoveredEntityId}
            setHovered={setHoveredEntityId}
          />
        </Grid>
        <Grid item xs={5}>
          <MapLibre>
            {showEventTypes.length >= 2 ? (
              <LineStringLayer
                persons={filteredPersonArray}
                showEventTypes={showEventTypes as Array<EventType>}
                hovered={hoveredEntityId}
                setHovered={setHoveredEntityId}
              />
            ) : null}
            <PinLayer
              persons={filteredPersonArray}
              showEventTypes={showEventTypes as Array<EventType>}
              hovered={hoveredEntityId}
              setHovered={setHoveredEntityId}
            />
          </MapLibre>
          <FormControl
            sx={{ m: 1, minWidth: 120, position: 'absolute', top: 100, backgroundColor: 'white' }}
            size="small"
          >
            <InputLabel id="select-event-type">Event Type</InputLabel>
            <Select
              labelId="select-event-type"
              id="select-event-type"
              multiple
              value={showEventTypes}
              label="Event Type"
              onChange={handleChange}
            >
              {Object.values(eventTypes).map((eventType) => {
                return (
                  <MenuItem key={`event-type-${eventType.id}`} value={eventType.id}>
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
  entities: Array<Person>;
  checked: Set<Person['id']>;
  setChecked: (val: Set<Person['id']>) => void;
  hovered: Person['id'] | null;
  setHovered: (val: Person['id'] | null) => void;
}

function EntitySelectionList(props: EntitySelectionListProps): JSX.Element {
  const { entities, checked, setChecked, hovered, setHovered } = props;

  function handleToggle(entityId: Person['id']) {
    const newChecked = new Set(checked);
    if (checked.has(entityId)) {
      newChecked.delete(entityId);
    } else {
      newChecked.add(entityId);
    }
    setChecked(newChecked);
  }

  function handleMouseEnter(entityId: Person['id']) {
    setHovered(entityId);
  }

  function handleMouseLeave() {
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
                  handleToggle(value.id);
                }}
                checked={checked.has(value.id)}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
            onMouseEnter={() => {
              handleMouseEnter(value.id);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.name}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
