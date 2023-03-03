import type { Event, Person as Entity } from "@intavia/api-client";
import { color as d3color, scaleOrdinal, schemeTableau10 } from "d3";
import { Fragment } from "react";
import { Marker } from "react-map-gl";

import type { EventType } from "@/features/common/event-types";
import { eventTypes as allEventTypes } from "@/features/common/event-types";
import { keys } from "@/lib/keys";

const size = 16;

const eventColors = scaleOrdinal<EventType, string>()
	.domain(keys(allEventTypes))
	.range(schemeTableau10);

interface Pin {
	id: Entity["id"];
	eventType: EventType;
	lat: number;
	lng: number;
}

interface EventyPinLayerProps {
	entities: Array<Entity>;
	eventTypes: Array<EventType>;
	hoveredEntityId?: Entity["id"] | null;
	setHoveredEntityId?: (id: Entity["id"] | null) => void;
}

export function EventyPinLayer(props: EventyPinLayerProps): JSX.Element {
	const { entities, eventTypes, hoveredEntityId, setHoveredEntityId } = props;

	const markers: Array<Pin> = [];

	entities.forEach((entity) => {
		if (entity.history == null) return;

		const events = entity.history.filter((event) => {
			if (eventTypes.includes(event.type)) return true;
			return false;
		});

		markers.push(...createMarkers(entity.id, events));
	});

	function onMouseEnter(entityId: Entity["id"]) {
		setHoveredEntityId?.(entityId);
	}

	function onMouseLeave() {
		setHoveredEntityId?.(null);
	}

	return (
		<Fragment>
			{markers.map((marker, index) => {
				const color = eventColors(marker.eventType);
				const fillColor = d3color(color)?.brighter(2).formatHex();
				const isHovered = marker.id === hoveredEntityId;

				return (
					<Marker
						key={[marker.id, index].join("+")}
						anchor="center"
						latitude={marker.lat}
						longitude={marker.lng}
					>
						<svg
							height={size}
							viewBox="0 0 24 24"
							style={{ cursor: "pointer" }}
							onMouseEnter={() => {
								onMouseEnter(marker.id);
							}}
							onMouseLeave={onMouseLeave}
						>
							{["beginning", "end"].includes(marker.eventType) ? (
								<circle
									cx={12}
									cy={12}
									r={size / 2}
									fill={fillColor}
									stroke={isHovered ? "salmon" : color}
									strokeWidth={isHovered ? 4 : 2}
								/>
							) : (
								<path
									d={`M ${12} ${12 + size / 2} l ${size / 2} ${-size / 2} ${-size / 2} ${
										-size / 2
									} ${-size / 2} ${size / 2} z`}
									fill={fillColor}
									stroke={isHovered ? "salmon" : color}
									strokeWidth={isHovered ? 4 : 2}
								/>
							)}
						</svg>
					</Marker>
				);
			})}
		</Fragment>
	);
}

function createMarkers(id: string, events: Array<Event>): Array<Pin> {
	const markers: Array<Pin> = [];

	events.forEach((event) => {
		if (event.place) {
			markers.push({
				lng: event.place.lng,
				lat: event.place.lat,
				id,
				eventType: event.type,
			});
		}
	});

	return markers;
}
