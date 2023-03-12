import type { Entity } from '@intavia/api-client';
import { cn } from '@intavia/ui';
import { useMemo } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { createKey } from '@/lib/create-key';
import { getTranslatedLabel } from '@/lib/get-translated-label';
import { isNotNullable } from '@/lib/is-not-nullable';
import { useEvents } from '@/lib/use-events';
import { useRelationRoles } from '@/lib/use-relation-roles';

interface RelationsProps {
  relations: Entity['relations'];
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

  const eventsAsc = useMemo(() => {
    const now = Date.now();
    const eventsArr = Array.from(events.data.values());
    return eventsArr.sort((eventA: Event, eventB: Event) => {
      const sortDateA =
        'startDate' in eventA
          ? new Date(eventA.startDate as string)
          : 'endDate' in eventA
          ? new Date(eventA.endDate as string)
          : now;
      const sortDateB =
        'startDate' in eventB
          ? new Date(eventB.startDate as string)
          : 'endDate' in eventB
          ? new Date(eventB.endDate as string)
          : now;
      return sortDateA - sortDateB;
    });
  }, [events]);

  if (relations == null || relations.length === 0) return null;

  if (roles.status === 'error' || events.status === 'error') {
    return <p>Failed to fetch relations.</p>;
  }

  // FIXME: Currently, this loading message is displayed forever, since the backend does not know
  // how to resolve all role ids, but returns 200 OK even if not all requested ids were resolved.

  // roles.status !== 'success' || (temporarily removed from if statement because of aforementioned bug)
  if (events.status !== 'success') {
    return <p>Loading relations...</p>;
  }

  return (
    <div className="grid gap-1">
      <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-700">Relations</h2>
      <ul role="list">
        {eventsAsc.map((event, index) => {
          const relation = relations.filter((relation) => {
            return relation.event === event.id;
          });
          const key = createKey(relation[0].event, relation[0].role);
          // FIXME: temporary workaround
          const role = roles.data ? roles.data.get(relation[0].role) : null;
          // const event = events.data.get(relation[0].event);

          return (
            <li key={key} className={cn('px-1', index % 2 && 'bg-neutral-100')}>
              <span className="flex items-center justify-between gap-2">
                <span>
                  {getTranslatedLabel(event.label)} ({getTranslatedLabel(role?.label)})
                </span>
                <span className="text-right">
                  <EventDate start={event.startDate} end={event.endDate} />
                </span>
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
