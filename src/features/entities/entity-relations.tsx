import type { Entity } from "@intavia/api-client";

import { useI18n } from "@/app/i18n/use-i18n";
import { createKey } from "@/lib/create-key";
import { isNotNullable } from "@/lib/is-not-nullable";
import { useEvents } from "@/lib/use-events";
import { useRelationRoles } from "@/lib/use-relation-roles";

interface RelationsProps {
	relations: Entity["relations"];
}

export function EntityRelations(props: RelationsProps): JSX.Element | null {
	const { relations } = props;

	const roles = useRelationRoles(
		relations.map((relation) => {
			return relation.role;
		}),
	);

	const events = useEvents(
		relations.map((relation) => {
			return relation.event;
		}),
	);

	if (relations == null || relations.length === 0) return null;

	if (roles.status === "error" || events.status === "error") {
		return <p>Failed to fetch relations.</p>;
	}

	if (roles.status !== "success" || events.status !== "success") {
		return <p>Loading relations...</p>;
	}

	return (
		<div className="grid gap-1">
			<h2 className="text-xs font-medium uppercase tracking-wider text-neutral-700">Relations</h2>
			<ul role="list">
				{relations.map((relation) => {
					const key = createKey(relation.event, relation.role);
					const role = roles.data.get(relation.role);
					const event = events.data.get(relation.event);

					return (
						<li key={key}>
							<span className="flex gap-2">
								<span>
									{event?.label.default} ({role?.label.default})
								</span>
								<EventDate start={event?.startDate} end={event?.endDate} />
							</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

interface EventDateProps {
	start: string | undefined;
	end: string | undefined;
}

function EventDate(props: EventDateProps): JSX.Element {
	const { start, end } = props;

	const { formatDateTime } = useI18n();

	const dates = [start, end].filter(isNotNullable).map((date) => {
		return formatDateTime(new Date(date));
	}) as [string, string] | [string];

	if (dates.length === 2) {
		const [startDate, endDate] = dates;

		return (
			<span>
				<time dateTime={start}>{startDate}</time>
				&mdash;
				<time dateTime={end}>{endDate}</time>
			</span>
		);
	}

	const [date] = dates;

	return <time dateTime={start ?? end}>{date}</time>;
}
