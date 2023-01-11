import NextLink from 'next/link';

import type { Entity } from '@intavia/api-client';
import { useAppSelector } from '@/app/store';
import { selectLocalEntities } from '@/app/store/intavia.slice';
import { SearchResultSelectionCheckBox } from '@/features/entities/search-result-selection-checkbox';
import { getTranslatedLabel } from '@/lib/get-translated-label';

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
    <article style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <NextLink href={{ pathname: `/${entity.kind}/${encodeURIComponent(entity.id)}` }} passHref>
        <a style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
          <p>{getTranslatedLabel(entity.label)}</p>
          {hasLocalEntity ? <span> (edited locally)</span> : null}
        </a>
      </NextLink>
      {displaySelectionCheckBox ? <SearchResultSelectionCheckBox id={id} /> : null}
    </article>
  );
}
