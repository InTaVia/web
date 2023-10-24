import {
  ArrowUpIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  DocumentTextIcon,
  PhotographIcon,
} from '@heroicons/react/outline';
import type { ImportData as ImportedData } from '@intavia/data-import';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  IconButton,
  ScrollArea,
  useToast,
} from '@intavia/ui';
import { useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import {
  addLocalBiographies,
  addLocalEntities,
  addLocalEvents,
  addLocalMediaResources,
  addLocalVocabulary,
} from '@/app/store/intavia.slice';
import { addCollection, createCollection } from '@/app/store/intavia-collections.slice';
import { IntaviaIcon } from '@/features/common/icons/intavia-icon';
import { LoadData } from '@/features/data-import/load-data';

export function DataImport(): JSX.Element {
  const { plural, t } = useI18n<'common'>();
  const dispatch = useAppDispatch();
  const [data, setData] = useState<ImportedData | null>(null);
  const [jsonOpen, setJsonOpen] = useState(false);
  const [errorsOpen, setErrorsOpen] = useState(true);

  const { toast } = useToast();

  function onSubmit() {
    // add entities
    data?.entities && dispatch(addLocalEntities(data.entities));

    // add events
    data?.events && dispatch(addLocalEvents(data.events));

    // add media resources
    data?.media && dispatch(addLocalMediaResources(data.media));

    // add biographies
    data?.biographies && dispatch(addLocalBiographies(data.biographies));

    // add vocabularies
    if (data?.vocabularies != null) {
      for (const id in data.vocabularies) {
        if (data.vocabularies[id] != null) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          dispatch(addLocalVocabulary({ id, entries: data.vocabularies[id]! }));
        }
      }
    }
    // add collections
    if (data?.collections != null) {
      for (const collectionCandidate in data.collections) {
        if (data.collections[collectionCandidate] != null) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const collection = createCollection(data.collections[collectionCandidate]!);
          dispatch(addCollection(collection));
        }
      }
    }

    toast({
      title: 'Success',
      description: 'Data was imported successfully.',
      variant: 'default',
    });

    setData(null);

    //TODO UPDATE SOME STATE THAT RENDERS Feedback
  }

  const entityKinds = ['person', 'cultural-heritage-object', 'group', 'place'];

  function getEntityCount(entityKind: string): number {
    if (data == null || data.entities == null) return 0;
    return data.entities.filter((entity) => {
      return entity.kind === entityKind;
    }).length;
  }

  return (
    <>
      Please select an InTaVia Excel template or an IDM-JSON file, and press &quot;Import
      data&quot;.
      <LoadData data={data} onLoadData={setData} />
      {data != null ? (
        <div className="flex flex-col gap-y-2">
          {data.entities?.length +
            data.events?.length +
            data.media?.length +
            data.biographies?.length >
            0 && (
            <>
              {entityKinds.map((entityKind) => {
                return (
                  <div className="flex flex-row items-center gap-2" key={`stats-${entityKind}`}>
                    <IntaviaIcon icon={entityKind} fill="none" strokeWidth="1.5" />
                    <span>{getEntityCount(entityKind)}</span>
                    <span className="text-sm font-medium text-neutral-900">
                      {t([
                        'common',
                        'entity',
                        'kinds',
                        `${entityKind}`,
                        plural(getEntityCount(entityKind)),
                      ])}
                    </span>
                  </div>
                );
              })}
              <div className="flex flex-row items-center gap-2">
                <IntaviaIcon icon={'event-circle'} fill="none" strokeWidth="1.5" />
                <span>{data.events?.length}</span>
                <span className="text-sm font-medium text-neutral-900">Event(s)</span>
              </div>
              <div className="flex flex-row items-center gap-2">
                <PhotographIcon className="h-6 w-6 shrink-0" />
                <span>{data.media?.length}</span>
                <span className="text-sm font-medium text-neutral-900">Media Resource(s)</span>
              </div>
              <div className="flex flex-row items-center gap-2">
                <DocumentTextIcon className="h-6 w-6 shrink-0" />
                <span>{data.biographies?.length}</span>
                <span className="text-sm font-medium text-neutral-900">Biogarphy Text(s)</span>
              </div>
            </>
          )}
          {data.unmappedEntries?.length > 0 && (
            <Collapsible defaultOpen={errorsOpen} open={errorsOpen} onOpenChange={setErrorsOpen}>
              <div className="flex h-9 items-center justify-between bg-red-100 px-2">
                <span className="text-sm">{data.unmappedEntries?.length} Errors</span>
                <CollapsibleTrigger asChild>
                  <IconButton className="h-6 w-6" variant="outline" label="settings">
                    {errorsOpen ? (
                      <ChevronDoubleUpIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
                    ) : (
                      <ChevronDoubleDownIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
                    )}
                  </IconButton>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="mb-2 h-96 max-w-full ">
                  <ScrollArea className="h-full overflow-auto bg-red-100 p-2">
                    <ol className="list-decimal">
                      {data.unmappedEntries?.map((entry: any, index) => {
                        return (
                          <li key={`error-${index}`}>
                            {index + 1}: {entry.error}
                          </li>
                        );
                      })}
                    </ol>
                  </ScrollArea>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          <Collapsible defaultOpen={jsonOpen} open={jsonOpen} onOpenChange={setJsonOpen}>
            <div className="flex h-9 items-center justify-between bg-slate-100 px-2">
              <span className="text-sm">JSON-Structure</span>
              <CollapsibleTrigger asChild>
                <IconButton className="h-6 w-6" variant="outline" label="settings">
                  {jsonOpen ? (
                    <ChevronDoubleUpIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
                  ) : (
                    <ChevronDoubleDownIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
                  )}
                </IconButton>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="h-96 max-w-full">
                <ScrollArea className="h-full overflow-auto bg-slate-100 p-2">
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </ScrollArea>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ) : null}
      <Button
        className={'w-fit'}
        disabled={data == null || data.unmappedEntries?.length > 0}
        onClick={onSubmit}
      >
        <ArrowUpIcon className="h-5 w-5" />
        {t(['common', 'data-import', 'ui', 'import-data'])}
      </Button>
    </>
  );
}
