import type { Entity } from "@intavia/api-client";

interface EntityLinkedIdsProps {
	links: Entity["linkedIds"];
}

export function EntityLinkedIds(props: EntityLinkedIdsProps): JSX.Element | null {
	const { links } = props;

	if (links == null || links.length === 0) return null;

	return (
		<div className="grid gap-1">
			<h2 className="text-xs font-medium uppercase tracking-wider text-neutral-700">Linked ids</h2>
			<ul role="list">
				{links.map((link) => {
					const url = String(new URL(link.id, link.provider?.baseUrl));

					return (
						<li key={link.id}>
							<a href={url}>{link.provider?.label ?? url}</a>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
