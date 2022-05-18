import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';

import { selectLocalEntities } from '@/features/common/entities.slice';
import type { Entity } from '@/features/common/entity.model';
import { useAppSelector } from '@/features/common/store';

interface SearchResultProps<T extends Entity> {
  entity: T;
}

export function SearchResult<T extends Entity>(props: SearchResultProps<T>): JSX.Element {
  const { entity: upstreamEntity } = props;

  const id = upstreamEntity.id;
  const localEntities = useAppSelector(selectLocalEntities);
  const hasLocalEntity = id in localEntities;

  const entity = hasLocalEntity ? (localEntities[id] as T) : upstreamEntity;

  return (
    <Box component="article" sx={{ width: '100%' }}>
      <NextLink href={{ pathname: `/${entity.kind}/${entity.id}` }} passHref>
        <Link style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>{entity.name}</Typography>
          {hasLocalEntity ? <span> (edited locally)</span> : null}
        </Link>
      </NextLink>
    </Box>
  );
}
