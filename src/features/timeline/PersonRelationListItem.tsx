import Typography from '@mui/material/Typography';
import { timeFormat } from 'd3-time-format';

import type { EntityEvent } from '@/features/common/entity.model';
import { useGetPersonByIdQuery, useGetPlaceByIdQuery } from '@/features/common/intavia-api.service';

const dateFmt = timeFormat('%B %_d, %Y');

interface PersonRelationListItemProps {
  relation: EntityEvent;
}

export function PersonRelationListItem(props: PersonRelationListItemProps): JSX.Element {
  const { relation } = props;

  // pattern: <action> [<other entity name>] [in <place name>] [on <date>]
  const verb =
    relation.type === 'beginning' ? 'born' : relation.type === 'end' ? 'died' : relation.type;

  const otherEntityName =
    relation.targetId === undefined ? '' : <OtherEntityName targetId={relation.targetId} />;

  const placeName = relation.placeId === undefined ? '' : <PlaceName placeId={relation.placeId} />;

  const date =
    relation.date === undefined ? (
      ''
    ) : (
      <Typography variant="body2" component="span">
        {' on '}
        <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
          {dateFmt(new Date(relation.date))}
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
