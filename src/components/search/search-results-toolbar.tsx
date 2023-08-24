import {
  Button,
  Dialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
  useToast,
} from '@intavia/ui';
import { FilePlus2Icon, ListIcon, PieChartIcon, PlusIcon } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useState } from 'react';

import { useAppDispatch } from '@/app/store';
import { addEntitiesToCollection } from '@/app/store/intavia-collections.slice';
import { useCollection } from '@/components/search/collection.context';
import { SaveQueryAsCollectionDialog } from '@/components/search/save-query-as-collection-dialog';
import { useAllSearchResults } from '@/components/search/use-all-search-results';

export function SearchResultsToolbar(props: {
  onTriggerList: (e: MouseEvent) => void;
  onTriggerOverview: (e: MouseEvent) => void;
}): JSX.Element {
  const { onTriggerList, onTriggerOverview } = props;
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-between gap-2 border-b border-neutral-200 px-8 py-2 lg:flex-row">
        <Tabs id="result-tabs" defaultValue="result-list">
          <TabsList>
            <TabsTrigger
              onClick={onTriggerList}
              value="result-list"
              className="flex gap-2 py-2 px-4"
            >
              <ListIcon className="h-4 w-4 shrink-0" />
              Result list
            </TabsTrigger>
            <TabsTrigger
              onClick={onTriggerOverview}
              value="result-overview"
              className="flex gap-2 py-2 px-4"
            >
              <PieChartIcon className="h-4 w-4 shrink-0" />
              Result overview
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Add all menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="subtle" className="py-4">
              <PlusIcon className="h-4 w-4 shrink-0" />
              Add all
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit" align="end">
            <NewCollectionFromQueryMenuItem
              onSelect={() => {
                setDialogOpen(true);
              }}
            />
            <AddQueryToCollectionMenuItem />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Save query as collection dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <SaveQueryAsCollectionDialog
          onClose={() => {
            setDialogOpen(false);
          }}
        />
      </Dialog>
    </>
  );
}

function NewCollectionFromQueryMenuItem(props: { onSelect: (e: Event) => void }): JSX.Element {
  const { onSelect } = props;

  return (
    <DropdownMenuItem className="flex gap-2 p-2" onSelect={onSelect}>
      <FilePlus2Icon className="h-4 w-4 shrink-0" />
      New collection from query
    </DropdownMenuItem>
  );
}

function AddQueryToCollectionMenuItem(): JSX.Element {
  const dispatch = useAppDispatch();
  const { currentCollection } = useCollection();
  const { getSearchResults } = useAllSearchResults();
  const { toast } = useToast();

  async function onAddQueryToCollection() {
    if (currentCollection == null) return;

    const { dismiss } = toast({
      title: 'Fetching entities',
      description: 'Retrieving search results for current query...',
    });
    const { entities } = await getSearchResults();
    dismiss();

    dispatch(addEntitiesToCollection({ id: currentCollection, entities }));
  }

  return (
    <DropdownMenuItem className="flex gap-2 p-2" onSelect={onAddQueryToCollection}>
      <PlusIcon className="h-4 w-4 shrink-0" />
      Add to current collection
    </DropdownMenuItem>
  );
}
