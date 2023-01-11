import type { FormEvent } from 'react';

import type { Entity } from '@intavia/api-client';
import { useLazySearchEntitiesQuery } from '@/api/intavia.service';
import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import type { QueryMetadata } from '@/app/store/intavia-collections.slice';
import { addCollection, createCollection } from '@/app/store/intavia-collections.slice';
import { useSearchEntitiesFilters } from '@/features/entities/use-search-entities-filters';
import { useSearchEntitiesResults } from '@/features/entities/use-search-entities-results';
import Button from '@/features/ui/Button';
import { Dialog, DialogContent, DialogControls } from '@/features/ui/Dialog';
import TextField from '@/features/ui/TextField';
import { useDialogState } from '@/features/ui/use-dialog-state';

export function SaveQueryAsCollectionButton(): JSX.Element {
  const { t } = useI18n<'common'>();
  const dispatch = useAppDispatch();
  const searchFilters = useSearchEntitiesFilters();
  const searchResults = useSearchEntitiesResults();
  const [trigger] = useLazySearchEntitiesQuery();
  const dialog = useDialogState();

  const formId = 'add-collection';

  async function onSave(label: string) {
    const endpoint = 'searchEntities';
    const searchParams = { ...searchFilters };
    const queries: Array<QueryMetadata> = [];
    const ids: Array<Entity['id']> = [];

    async function getEntities(page = 1) {
      const params = { ...searchParams, page };
      queries.push({ endpoint, params });

      const query = await trigger(params, true);
      const entities = query.data?.results ?? [];
      ids.push(
        ...entities.map((entity) => {
          return entity.id;
        }),
      );

      return query;
    }

    let page = 0;
    while (++page < ((await getEntities(page)).data?.pages ?? 1)) {
      /** noop */
    }

    //

    const collection = createCollection({ label, entities: ids, metadata: { queries } });
    dispatch(addCollection(collection));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const label = formData.get('label') as string;
    void onSave(label);

    dialog.close();

    event.preventDefault();
  }

  return (
    <div>
      <Button
        disabled={searchResults.data == null || searchResults.data.count === 0}
        onClick={dialog.open}
        color="accent"
        round="round"
        size="small"
      >
        {t(['common', 'collections', 'save-query-as-collection'])}
      </Button>
      <Dialog dialog={dialog} title={t(['common', 'collections', 'save-collection'])}>
        <DialogContent>
          <form id={formId} name={formId} noValidate onSubmit={onSubmit}>
            <TextField
              aria-label={t(['common', 'collections', 'collection-name'])}
              required
              name="label"
              placeholder={t(['common', 'collections', 'collection-name'])}
            />
          </form>
        </DialogContent>
        <DialogControls>
          <Button onClick={dialog.close}>{t(['common', 'form', 'cancel'])}</Button>
          <Button form={formId} type="submit">
            {t(['common', 'form', 'save'])}
          </Button>
        </DialogControls>
      </Dialog>
    </div>
  );
}
