import type { Event } from "@intavia/api-client";
import { useContext, useState } from "react";

import { PageContext } from "@/app/context/page.context";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { selectVocabularyEntries } from "@/app/store/intavia.slice";
import { addEventsToVisualization } from "@/features/common/visualization.slice";
import { DataList } from "@/features/data-panel/data-list";
import { EntityItem } from "@/features/data-panel/entity-item";
import { EventItem } from "@/features/data-panel/event-item";
import { GroupItem } from "@/features/data-panel/group-item";
import {
	selectSlide,
	selectSlidesByStoryID,
	selectStories,
} from "@/features/storycreator/storycreator.slice";
import Button from "@/features/ui/Button";
import { selectAllWorkspaces } from "@/features/visualization-layouts/workspaces.slice";
import { getTranslatedLabel } from "@/lib/get-translated-label";

interface EventsPanelProps {
	events: Array<Event>;
}

export function EventsPanel(props: EventsPanelProps): JSX.Element {
	const { events } = props;

	const [isGroupedByEventKind, setIsGroupedByEventKind] = useState<boolean>(false);

	const pageContext = useContext(PageContext);

	const dispatch = useAppDispatch();
	const workspaces = useAppSelector(selectAllWorkspaces);
	const currentWorkspace = workspaces.workspaces[workspaces.currentWorkspace];

	const stories = useAppSelector(selectStories);
	const currentSlide =
		pageContext.page === "story-creator"
			? Object.values(stories[pageContext.storyId]?.slides).filter((slide) => {
					return slide.selected;
			  })[0]
			: null;

	const vocabularies = useAppSelector(selectVocabularyEntries);

	const toggleGrouping = () => {
		setIsGroupedByEventKind(!isGroupedByEventKind);
	};

	function viewAllData() {
		let currentVisualizationIds = null;
		switch (pageContext.page) {
			case "visual-analytics-studio":
				currentVisualizationIds = Object.values(currentWorkspace!.visualizationSlots);
				break;
			case "story-creator":
				currentVisualizationIds = Object.values(currentSlide!.visualizationSlots);
				break;
			default:
				return;
		}
		if (currentVisualizationIds == null || currentVisualizationIds.length === 0) return;

		// console.log(currentVisualizationIds);
		for (const visualizationId of currentVisualizationIds) {
			if (visualizationId != null) {
				dispatch(
					addEventsToVisualization({
						visId: visualizationId,
						events: events.map((event) => {
							return event.id;
						}),
					}),
				);
			}
		}
	}

	return (
		<div className="flex h-full flex-col overflow-auto">
			{/* <EventPanelTasks /> */}
			<div className="flex min-h-fit flex-col items-start bg-slate-200 p-2">
				<Button size="small" color="accent" round="pill" onClick={viewAllData}>
					Add All
				</Button>
				<div className="flex flex-row gap-x-1">
					<input
						type="checkbox"
						id="groupByEntityKind"
						name="groupByEntityKind"
						value="groupByEntityKind"
						checked={isGroupedByEventKind}
						onChange={toggleGrouping}
					/>
					<label htmlFor="groupByEntityKind">Group events by kind</label>
				</div>
			</div>

			<div className="h-full overflow-auto">
				<DataList items={events} groupedByProperty={isGroupedByEventKind ? "kind" : undefined}>
					{({ item, type }) => {
						switch (type) {
							case "entity":
								return <EntityItem entity={item} />;
							case "event":
								return <EventItem event={item} />;
							case "group":
								return (
									<GroupItem
										group={{
											...item,
											label:
												vocabularies[item.label] !== undefined
													? getTranslatedLabel(vocabularies[item.label]!.label)
													: item.label,
										}}
										showCount={false}
									/>
								);
						}
					}}
				</DataList>
			</div>
		</div>
	);
}
