import type { Entity } from '@intavia/api-client';
import { IconButton } from '@intavia/ui';
import { Edit2Icon, PlusIcon } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { type MouseEvent } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectLocalEntities } from '@/app/store/intavia.slice';
import { addEntitiesToCollection, selectCollections } from '@/app/store/intavia-collections.slice';
import { useCollection } from '@/components/search/collection.context';
import { IntaviaIcon } from '@/features/common/icons/intavia-icon';
import { getTranslatedLabel } from '@/lib/get-translated-label';

interface SearchResultProps<T extends Entity> {
  entity: T;
}

export function SearchResult<T extends Entity>(props: SearchResultProps<T>): JSX.Element {
  const { entity: upstreamEntity } = props;

  const { t } = useI18n<'common'>();

  const id = upstreamEntity.id;
  const localEntities = useAppSelector(selectLocalEntities);
  const hasLocalEntity = id in localEntities;
  const entity = hasLocalEntity ? (localEntities[id] as T) : upstreamEntity;

  const detailsUrl = { pathname: `/entities/${encodeURIComponent(entity.id)}` };

  const router = useRouter();
  const dispatch = useAppDispatch();
  const collections = useAppSelector(selectCollections);
  const { currentCollection } = useCollection();

  function onEditItem(e: MouseEvent) {
    e.stopPropagation();

    void router.push(`/entities/${id}/edit`);
  }

  function onAddToCollection(e: MouseEvent) {
    e.stopPropagation();

    if (currentCollection == null) return;
    dispatch(addEntitiesToCollection({ id: currentCollection, entities: [id] }));
  }

  function isAddToCollectionDisabled(): boolean {
    if (currentCollection == null) return true;

    const collection = collections[currentCollection];
    if (
      collection &&
      collection.entities.filter((entityId) => {
        return entityId === entity.id;
      }).length > 0
    )
      return true;
    return false;
  }

  return (
    <NextLink href={detailsUrl}>
      <article className="group flex cursor-pointer items-center justify-between gap-8 px-8 py-1 hover:bg-slate-100">
        <div className="flex flex-row items-center justify-start gap-6">
          <IntaviaIcon
            className="h-5 w-5 fill-none group-hover:fill-intavia-neutral-200"
            icon={entity.kind}
          />
          <div className="grid gap-0 leading-tight">
            <a className="group-hover:underline">
              <span>{getTranslatedLabel(entity.label)}</span>
              {hasLocalEntity ? <span> (edited locally)</span> : null}
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
            className="h-7 w-7 p-1 aria-disabled:cursor-default aria-disabled:text-neutral-200 aria-disabled:focus:ring-0"
            variant="outline"
            label="t(['common', 'search', 'add-to-collection'])"
            aria-disabled={isAddToCollectionDisabled()}
            onClick={onAddToCollection}
            title={t(['common', 'search', 'add-to-collection'])}
          >
            <PlusIcon className="h-4 w-4 shrink-0" />
          </IconButton>
        </div>
      </article>
    </NextLink>
  );
}
