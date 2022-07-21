import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';

import { useAppSelector } from '@/app/store';
import { selectLocalEntities } from '@/features/common/entities.slice';
import type { Entity } from '@/features/common/entity.model';
import { SearchResultSelectionCheckBox } from '@/features/entities/search-result-selection-checkbox';

interface SearchResultProps<T extends Entity> {
  /** @default false */
  displaySelectionCheckBox?: boolean;
  entity: T;
}

export function SearchResult<T extends Entity>(props: SearchResultProps<T>): JSX.Element {
  const { displaySelectionCheckBox = false, entity: upstreamEntity } = props;

  const id = upstreamEntity.id;
  const localEntities = useAppSelector(selectLocalEntities);
  const hasLocalEntity = id in localEntities;
  const entity = hasLocalEntity ? (localEntities[id] as T) : upstreamEntity;

  return (
    <Box component="article" sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <NextLink href={{ pathname: `/${entity.kind}/${entity.id}` }} passHref>
        <Link style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
          <Typography>{entity.label}</Typography>
          {hasLocalEntity ? <span> (edited locally)</span> : null}
        </Link>
      </NextLink>
      {displaySelectionCheckBox ? <SearchResultSelectionCheckBox id={id} /> : null}
    </Box>
  );
}
