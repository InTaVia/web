import { Disclosure } from '@headlessui/react';
import { LocationMarkerIcon, UserCircleIcon } from '@heroicons/react/solid';
import type { Entity, EntityEventRelation, Event } from '@intavia/api-client';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppSelector } from '@/app/store';
import { selectEvents, selectVocabularyEntries } from '@/app/store/intavia.slice';
import { getTranslatedLabel } from '@/lib/get-translated-label';

export interface CollectionPanelEntryProps {
  entity: Entity;
  draggable?: boolean;
  mini?: boolean;
  isEventsLoading?: boolean;
}

export default function CollectionPanelEntry(props: CollectionPanelEntryProps): JSX.Element {
  const { draggable = false, mini = false, isEventsLoading = false } = props;
  const vocabularyEntriesById = useAppSelector(selectVocabularyEntries);
  const allEvents = useAppSelector(selectEvents);
  const isPerson = props.entity.kind === 'person';
  // const isPerson = parseInt(props.entity.id) % 2 === 0;
  const [fgColor, bgColor, symbol] = isPerson
    ? // eslint-disable-next-line react/jsx-key
      ['text-pink-900', 'bg-pink-100', <UserCircleIcon />]
    : // eslint-disable-next-line react/jsx-key
      ['text-blue-900', 'bg-blue-100', <LocationMarkerIcon />];

  const entityRelations = props.entity.relations !== undefined ? props.entity.relations : [];

  return (
    <div className={`my-1 mx-1 w-full rounded border-2 border-current p-2 ${fgColor} ${bgColor}`}>
      <Disclosure>
        {({ open }) => {
          let content = '';
          switch (props.entity.kind) {
            case 'person': {
              const gender = props.entity.gender;
              content = gender ? getTranslatedLabel(gender.label) : '';
              break;
            }
            case 'place': {
              const geometry = props.entity.geometry;
              const point = geometry?.type === 'Point' ? geometry : null;
              content = `${point?.coordinates[1]} ${point?.coordinates[0]}`;
              break;
            }
            default:
              break;
          }

          return (
            <Fragment>
              <Disclosure.Button className={`display-block w-full ${mini ? '' : 'py-2'}`}>
                <div
                  draggable={draggable}
                  onDragStart={(event) => {
                    // FIXME:
                    return event.dataTransfer.setData(
                      'Text',
                      JSON.stringify({
                        type: 'Person',
                        props: props.entity,
                        content: '',
                      }),
                    );
                  }}
                >
                  <div
                    className={`{mb-3 grid ${
                      mini
                        ? 'grid-cols-[2em_auto_auto] grid-rows-2'
                        : 'grid-cols-[3.6rem_1fr_minmax(20px,max-content)] grid-rows-3'
                    }`}
                  >
                    <div className={`col-start-1 row-span-3 row-start-1 ${fgColor}`}>{symbol}</div>
                    <h2
                      className={`col-start-2 ${
                        mini ? 'row-span-2' : 'row-span-3'
                      } row-start-1 my-1 ${
                        mini ? 'text-sm' : 'text-lg'
                      } place-self-center font-semibold`}
                    >
                      {getTranslatedLabel(props.entity.label)}
                    </h2>
                    <span className="font-verythin col-start-3 row-start-1 max-w-[20ch] justify-self-end overflow-hidden text-ellipsis whitespace-nowrap text-[0.65rem]">
                      {content}
                    </span>
                    <span className="font-verythin col-start-3 row-start-2 max-w-[20ch] justify-self-end overflow-hidden text-ellipsis whitespace-nowrap text-[0.65rem]">
                      {props.entity.kind === 'person'
                        ? props.entity.occupations
                            ?.map((occupation) => {
                              return getTranslatedLabel(occupation.label);
                            })
                            .join(', ')
                        : ''}
                    </span>
                  </div>

                  {(!mini || open) && (
                    <div className={`${open ? '' : `contrast-[.2] line-clamp-2`} text-justify`}>
                      <p>{props.entity.description}</p>
                    </div>
                  )}
                </div>
              </Disclosure.Button>
              <Disclosure.Panel>
                {props.entity.kind === 'person' ? (
                  <Fragment>
                    <h3 className="text-lg font-semibold">Events</h3>
                    {isEventsLoading && <div>Loading ...</div>}
                    <div className="grid gap-1.5 text-sm">
                      {[
                        ...new Set(
                          entityRelations
                            .filter((relation: EntityEventRelation) => {
                              return allEvents[relation.event] !== undefined;
                            })
                            .map((relation: EntityEventRelation) => {
                              return relation.event;
                            }),
                        ),
                      ].map((eventId: string) => {
                        const event = allEvents[eventId] as Event;

                        // FIXME:
                        function onDragStart(dragEvent: any) {
                          return dragEvent.dataTransfer.setData(
                            'Text',
                            JSON.stringify({
                              type: 'Event',
                              props: event,
                              content: '',
                            }),
                          );
                        }

                        return (
                          <div key={event.id} draggable={draggable} onDragStart={onDragStart}>
                            <h4>{getTranslatedLabel(event.label)}</h4>
                            <EventDateRange start={event.startDate} end={event.endDate} />
                            {event.place != null && event.place.label != null ? (
                              <div className="flex gap-1">
                                <LocationMarkerIcon width="1em" />
                                {getTranslatedLabel(event.place.label)}{' '}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </Fragment>
                ) : null}
              </Disclosure.Panel>
            </Fragment>
          );
        }}
      </Disclosure>
    </div>
  );
}

interface EventDateRangeProps {
  start: Event['startDate'];
  end: Event['endDate'];
}

function EventDateRange(props: EventDateRangeProps): JSX.Element | null {
  const { start, end } = props;

  const { formatDateTime } = useI18n<'common'>();

  if (start == null && end == null) return null;

  if (end == null && start != null) {
    return (
      <span>
        (<time dateTime={start}>{formatDateTime(new Date(start))}</time>)
      </span>
    );
  }

  if (start == null && end != null) {
    return (
      <span>
        (<time dateTime={end}>{formatDateTime(new Date(end))}</time>)
      </span>
    );
  }

  return (
    <span>
      (<time dateTime={start}>{formatDateTime(new Date(start!))}</time> &ndash;{' '}
      <time dateTime={end}>{formatDateTime(new Date(end!))}</time>)
    </span>
  );
}
