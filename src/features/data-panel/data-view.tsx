import type { Entity, Event } from '@intavia/api-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@intavia/ui';

import { EntitiesPanel } from '@/features/data-panel/entities-panel';
import { EventsPanel } from '@/features/data-panel/events-panel';

interface DataViewProps {
  entities: Array<Entity>;
  events: Array<Event>;
}

export function DataView(props: DataViewProps): JSX.Element {
  const { entities, events } = props;

  const tabs = {
    entities: { label: 'Entities', panel: <EntitiesPanel entities={entities} /> },
    chronology: { label: 'Chronology', panel: <EventsPanel events={events} /> },
  };

  return (
    <Tabs className="h-full overflow-hidden" defaultValue="entities">
      <TabsList className="w-full">
        {Object.entries(tabs).map(([id, tab]) => {
          return (
            <TabsTrigger key={id} value={id}>
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {Object.entries(tabs).map(([id, tab]) => {
        return (
          <TabsContent key={id} value={id} className="m-0 h-full overflow-auto rounded-none p-0">
            {tab.panel}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
