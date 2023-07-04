import type { Entity } from '@intavia/api-client';
import {
  Button,
  Dialog,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@intavia/ui';
import { MenuIcon } from 'lucide-react';
import NextLink from 'next/link';
import type { MouseEvent } from 'react';
import { useState } from 'react';

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
import { EditEntityDialog } from '@/components/search/edit-entity-dialog';
import { IntaviaIcon } from '@/features/common/icons/intavia-icon';
import { getTranslatedLabel } from '@/lib/get-translated-label';

export function CollectionView(): JSX.Element {
  const { t } = useI18n<'common'>();

  const _collections = useAppSelector(selectCollections);
  const { currentCollection } = useCollection();

  const [isDialogOpen, setDialogOpen] = useState(false);

  if (currentCollection == null) {
    return (
      <div className="grid h-full w-full place-items-center bg-neutral-50">
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>{t(['common', 'collections', 'create-collection'])}</Button>
          </DialogTrigger>
          <CreateCollectionDialog
            onClose={() => {
              setDialogOpen(false);
            }}
          />
        </Dialog>
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
    <div className="min-h-0 overflow-auto bg-neutral-50">
      <ul role="list" className="divide-y divide-neutral-200">
        {collection?.entities.map((id) => {
          return (
            <li key={id} className="odd:bg-white">
              <CollectionEntity id={id} />
            </li>
          );
        })}
      </ul>
      <footer className="border-t border-neutral-200 py-10 px-8">
        {collection?.entities.length} Entities
      </footer>
    </div>
  );
}

interface CollectionEntityProps {
  id: Entity['id'];
}

function CollectionEntity(props: CollectionEntityProps): JSX.Element | null {
  const { id } = props;

  const { t } = useI18n<'common'>();

  const dispatch = useAppDispatch();

  const { currentCollection } = useCollection();

  const _entities = useAppSelector(selectEntities);
  const entity = _entities[id];

  const _localEntities = useAppSelector(selectLocalEntities);
  const hasLocalEntity = id in _localEntities;

  const [isDialogOpen, setDialogOpen] = useState(false);

  if (entity == null) return null;

  const detailsUrl = { pathname: `/entities/${encodeURIComponent(entity.id)}` };

  function onEditItem() {
    setDialogOpen(true);
  }

  function onRemoveItem() {
    if (currentCollection == null) return;
    dispatch(removeEntitiesFromCollection({ id: currentCollection, entities: [id] }));
  }

  function onClick(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <NextLink href={detailsUrl}>
      <article className="group flex cursor-pointer items-center justify-between gap-8 px-8 py-2.5 hover:bg-slate-100">
        <div className="flex flex-row items-center justify-start gap-6">
          <IntaviaIcon className="fill-none" icon={entity.kind} />
          <div className="grid gap-1 leading-tight">
            <a className="group-hover:underline">
              <span>{getTranslatedLabel(entity.label)}</span>
              {hasLocalEntity ? <span> (edited locally)</span> : null}
            </a>
            <div className="text-xs text-neutral-500">
              {t(['common', 'entity', 'kinds', entity.kind, 'one'])}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-1" variant="outline">
              <span className="sr-only">Menu</span>
              <MenuIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuItem
              disabled={currentCollection == null}
              onClick={onClick}
              onSelect={onEditItem}
            >
              {t(['common', 'search', 'edit-item'])}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={currentCollection == null}
              onClick={onClick}
              onSelect={onRemoveItem}
            >
              {t(['common', 'collections', 'remove-item'])}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <EditEntityDialog
            entity={entity}
            onClose={() => {
              setDialogOpen(false);
            }}
          />
        </Dialog>
      </article>
    </NextLink>
  );
}
