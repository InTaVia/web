import type { Entity } from '@intavia/api-client';
import { Button, Dialog, DialogTrigger, IconButton } from '@intavia/ui';
import { Edit2Icon, XIcon } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
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
      <footer className="border-t border-neutral-200 py-4 px-8">
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

  const router = useRouter();
  const dispatch = useAppDispatch();

  const { currentCollection } = useCollection();

  const _entities = useAppSelector(selectEntities);
  const entity = _entities[id];

  const _localEntities = useAppSelector(selectLocalEntities);
  const hasLocalEntity = id in _localEntities;

  if (entity == null) return null;

  const label = `${getTranslatedLabel(entity.label)} ${hasLocalEntity ? ' (edited locally)' : ''}`;
  const detailsUrl = { pathname: `/entities/${encodeURIComponent(entity.id)}` };

  function onEditItem(e: MouseEvent) {
    e.stopPropagation();

    void router.push(`/entities/${id}/edit`);
  }

  function onRemoveItem(e: MouseEvent) {
    e.stopPropagation();

    if (currentCollection == null) return;
    dispatch(removeEntitiesFromCollection({ id: currentCollection, entities: [id] }));
  }

  return (
    <NextLink href={detailsUrl}>
      <article className="group flex cursor-pointer items-center justify-between gap-8 px-8 py-1 hover:bg-slate-100">
        <div className="flex flex-row items-center justify-start gap-6">
          <IntaviaIcon
            className="h-5 w-5 shrink-0 fill-none group-hover:fill-intavia-neutral-200"
            icon={entity.kind}
          />
          <div className="grid gap-0 leading-tight">
            <a
              className="overflow-hidden text-ellipsis whitespace-nowrap group-hover:underline"
              title={label}
            >
              <span>{label}</span>
            </a>
            <div className="text-xs text-neutral-500">
              {t(['common', 'entity', 'kinds', entity.kind, 'one'])}
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center justify-end gap-2">
          <IconButton
            className="h-7 w-7 p-1"
            variant="outline"
            label="t(['common', 'search', 'edit-item'])"
            onClick={onEditItem}
            title={t(['common', 'search', 'edit-item'])}
          >
            <Edit2Icon className="h-4 w-4 shrink-0" />
          </IconButton>
          <IconButton
            className="h-7 w-7 p-1"
            variant="outline"
            label="t(['common', 'collections', 'remove-item'])"
            onClick={onRemoveItem}
            title={t(['common', 'collections', 'remove-item'])}
          >
            <XIcon className="h-4 w-4 shrink-0" />
          </IconButton>
        </div>
      </article>
    </NextLink>
  );
}
