import { Tab } from "@headlessui/react";
import type { Entity, Event } from "@intavia/api-client";
import { cn } from "@intavia/ui";

import { EntitiesPanel } from "@/features/data-panel/entities-panel";
import { EventsPanel } from "@/features/data-panel/events-panel";

interface DataViewProps {
	entities: Array<Entity>;
	events: Array<Event>;
}

export function DataView(props: DataViewProps): JSX.Element {
	const { entities, events } = props;

	const tabs = [
		{ label: "Entities", panel: <EntitiesPanel entities={entities} /> },
		{ label: "Chronology", panel: <EventsPanel events={events} /> },
	];

	return (
		<Tab.Group as="div" className="grid h-full grid-rows-[auto_1fr] overflow-auto">
			<Tab.List className="flex w-full" as="div">
				{tabs.map((tab) => {
					return (
						<Tab
							key={`tab-${tab.label}`}
							className={({ selected }) => {
								return cn({
									["flex-grow cursor-pointer rounded-sm px-2 py-2 text-sm font-medium leading-5 text-intavia-brand-800"]:
										true, //always applies
									["bg-white text-gray-400 hover:text-intavia-brand-800"]: !selected,
									["hover:bg-white/[0.12] hover:text-intavia-brand-800"]: selected,
								});
							}}
						>
							{tab.label}
						</Tab>
					);
				})}
			</Tab.List>
			<Tab.Panels as="div" className="h-full overflow-auto">
				{tabs.map((tab) => {
					return (
						<Tab.Panel
							as="div"
							key={`tab-panel-${tab.label}`}
							className="flex h-full flex-col gap-1 overflow-auto"
						>
							{tab.panel}
						</Tab.Panel>
					);
				})}
			</Tab.Panels>
		</Tab.Group>
	);
}
