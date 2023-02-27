import type { Entity } from '@intavia/api-client';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@intavia/ui';
import { MenuIcon } from 'lucide-react';
import NextLink from 'next/link';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectEntities, selectLocalEntities } from '@/app/store/intavia.slice';
import {
  removeEntitiesFromCollection,
  selectCollections,
} from '@/app/store/intavia-collections.slice';
import { NothingFoundMessage } from '@/components/nothing-found-message';
import { useCollection } from '@/components/search/collection.context';
import { CreateCollectionDialog } from '@/components/search/create-collection-dialog';
import { getTranslatedLabel } from '@/lib/get-translated-label';

export function CollectionView(): JSX.Element {
  const { t } = useI18n<'common'>();

  const _collections = useAppSelector(selectCollections);
  const { currentCollection } = useCollection();

  function onCreateCollection() {
    //
    console.log('onCreateCollection');
  }

  if (currentCollection == null) {
    return (
      <div className="grid h-full w-full place-items-center bg-neutral-50">
        <CreateCollectionDialog>
          <Button onClick={onCreateCollection}>
            {t(['common', 'collections', 'create-collection'])}
          </Button>
        </CreateCollectionDialog>
      </div>
    );
  }

  const collection = _collections[currentCollection];

  if (collection?.entities.length === 0) {
    return (
      <div className="grid h-full w-full place-items-center bg-neutral-50">
        <NothingFoundMessage>
          {t(['common', 'collections', 'empty-collection'])}
        </NothingFoundMessage>
      </div>
    );
  }

  // FIXME: ensure all entities are in the store, pass full entity

  return (
    <ul role="list" className="divide-y-200 divide-y bg-neutral-50">
      {collection?.entities.map((id) => {
        return (
          <li key={id} className="odd:bg-white">
            <CollectionEntity id={id} />
          </li>
        );
      })}
    </ul>
  );
}

interface CollectionEntityProps {
  id: Entity['id'];
}

function CollectionEntity(props: CollectionEntityProps): JSX.Element | null {
  const { id } = props;

  const { t } = useI18n<'common'>();

  const dispatch = useAppDispatch();

  const _collections = useAppSelector(selectCollections);
  const { currentCollection } = useCollection();

  const _entities = useAppSelector(selectEntities);
  const entity = _entities[id];

  const _localEntities = useAppSelector(selectLocalEntities);
  const hasLocalEntity = id in _localEntities;

  if (entity == null) return null;

  const detailsUrl = { pathname: `/entities/${encodeURIComponent(entity.id)}` };

  function onEditItem() {}

  function onRemoveItem() {
    if (currentCollection == null) return;
    dispatch(removeEntitiesFromCollection({ id: currentCollection, entities: [id] }));
  }

  return (
    <article className="flex items-center justify-between gap-8 px-8 py-2">
      <NextLink href={detailsUrl}>
        <a>
          <span>{getTranslatedLabel(entity.label)}</span>
          {hasLocalEntity ? <span> (edited locally)</span> : null}
        </a>
      </NextLink>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-1" variant="outline">
            <span className="sr-only">Menu</span>
            <MenuIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          <DropdownMenuItem disabled={currentCollection == null} onSelect={onEditItem}>
            {t(['common', 'search', 'edit-item'])}
          </DropdownMenuItem>
          <DropdownMenuItem disabled={currentCollection == null} onSelect={onRemoveItem}>
            {t(['common', 'collections', 'remove-item'])}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </article>
  );
}
