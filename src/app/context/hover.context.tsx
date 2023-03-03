import type { Entity, EntityEventRelation, Event, EventEntityRelation } from "@intavia/api-client";
import { assert } from "@stefanprobst/assert";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";

import { useAppSelector } from "@/app/store";
import { selectEntities, selectEvents } from "@/app/store/intavia.slice";
import { unique } from "@/lib/unique";

interface Hover {
	entities: Array<Entity["id"]>;
	events: Array<Event["id"]>;
	clientRect: DOMRect | null;
}

interface HoverContextType {
	hovered: Hover | null;
	updateHover: (ids: Hover | null) => void;
}

interface HoverProviderProps {
	children: ReactNode;
}

export const HoverContext = createContext<HoverContextType | null>(null);

export function HoverProvider(props: HoverProviderProps): JSX.Element {
	const { children } = props;
	const [hovered, setHovered] = useState<Hover | null>(null);

	const _entities = useAppSelector(selectEntities);
	const _events = useAppSelector(selectEvents);

	const value = useMemo(() => {
		const updateHover = (hover: Hover | null) => {
			if (hover == null) {
				setHovered(null);
				return;
			}
			const { entities, events, clientRect = null } = hover;

			const hoveredEntities = entities.map((entityId) => {
				return _entities[entityId];
			}) as Array<Entity>;

			const hoveredEvents = events.map((eventId) => {
				return _events[eventId];
			}) as Array<Event>;

			const relatedEntities = hoveredEvents.flatMap((event: Event) => {
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				return event.relations !== undefined
					? event.relations.map((relation: EventEntityRelation) => {
							return relation.entity;
					  })
					: ([] as Array<Entity["id"]>);
			});

			const relatedEvents = hoveredEntities.flatMap((entity: Entity) => {
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				return entity.relations !== undefined
					? entity.relations.map((relation: EntityEventRelation) => {
							return relation.event;
					  })
					: ([] as Array<Event["id"]>);
			});

			setHovered({
				entities: unique([...hover.entities, ...relatedEntities]),
				events: unique([...hover.events, ...relatedEvents]),
				clientRect,
			});
		};
		return { hovered, updateHover };
	}, [hovered]);

	return <HoverContext.Provider value={value}>{children}</HoverContext.Provider>;
}

export function useHoverState() {
	const value = useContext(HoverContext);
	assert(value != null, "missing hover provider");
	return value;
}
