import "~/node_modules/react-grid-layout/css/styles.css";
import "~/node_modules/react-resizable/css/styles.css";

import type { Place } from "@intavia/api-client";

import { SlideContentTypes } from "@/features/storycreator/contentPane.slice";
import { DroppableIcon } from "@/features/storycreator/DroppableIcon";

interface DropProps {
	name?: string | null;
	title?: string | null;
	label?: string | null;
	type: string;
	place?: Place | null;
	date?: IsoDateString;
}

export function VisualizationDragger(): JSX.Element {
	const createDrops = (props: DropProps) => {
		const { type } = props;

		const content = [<DroppableIcon key={`${type}Icon`} type={type} />];
		let text = "";
		let subline = "";
		let key = `${type}Drop`;
		switch (type) {
			case "Person":
				if (props.name != null) {
					text = props.name;
				}
				key = key + props.name;
				break;
			case "Event":
				if (props.label != null) {
					text = props.label;
				} else {
					text = type;
				}

				key = key + JSON.stringify(props);
				if (props.place != null) {
					subline = `in ${props.place.name}`;
				}
				if (props.date !== undefined && props.date !== "") {
					subline += ` in ${props.date.substring(0, 4)}`;
				}
				break;
			default:
				text = type;
				break;
		}

		content.push(
			<div
				key="imageLabel"
				style={{
					verticalAlign: "middle",
					paddingLeft: "10px",
					display: "table-cell",
				}}
			>
				{text}
				<br />
				{subline}
			</div>,
		);

		return (
			<div
				key={key}
				className="droppable-element mb-1 w-full cursor-pointer rounded-md border-2 border-intavia-blue-500 p-2"
				draggable={true}
				unselectable="on"
				onDragStart={(e) => {
					return e.dataTransfer.setData(
						"Text",
						JSON.stringify({
							type: type,
							props: props,
							content: "",
						}),
					);
				}}
				/*  style={{
          border: 'solid 1px black',
          padding: padding,
          marginBottom: 10,
          cursor: 'pointer',
          display: 'table',
          width: '100%',
        }} */
			>
				<div style={{ display: "table-row", width: "100%" }}>{content}</div>
			</div>
		);
	};

	return (
		<div className="grid w-full p-2">
			{SlideContentTypes.map((type) => {
				return createDrops({ type });
			})}
		</div>
	);
}
