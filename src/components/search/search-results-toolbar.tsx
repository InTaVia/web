import { Button } from '@intavia/ui';

export function SearchResultsToolbar(): JSX.Element {
  function onCreateCollectionFromQuery() {
    //
    console.log('onCreateCollectionFromQuery');
  }

  function onAddQueryToCollection() {
    //
    console.log('onQueryToCollectionCollection');
  }

  return (
    <div className="flex justify-between gap-2 border-b border-neutral-200 px-8 py-4">
      <Button onClick={onCreateCollectionFromQuery} variant="outline">
        Create new collection from query
      </Button>

      <Button onClick={onAddQueryToCollection} variant="outline">
        Add query to collection
      </Button>
    </div>
  );
}
