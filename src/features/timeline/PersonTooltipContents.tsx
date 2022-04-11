import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { timeFormat } from 'd3-time-format';

import type { Person, Relation } from '@/features/common/entity.model';
import { useGetPlaceByIdQuery } from '@/features/common/intavia-api.service';

const dateFmt = timeFormat('%B %_d, %Y');

interface PersonTooltipContentsProps {
  person: Person;
}

export function PersonTooltipContents(props: PersonTooltipContentsProps): JSX.Element {
  const { person } = props;

  const hist = person.history || [];
  const dobEvent = hist.find((d) => {
    return d.type === 'beginning';
  });
  const dodEvent = hist.find((d) => {
    return d.type === 'end';
  });

  return (
    <Paper>
      <Typography variant="h5">{person.name}</Typography>

      <Typography variant="body2" component="p">
        {useGenerateEventDescription(dobEvent, 'Born', ' ')}
        {useGenerateEventDescription(dodEvent, 'Died')}
      </Typography>

      <Typography variant="body2" component="p">
        {person.description}
      </Typography>
    </Paper>
  );
}

function useGenerateEventDescription(
  evt: Relation | undefined,
  verb: string,
  suffix = '',
): JSX.Element | '' {
  const dateStr = evt?.date ? dateFmt(new Date(evt.date)) : '';
  const searchResult = useGetPlaceByIdQuery({ id: evt?.placeId ?? '' }); // XXX

  if (dateStr === '' && (searchResult.isLoading || searchResult.isError)) return '';

  const placeDescription = searchResult.isSuccess ? (
    <Typography variant="body2" component="span">
      {' in '}
      <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
        {searchResult.data.name}
      </Typography>
    </Typography>
  ) : (
    ''
  );

  return (
    <Typography variant="body2" component="span">
      {verb}
      {' on '}
      <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
        {dateStr}
      </Typography>
      {placeDescription}
      {'.'}
      {suffix}
    </Typography>
  );
}
