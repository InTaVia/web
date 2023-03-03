import type { Entity } from "@intavia/api-client";

interface AlternativeLabelsProps {
	labels: Entity["alternativeLabels"];
}

export function EntityAlternativeLabels(props: AlternativeLabelsProps): JSX.Element | null {
	const { labels } = props;

	if (labels == null || labels.length === 0) return null;

	return (
		<div className="grid gap-1">
			<h2 className="text-xs font-medium uppercase tracking-wider text-neutral-700">
				Alternative labels
			</h2>
			<ul role="list">
				{labels.map((label, index) => {
					return <li key={index}>{label.default}</li>;
				})}
			</ul>
		</div>
	);
}
