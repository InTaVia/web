import type { Entity, Event } from '@intavia/api-client';
import { cn } from '@intavia/ui';
import type { MouseEvent } from 'react';
import { useMemo } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { useI18n } from '@/app/i18n/use-i18n';
import { IntaviaIcon } from '@/features/common/icons/intavia-icon';
import { getEventKindPropertiesById } from '@/features/common/visualization.config';
import { createKey } from '@/lib/create-key';
import { getTranslatedLabel } from '@/lib/get-translated-label';
import { isNotNullable } from '@/lib/is-not-nullable';
import { unique } from '@/lib/unique';
import { useEventKinds } from '@/lib/use-event-kinds';
import { useEvents } from '@/lib/use-events';
import { useRelationRoles } from '@/lib/use-relation-roles';

interface RelationsProps {
  relations: Entity['relations'];
}

export function EntityRelations(props: RelationsProps): JSX.Element | null {
  const { relations } = props;

  const { hovered, updateHover } = useHoverState();

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

  const eventKinds = useEventKinds(
    unique(
      Array.from(events.data!.values(), (event) => {
        return event.kind;
      }),
    ),
  );

  const eventsAsc = useMemo(() => {
    const now = Date.now();
    const eventsArr = Array.from(events.data.values());
    return eventsArr.sort((eventA: Event, eventB: Event) => {
      const sortDateA =
        'startDate' in eventA
          ? new Date(eventA.startDate as string).getTime()
          : 'endDate' in eventA
          ? new Date(eventA.endDate as string).getTime()
          : now;
      const sortDateB =
        'startDate' in eventB
          ? new Date(eventB.startDate as string).getTime()
          : 'endDate' in eventB
          ? new Date(eventB.endDate as string).getTime()
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
      <h2 className="pb-1 font-bold uppercase text-neutral-700">Relations</h2>
      <table role="table">
        <tbody>
          {eventsAsc.map((event, index) => {
            const relation = relations.filter((relation) => {
              return relation.event === event.id;
            });

            const isHovered = hovered?.events.includes(event.id) ?? false;

            const key = createKey(relation[0].event, relation[0].role);
            // FIXME: temporary workaround
            const role = roles.data ? roles.data.get(relation[0].role) : null;
            // const event = events.data.get(relation[0].event);

            const eventKind = eventKinds.data ? eventKinds.data.get(event.kind) : null;

            const eventKindProperties = getEventKindPropertiesById(event.kind);

            return (
              <tr
                key={key}
                className={cn('px-1', index % 2 && 'bg-neutral-100', isHovered && 'bg-neutral-200')}
                onMouseEnter={(e: MouseEvent<HTMLTableRowElement>) => {
                  updateHover({
                    entities: event.relations.map((relation) => {
                      return relation.entity;
                    }),
                    events: [event.id],
                    clientRect: {
                      left: e.clientX,
                      top: e.clientY,
                    } as DOMRect,
                    pageRect: { left: e.pageX, top: e.pageY } as DOMRect,
                  });
                }}
                onMouseLeave={() => {
                  updateHover(null);
                }}
              >
                {/* <span className="flex items-start gap-2 pt-1"> */}
                <td className="whitespace-nowrap p-2 text-right align-top text-xs">
                  <EventDate start={event.startDate} end={event.endDate} />
                </td>
                <td className=" py-2 align-top">
                  <IntaviaIcon
                    icon={eventKindProperties.icon}
                    className={cn(
                      'h-4 w-4',
                      'fill-none stroke-black',
                      eventKindProperties.iconStyle,
                    )}
                  />
                </td>
                <td className="flex flex-col gap-y-0 p-2">
                  <span className="text-xs text-slate-400">
                    {/* {getTranslatedLabel(eventKind?.label)} */}
                    {eventKindProperties.label}
                    &nbsp;|&nbsp;
                    {getTranslatedLabel(role?.label)}
                  </span>
                  <span className="text-left">{getTranslatedLabel(event.label)}</span>
                </td>
                {/* </span> */}
              </tr>
            );
          })}
        </tbody>
      </table>
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
    // return formatDateTime(new Date(date), 'de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formatter = new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedDate = formatter.format(new Date(date));
    return formattedDate;
  }) as [string, string] | [string];

  if (dates.length === 2) {
    const [startDate, endDate] = dates;

    //FIXME: all the comparissions probably should be based on Dates and not strings!?
    if (startDate === endDate) {
      return <time dateTime={start}>{startDate}</time>;
    }

    if (startDate.startsWith('01.01.') && endDate.startsWith('31.12.')) {
      if (startDate.substring(6) === endDate.substring(6)) {
        return <time dateTime={start}>{startDate.substring(6)}</time>;
      }

      return (
        <span>
          <time dateTime={start}>{startDate.substring(6)}</time>
          &nbsp;&ndash;&nbsp;
          <time dateTime={end}>{endDate.substring(6)}</time>
        </span>
      );
    }

    return (
      <span>
        <time dateTime={start}>{startDate}</time>
        &nbsp;&ndash;&nbsp;
        <time dateTime={end}>{endDate}</time>
      </span>
    );
  }

  const [date] = dates;

  return <time dateTime={start ?? end}>{date}</time>;
}
