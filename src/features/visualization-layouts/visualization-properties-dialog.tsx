/* eslint-disable prefer-const */
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { Disclosure, Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpIcon, SelectorIcon, TrashIcon } from '@heroicons/react/solid';
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl } from '@mui/material';
import { Fragment, useState } from 'react';

import { useAppSelector } from '@/app/store';
import { selectEntitiesByID } from '@/features/common/entities.slice';
import type { EntityEvent } from '@/features/common/entity.model';
import { eventTypes } from '@/features/common/event-types';
import type { Visualization, VisualizationProperty } from '@/features/common/visualization.slice';
import Button from '@/features/ui/Button';
import { formatDate } from '@/lib/format-date';

interface VisualizationPropertiesDialogProps {
  element: Visualization;
  onClose: () => void;
  onSave: (element: Visualization) => void;
}

export function VisualizationPropertiesDialog(
  props: VisualizationPropertiesDialogProps,
): JSX.Element {
  const { element, onClose, onSave } = props;

  const [tmpProperties, setTmpProperties] = useState({ ...element.properties });
  const [tmpElement, setTmpElement] = useState({
    ...element,
    visibilities: element.visibilities !== undefined ? element.visibilities : {},
  });

  const onChange = (event: any) => {
    const newVal = { ...tmpProperties[event.target.id], value: event.target.value };
    setTmpProperties({ ...tmpProperties, [event.target.id]: newVal });
  };

  let editableAttributes = [];

  editableAttributes = Object.values(tmpProperties as object)
    .filter((prop: VisualizationProperty) => {
      return prop.editable;
    })
    .sort((a: VisualizationProperty, b: VisualizationProperty) => {
      return a.sort - b.sort;
    });

  const entitiesByID = useAppSelector(selectEntitiesByID);

  return (
    <Dialog open={true} onClose={onClose} className={'overflow-visible overflow-y-visible'}>
      <DialogTitle>{`Edit ${element.type}`}</DialogTitle>
      {editableAttributes.length > 0 ? (
        <DialogContent className={'overflow-visible'}>
          <div className="grid h-auto w-auto grid-cols-[auto,auto] gap-4">
            {editableAttributes.map((property: VisualizationProperty) => {
              switch (property.type) {
                case 'select':
                  return (
                    <>
                      <div>{property.label}</div>
                      <Listbox
                        value={property.value}
                        onChange={(val: any) => {
                          let newProps = {
                            ...tmpProperties,
                          };

                          newProps[property.id] = { ...property, value: val };
                          setTmpProperties(newProps);
                        }}
                      >
                        <div className="relative mt-1">
                          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                            <span className="block truncate">{property.value.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {property.options?.map((option, optionIdx) => {
                                return (
                                  <Listbox.Option
                                    key={optionIdx}
                                    className={({ active }) => {
                                      return `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                      }`;
                                    }}
                                    value={option}
                                  >
                                    {() => {
                                      return (
                                        <>
                                          <span
                                            className={`block truncate ${
                                              property.value !== null
                                                ? 'font-medium'
                                                : 'font-normal'
                                            }`}
                                          >
                                            {option.name}
                                          </span>
                                          {property.value.value === option.value ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                          ) : null}
                                        </>
                                      );
                                    }}
                                  </Listbox.Option>
                                );
                              })}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </>
                  );
                case 'entitiesAndEvents':
                  return (
                    <>
                      {tmpElement.entityIds.length > 0 && (
                        <>
                          <div>{property.label}</div>
                          <div className="grid auto-rows-min grid-cols-[auto,auto,auto] gap-2">
                            {tmpElement.entityIds.map((e) => {
                              const entity = entitiesByID[e];
                              const entityEvents = entity?.history || [];
                              const newVisibilities = { ...tmpElement.visibilities };

                              if (newVisibilities[e] === undefined) {
                                newVisibilities[e] = true;
                                for (const event of entityEvents) {
                                  newVisibilities[event.id] = true;
                                }
                                tmpElement.visibilities = newVisibilities;
                              } else {
                                newVisibilities[e] =
                                  entityEvents.filter((event) => {
                                    return newVisibilities[event.id] === true;
                                  }).length > 0;
                              }

                              return (
                                <>
                                  <div className="flex h-7 items-center">
                                    <input
                                      id={`default-checkbox-${e}`}
                                      type="checkbox"
                                      checked={newVisibilities[e]}
                                      value={newVisibilities[e]}
                                      onChange={() => {
                                        newVisibilities[e] = !(newVisibilities[e] as boolean);

                                        for (const event of entityEvents) {
                                          newVisibilities[event.id] = newVisibilities[e] as boolean;
                                        }

                                        setTmpElement({
                                          ...tmpElement,
                                          visibilities: newVisibilities,
                                        });
                                      }}
                                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                                    />
                                  </div>
                                  <div className="w-full max-w-md rounded-2xl bg-white">
                                    <Disclosure>
                                      {({ open }) => {
                                        return (
                                          <>
                                            <Disclosure.Button className="flex h-7 w-full justify-between rounded-lg bg-blue-100 p-1 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                                              <span>{entity?.name}</span>
                                              <ChevronUpIcon
                                                className={`${
                                                  open ? '' : 'rotate-180 transform'
                                                } h-5 w-5 text-blue-500`}
                                              />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="rounded-lg bg-blue-50 p-2 text-sm text-blue-900">
                                              {entityEvents.map((event: EntityEvent) => {
                                                newVisibilities[event.id] !== undefined
                                                  ? newVisibilities[event.id]
                                                  : true;

                                                const eventVisible = newVisibilities[event.id];

                                                return (
                                                  <div
                                                    key={event.id}
                                                    className="grid grid-cols-[25px,1fr] items-center"
                                                  >
                                                    <input
                                                      id={`${event.id}-checkbox`}
                                                      type="checkbox"
                                                      checked={eventVisible}
                                                      value={''}
                                                      onChange={() => {
                                                        newVisibilities[event.id] =
                                                          !(eventVisible as boolean);

                                                        if (
                                                          newVisibilities[event.id] === true &&
                                                          newVisibilities[e] === false
                                                        ) {
                                                          newVisibilities[e] = true;
                                                        }

                                                        setTmpElement({
                                                          ...tmpElement,
                                                          visibilities: newVisibilities,
                                                        });
                                                      }}
                                                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                                                    />
                                                    <div className="table">
                                                      <div className="table-cell w-1/3 font-semibold">
                                                        {eventTypes[event.type].label}
                                                      </div>
                                                      <div className="table-cell">
                                                        {event.date != null ? (
                                                          <span>
                                                            {formatDate(new Date(event.date))}
                                                          </span>
                                                        ) : null}{' '}
                                                        {event.place != null ? (
                                                          <span>in {event.place.name}</span>
                                                        ) : null}
                                                      </div>
                                                    </div>
                                                  </div>
                                                );
                                              })}
                                            </Disclosure.Panel>
                                          </>
                                        );
                                      }}
                                    </Disclosure>
                                  </div>
                                  <div className="flex h-7 items-center">
                                    <Button
                                      onClick={() => {
                                        const newEntityIds = tmpElement.entityIds.filter((id) => {
                                          return id !== e;
                                        });
                                        const newVis = { ...newVisibilities };
                                        delete newVis[e];
                                        for (const event of entityEvents) {
                                          delete newVis[event.id];
                                        }
                                        setTmpElement({
                                          ...tmpElement,
                                          entityIds: newEntityIds,
                                          visibilities: newVis,
                                        });
                                      }}
                                      size="extra-small"
                                      round="circle"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        </>
                      )}
                      {element.eventIds.length > 0 && (
                        <>
                          <div>Events</div>
                          <div>
                            {element.eventIds.map((e) => {
                              return <div key={e}>{e}</div>;
                            })}
                          </div>
                        </>
                      )}
                    </>
                  );
              }
            })}
          </div>
        </DialogContent>
      ) : (
        'Please add properties to the element to edit them!'
      )}
      <DialogActions>
        <Button size="small" round="round" shadow="small" color="warning" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="small"
          round="round"
          shadow="small"
          color="accent"
          type="submit"
          form="myform"
          onClick={(event) => {
            event.preventDefault();
            const newElement = { ...tmpElement, properties: tmpProperties };
            onSave(newElement as Visualization);
            onClose();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
