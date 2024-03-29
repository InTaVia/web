import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { TrashIcon } from '@heroicons/react/solid';
import type { Event } from '@intavia/api-client';
import {
  Button,
  CheckBox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  IconButton,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '@intavia/ui';
import { Fragment, useState } from 'react';

import { useAppSelector } from '@/app/store';
import { selectEntities } from '@/app/store/intavia.slice';
import type { ComponentProperty, QuizAnswer } from '@/features/common/component-property';
import type { Visualization } from '@/features/common/visualization.slice';
import type { AnswerList, SlideContent } from '@/features/storycreator/contentPane.slice';
import { StoryQuizAnswerList } from '@/features/storycreator/StoryQuizAnswerList';
import { getTranslatedLabel } from '@/lib/get-translated-label';

interface ComponentPropertiesDialogProps {
  element: SlideContent | Visualization;
  onClose: () => void;
  onSave: (element: SlideContent | Visualization) => void;
}

export function ComponentPropertiesDialog(props: ComponentPropertiesDialogProps): JSX.Element {
  const { element, onClose, onSave } = props;

  const [tmpProperties, setTmpProperties] = useState({ ...element.properties });
  const [tmpElement, setTmpElement] = useState({
    ...element,
    visibilities: element.visibilities !== undefined ? element.visibilities : {},
  });

  const setAnswerListForQuiz = (answers: Array<QuizAnswer>) => {
    const newVal = { ...tmpProperties.answerlist, answers: answers } as AnswerList;
    setTmpProperties({ ...tmpProperties, answerlist: newVal });
  };

  const onChange = (event: any) => {
    const newVal = { ...tmpProperties[event.target.id], value: event.target.value };
    setTmpProperties({ ...tmpProperties, [event.target.id]: newVal });
  };

  let editableAttributes = [];

  editableAttributes = Object.values(tmpProperties as object)
    .filter((prop: ComponentProperty) => {
      return prop.editable;
    })
    .sort((a: ComponentProperty, b: ComponentProperty) => {
      return (a.sort !== undefined ? a.sort : 0) - (b.sort !== undefined ? b.sort : 0);
    });

  const entitiesByID = useAppSelector(selectEntities);

  let name = tmpElement.name;
  if (tmpElement.properties !== undefined) {
    if (tmpElement.properties.name !== undefined && tmpElement.properties.name.value !== '') {
      name = tmpElement.properties.name.value;
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit {name}</DialogTitle>
      </DialogHeader>

      <div>
        <div key={'gridTest'} className="grid h-auto w-auto grid-cols-[auto,auto] gap-4">
          {editableAttributes.map((property: ComponentProperty) => {
            switch (property.type) {
              case 'boolean':
                return [
                  <div key={`${property.id}Label`}>{property.label}</div>,
                  <Switch
                    key={`${property.id}Switch`}
                    checked={property.value}
                    onCheckedChange={() => {
                      const newProps = {
                        ...tmpProperties,
                      };

                      const oldValue = newProps[property.id]!.value as boolean;

                      newProps[property.id] = { ...property, value: !oldValue };
                      setTmpProperties(newProps);
                    }}
                  />,
                ];

              case 'number':
                return [
                  <div key={`${property.id}Label`}>{property.label}</div>,
                  <Input
                    key={`${property.id}Number`}
                    value={property.value}
                    type="number"
                    onChange={(event: any) => {
                      const newProps = {
                        ...tmpProperties,
                      };

                      newProps[property.id] = { ...property, value: event.target.value };
                      setTmpProperties(newProps);
                    }}
                  />,
                ];

              case 'textarea':
                return (
                  <>
                    <div>{property.label}</div>
                    <Textarea
                      id={property.id}
                      key={property.label}
                      value={property.value}
                      onChange={onChange}
                    />
                  </>
                );

              case 'answerlist':
                return (
                  <>
                    <div>{property.label}</div>
                    <StoryQuizAnswerList
                      key={property.label}
                      setAnswerListForQuiz={setAnswerListForQuiz}
                      answerList={property as AnswerList}
                    />
                  </>
                );

              case 'text':
                return [
                  <div key={`${property.id}Label`}>{property.label}</div>,
                  <Input
                    key={`${property.id}Input`}
                    id={property.id}
                    onChange={onChange}
                    value={property.value}
                  />,
                ];

              case 'select':
                return [
                  <div key={`${property.id}Label`}>{property.label}</div>,
                  <Select
                    key={`${property.id}Select`}
                    value={property.value}
                    onValueChange={(val: any) => {
                      const newProps = {
                        ...tmpProperties,
                      };

                      newProps[property.id] = { ...property, value: val };
                      setTmpProperties(newProps);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        <span className="block truncate">{property.value.name}</span>
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      {property.options?.map((option, optionIdx) => {
                        return (
                          <SelectItem key={`option${optionIdx}`} value={option}>
                            {option.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>,
                ];

              case 'entitiesAndEvents':
                return (
                  <Fragment>
                    {tmpElement.entityIds.length > 0 && [
                      <div key={`${property.label}ListLabel`}>{property.label}</div>,
                      <div
                        key={`${property.label}List`}
                        className="grid auto-rows-min grid-cols-[10px,auto,auto] gap-2"
                      >
                        {tmpElement.entityIds.map((e) => {
                          const entity = entitiesByID[e];
                          if (entity == null) {
                            return null;
                          }
                          const events = /* entity?.history || */ [] as Array<any>;
                          const newVisibilities = { ...tmpElement.visibilities };

                          if (newVisibilities[e] === undefined) {
                            newVisibilities[e] = true;
                            for (const event of events) {
                              newVisibilities[event.id] = true;
                            }
                            tmpElement.visibilities = newVisibilities;
                          } else {
                            newVisibilities[e] =
                              events.filter((event) => {
                                return newVisibilities[event.id] === true;
                              }).length > 0;
                          }

                          return [
                            <div key={`entity${entity.id}`} className="flex h-7 items-center">
                              <CheckBox
                                id={`default-checkbox-${e}`}
                                checked={newVisibilities[e]}
                                value={`${newVisibilities[e]}`}
                                onCheckedChange={() => {
                                  newVisibilities[e] = !(newVisibilities[e] as boolean);

                                  for (const event of events) {
                                    newVisibilities[event.id] = newVisibilities[e] as boolean;
                                  }

                                  setTmpElement({
                                    ...tmpElement,
                                    visibilities: newVisibilities,
                                  });
                                }}
                                className="dark:border-neutral-600 dark:bg-neutral-700 dark:ring-offset-neutral-800 dark:focus:ring-blue-600 h-4 w-4 rounded border-neutral-300 bg-neutral-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>,
                            <div
                              key={`${property.label}Disclosure`}
                              className="w-full max-w-md rounded-2xl bg-white"
                            >
                              <Collapsible>
                                <CollapsibleTrigger className="flex h-7 w-full justify-between rounded-lg bg-blue-100 p-1 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                                  <span>
                                    entity
                                    {getTranslatedLabel(entity.label)}
                                  </span>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="rounded-lg bg-blue-50 p-2 text-sm text-blue-900">
                                  {events.map((event: Event) => {
                                    newVisibilities[event.id] !== undefined
                                      ? newVisibilities[event.id]
                                      : true;

                                    const eventVisible = newVisibilities[event.id];

                                    return (
                                      <div
                                        key={event.id}
                                        className="grid grid-cols-[25px,1fr] items-center"
                                      >
                                        <CheckBox
                                          id={`${event.id}-checkbox`}
                                          checked={eventVisible}
                                          value={''}
                                          onCheckedChange={() => {
                                            newVisibilities[event.id] = !(eventVisible as boolean);

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
                                          className="dark:border-neutral-600 dark:bg-neutral-700 dark:ring-offset-neutral-800 dark:focus:ring-blue-600 h-4 w-4 rounded border-neutral-300 bg-neutral-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div className="table">
                                          {/*  <div className="table-cell w-1/3 font-semibold">
                                                                {eventTypes[event.type].label}
                                                              </div>
                                                              <div className="table-cell">
                                                                {event.date != null ? (
                                                                  <span>
                                                                    {formatDate(
                                                                      new Date(event.date),
                                                                    )}
                                                                  </span>
                                                                ) : null}{' '}
                                                                {event.place != null ? (
                                                                  <span>in {event.place.name}</span>
                                                                ) : null}
                                                              </div> */}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </CollapsibleContent>
                              </Collapsible>
                            </div>,
                            <div
                              key={`${property.label}ListButton`}
                              className="flex h-7 items-center"
                            >
                              <IconButton
                                label="Remove"
                                onClick={() => {
                                  const newEntityIds = tmpElement.entityIds.filter((id) => {
                                    return id !== e;
                                  });
                                  const newVis = { ...newVisibilities };
                                  delete newVis[e];
                                  for (const event of events) {
                                    delete newVis[event.id];
                                  }
                                  setTmpElement({
                                    ...tmpElement,
                                    entityIds: newEntityIds,
                                    visibilities: newVis,
                                  });
                                }}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </IconButton>
                            </div>,
                          ];
                        })}
                      </div>,
                    ]}
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
                  </Fragment>
                );
            }
          })}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>

        <Button
          onClick={() => {
            const newElement = { ...tmpElement, properties: tmpProperties };
            onSave(newElement as Visualization);
            onClose();
          }}
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
