import { AdjustmentsVerticalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { Entity, Event } from "@intavia/api-client";
import type { DragEvent } from "react";

import { useAppDispatch, useAppSelector } from "@/app/store";
import type { DataTransferData } from "@/features/common/data-transfer.types";
import { type as mediaType } from "@/features/common/data-transfer.types";
import type { Visualization } from "@/features/common/visualization.slice";
import {
	addEntitiesToVisualization,
	addEventsToVisualization,
	addTargetEntitiesToVisualization,
	selectAllVisualizations,
} from "@/features/common/visualization.slice";
import Button from "@/features/ui/Button";
import VisualisationComponent from "@/features/visualization-layouts/visualization";
import type { SlotId } from "@/features/visualization-layouts/workspaces.slice";
import {
	selectAllWorkspaces,
	switchVisualizationsInWorkspace,
} from "@/features/visualization-layouts/workspaces.slice";

interface VisualisationContainerProps {
	visualizationSlot: SlotId;
	highlighted: Record<
		Visualization["id"],
		{ entities: Array<Entity["id"]>; events: Array<Event["id"]> }
	>;

	id: Visualization["id"] | null;
	onReleaseVisualization: (visSlot: string, visId: string) => void;
	onSwitchVisualization: (
		targetSlot: string,
		targetVis: string | null,
		soruceSlot: string,
		sourceVis: string | null,
	) => void;
	setVisualizationEditElement?: (editElement: Visualization) => void;
	onToggleHighlight?: (
		entities: Array<Entity["id"] | null>,
		events: Array<Event["id"] | null>,
		visId: string,
	) => void;
}

export default function VisualisationContainer(props: VisualisationContainerProps): JSX.Element {
	const {
		visualizationSlot,
		highlighted,
		id,
		onReleaseVisualization,
		onSwitchVisualization,
		setVisualizationEditElement,
		onToggleHighlight,
	} = props;

	const dispatch = useAppDispatch();

	const workspaces = useAppSelector(selectAllWorkspaces);

	const allVisualizations = useAppSelector(selectAllVisualizations);

	const visualization = Object.values(allVisualizations).filter((vis: Visualization) => {
		return vis.id === id;
	})[0];

	let name = id;

	if (visualization !== undefined) {
		name = visualization.name;
		if (visualization.properties !== undefined) {
			if (
				visualization.properties.name !== undefined &&
				visualization.properties.name.value !== ""
			) {
				name = visualization.properties.name.value;
			}
		}
	}

	function onDragOver(event: DragEvent<HTMLDivElement>) {
		if (event.dataTransfer.types.includes(mediaType)) {
			/** Allow drop events. */
			event.preventDefault();
		}
	}

	// function onDrop(event: DragEvent) {
	//   event.preventDefault();
	//   const data = JSON.parse(event.dataTransfer.getData('Text'));

	//   switch (data.type) {
	//     case 'visualization':
	//       onSwitchVisualization(visualizationSlot, data.props.id, data.parent, id);
	//       break;
	//     case 'Person':
	//       dispatch(
	//         addPersonToVisualization({ visId: visualization!.id, person: data.props as Person }),
	//       );
	//       break;
	//     case 'Event':
	//       dispatch(addEventToVisualization({ visId: visualization!.id, event: data.props as Event }));
	//       break;
	//     default:
	//       break;
	//   }
	// }

	function onDrop(event: DragEvent<HTMLDivElement>) {
		const data = event.dataTransfer.getData(mediaType);
		// console.log(event);

		try {
			const payload: DataTransferData = JSON.parse(data);

			switch (payload.type) {
				// case 'content': {
				//   break;
				// }
				// case 'content-item': {
				//   break;
				// }
				case "data": {
					const { entities, events, targetEntities } = payload;
					// console.log({ entities, events });
					dispatch(addEntitiesToVisualization({ visId: visualization!.id, entities }));
					dispatch(addEventsToVisualization({ visId: visualization!.id, events }));
					dispatch(addTargetEntitiesToVisualization({ visId: visualization!.id, targetEntities }));
					// dispatch(addEntitiesToVisualisation({ entities, id: content.id }));
					// dispatch(addEventsToVisualisation({ events, id: content.id }));
					break;
				}
				case "visualization": {
					// onSwitchVisualization(visualizationSlot, data.props.id, data.parent, id);
					const { sourceSlot, sourceVis } = payload;
					// console.log(visualizationSlot, visualization!.id, sourceSlot, sourceVis);
					dispatch(
						switchVisualizationsInWorkspace({
							targetSlot: visualizationSlot,
							targetVis: sourceVis,
							sourceSlot,
							sourceVis: visualization!.id,
							workspace: workspaces.currentWorkspace,
						}),
					);
					break;
				}
				// case 'layout': {
				//   const { source } = payload;
				//   dispatch(switchWorkspaceContent({ id, items: [source, item] }));
				//   break;
				// }
			}
		} catch {
			/** Ignore invalid json. */
		}

		event.preventDefault();
	}

	return (
		<div
			className="grid h-full w-full grid-cols-[100%] grid-rows-[29px_1fr]"
			onDragOver={onDragOver}
			onDrop={onDrop}
		>
			<div
				className="flex cursor-grabbing flex-row flex-nowrap justify-between gap-2 truncate bg-intavia-blue-400 px-2 py-1 text-white"
				draggable={true}
				onDragStart={(event) => {
					const data: DataTransferData = {
						type: "visualization",
						sourceSlot: visualizationSlot,
						sourceVis: visualization.id,
					};
					event.dataTransfer.setData(mediaType, JSON.stringify(data));
					// return event.dataTransfer.setData(
					//   'Text',
					//   JSON.stringify({
					//     type: 'visualization',
					//     props: visualization,
					//     parent: visualizationSlot,
					//     content: '',
					//   }),
					// );
				}}
			>
				<div className="truncate">{name}</div>
				<div className="sticky right-0 flex flex-nowrap gap-1">
					<Button
						className="ml-auto grow-0"
						shadow="none"
						size="extra-small"
						round="circle"
						onClick={() => {
							if (setVisualizationEditElement !== undefined) {
								setVisualizationEditElement(visualization as Visualization);
							}
						}}
					>
						<AdjustmentsVerticalIcon className="h-3 w-3" />
					</Button>
					<Button
						className="ml-auto grow-0"
						shadow="none"
						size="extra-small"
						round="circle"
						onClick={() => {
							if (id !== null) {
								onReleaseVisualization(visualizationSlot, id);
							}
						}}
					>
						<XMarkIcon className="h-3 w-3" />
					</Button>
				</div>
			</div>
			{visualization !== undefined && (
				<div className="w-50 relative h-full">
					{
						<VisualisationComponent
							visualization={visualization}
							highlightedByVis={
								highlighted != null && visualization.id in highlighted
									? highlighted[visualization.id]
									: { events: [], entities: [] }
							}
							onToggleHighlight={(
								entities: Array<Entity["id"] | null>,
								events: Array<Event["id"] | null>,
							) => {
								onToggleHighlight(entities, events, visualization.id);
							}}
						/>
					}
				</div>
			)}
		</div>
	);
}
