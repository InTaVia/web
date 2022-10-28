import type { FormEvent } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { addCollection, createCollection } from '@/app/store/intavia-collections.slice';
import { selectSearchResultsSelection } from '@/features/entities/search-results-selection.slice';
import { useClearSearchResultsSelection } from '@/features/entities/use-clear-search-results-selection';
import Button from '@/features/ui/Button';
import { Dialog, DialogContent, DialogControls } from '@/features/ui/Dialog';
import TextField from '@/features/ui/TextField';
import { useDialogState } from '@/features/ui/use-dialog-state';

export function SaveSelectionAsCollectionButton(): JSX.Element {
  const { plural, t } = useI18n<'common'>();
  const dispatch = useAppDispatch();
  const selectedEntityIds = useAppSelector(selectSearchResultsSelection);
  const dialog = useDialogState();
  useClearSearchResultsSelection();

  const formId = 'add-collection';

  function onSave(label: string) {
    const collection = createCollection({ label, entities: selectedEntityIds });
    dispatch(addCollection(collection));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const label = formData.get('label') as string;
    onSave(label);

    dialog.close();

    event.preventDefault();
  }

  return (
    <div>
      <Button
        disabled={selectedEntityIds.length === 0}
        onClick={dialog.open}
        color="accent"
        round="round"
        size="small"
      >
        <span>
          {t(['common', 'collections', 'save-selection-as-collection'])}
          <span> ({selectedEntityIds.length})</span>
        </span>
      </Button>

      <Dialog dialog={dialog} title={t(['common', 'collections', 'save-collection'])}>
        <DialogContent>
          <p>
            {t(
              [
                'common',
                'collections',
                'save-entities-as-collection',
                plural(selectedEntityIds.length),
              ],
              { values: { count: String(selectedEntityIds.length) } },
            )}
          </p>
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
