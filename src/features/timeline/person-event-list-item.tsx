import Typography from '@mui/material/Typography';
import { timeFormat } from 'd3-time-format';

import type { EntityEvent } from '@/api/intavia.models';
import { useGetPersonByIdQuery, useGetPlaceByIdQuery } from '@/features/common/intavia-api.service';

const dateFmt = timeFormat('%B %_d, %Y');

interface PersonEventListItemProps {
  event: EntityEvent;
}

export function PersonEventListItem(props: PersonEventListItemProps): JSX.Element {
  const { event } = props;

  // pattern: <action> [<other entity name>] [in <place name>] [on <date>]
  const verb = event.type === 'beginning' ? 'born' : event.type === 'end' ? 'died' : event.type;

  const otherEntityName =
    event.targetId === undefined ? '' : <OtherEntityName targetId={event.targetId} />;

  const placeName = event.placeId === undefined ? '' : <PlaceName placeId={event.placeId} />;

  const date =
    event.date === undefined ? (
      ''
    ) : (
      <Typography variant="body2" component="span">
        {' on '}
        <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
          {dateFmt(new Date(event.date))}
        </Typography>
      </Typography>
    );

  return (
    <Typography variant="body2" component="li">
      {verb}
      {otherEntityName}
      {placeName}
      {date}
    </Typography>
  );
}

function OtherEntityName(props: { targetId: string }): JSX.Element {
  const { targetId } = props;

  const searchResult = useGetPersonByIdQuery({ id: targetId });
  return searchResult.isLoading || searchResult.isError ? (
    <Typography variant="body2" component="span" />
  ) : (
    <Typography variant="body2" component="span">
      {' '}
      <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
        {searchResult.data?.name}
      </Typography>
    </Typography>
  );
}

function PlaceName(props: { placeId: string }): JSX.Element {
  const { placeId } = props;

  const searchResult = useGetPlaceByIdQuery({ id: placeId });
  return searchResult.isLoading || searchResult.isError ? (
    <Typography variant="body2" component="span" />
  ) : (
    <Typography variant="body2" component="span">
      {' in '}
      <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
        {searchResult.data?.name}
      </Typography>
    </Typography>
  );
}
