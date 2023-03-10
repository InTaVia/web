import { Tabs, TabsContent, TabsList, TabsTrigger } from '@intavia/ui';

import { CollectionPanel } from '@/features/data-panel/collection-panel';
import { VisualizedPanel } from '@/features/data-panel/visualized-panel';

export function DataPanel(): JSX.Element {
  const tabs = {
    collections: { label: 'Collections', panel: <CollectionPanel /> },
    visualised: { label: 'Visualized', panel: <VisualizedPanel /> },
  };

  return (
    <Tabs className="grid h-full grid-rows-[auto_1fr] overflow-hidden" defaultValue="collections">
      <TabsList className="w-full">
        {Object.entries(tabs).map(([id, tab]) => {
          return (
            <TabsTrigger key={id} value={id} className="grow">
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {Object.entries(tabs).map(([id, tab]) => {
        return (
          <TabsContent key={id} value={id} className="m-0 h-full overflow-hidden rounded-none p-0">
            {tab.panel}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
