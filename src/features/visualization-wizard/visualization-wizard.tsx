import { nanoid } from "@reduxjs/toolkit";
import { useState } from "react";
import { isConstructorDeclaration } from "typescript";

import { useAppDispatch, useAppSelector } from "@/app/store";
import type { Visualization } from "@/features/common/visualization.slice";
import {
	createVisualization,
	selectAllVisualizations,
} from "@/features/common/visualization.slice";
import { Button } from "@intavia/ui";
import type { SlotId } from "@/features/visualization-layouts/workspaces.slice";
import { setVisualizationForVisualizationSlotForCurrentWorkspace } from "@/features/visualization-layouts/workspaces.slice";
import { VisualizationSelect } from "@/features/visualization-wizard/visualization-select";

interface VisualizationWizardProps {
	visualizationSlot: SlotId;
	onAddVisualization: (visualizationSlot: string, visId: string) => void;
}
export default function VisualizationWizard(props: VisualizationWizardProps): JSX.Element {
	const { visualizationSlot, onAddVisualization } = props;
	const dispatch = useAppDispatch();
	const [selectedVisualizationId, setSelectedVisualizationId] = useState<
		Visualization["id"] | null
	>(null);
	const visualizations = useAppSelector(selectAllVisualizations);

	function createVis(type: Visualization["type"]) {
		const visId = `visualization-${nanoid(4)}`;

		dispatch(
			createVisualization({
				id: visId,
				type: type,
				name: visId,
				entityIds: [],
				eventIds: [],
			}),
		);

		return visId;
	}

	function onButtonClick(type: Visualization["type"]) {
		const visId = createVis(type);
		onAddVisualization(visualizationSlot, visId);
	}

	function onLoadVisualization() {
		// console.log('load', selectedVisualizationId, 'into', visualizationSlot);
		onAddVisualization(visualizationSlot, selectedVisualizationId);
	}

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-5 p-5">
			<div className="grid grid-cols-2 gap-2">
				<Button
					round="round"
					color="accent"
					onClick={() => {
						onButtonClick("map");
					}}
				>
					Create Map Visualization
				</Button>
				<Button
					round="round"
					color="accent"
					onClick={() => {
						onButtonClick("timeline");
					}}
				>
					Create Timeline Visualization
				</Button>
				<Button
					round="round"
					color="accent"
					onClick={() => {
						onButtonClick("ego-network");
					}}
				>
					Create Network Visualization
				</Button>
			</div>
			{Object.keys(visualizations).length > 0 && (
				<div className="grid grid-cols-2 gap-2">
					<VisualizationSelect
						options={visualizations}
						setSelectedVisualizationId={setSelectedVisualizationId}
						selectedVisualizationId={selectedVisualizationId}
					/>
					<Button size="extra-small" round="round" color="primary" onClick={onLoadVisualization}>
						Add Visualization
					</Button>
				</div>
			)}
		</div>
	);
}
