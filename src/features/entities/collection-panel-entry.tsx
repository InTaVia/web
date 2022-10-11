import { Disclosure } from '@headlessui/react';
import { LocationMarkerIcon, UserCircleIcon } from '@heroicons/react/solid';
import { Fragment } from 'react';

import type { Entity } from '@/api/intavia.models';
import { getTranslatedLabel } from '@/lib/get-translated-label';

export interface CollectionPanelEntryProps {
  entity: Entity;
  draggable?: boolean;
  mini?: boolean;
}

export default function CollectionPanelEntry(props: CollectionPanelEntryProps): JSX.Element {
  const { draggable = false, mini = false } = props;

  const isPerson = props.entity.kind === 'person';
  // const isPerson = parseInt(props.entity.id) % 2 === 0;
  const [fgColor, bgColor, symbol] = isPerson
    ? // eslint-disable-next-line react/jsx-key
      ['text-pink-900', 'bg-pink-100', <UserCircleIcon />]
    : // eslint-disable-next-line react/jsx-key
      ['text-blue-900', 'bg-blue-100', <LocationMarkerIcon />];
  return (
    <div className={`my-1 mx-1 rounded border-2 border-current p-2 ${fgColor} ${bgColor}`}>
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

                    <div className="table">HISTORY</div>
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
