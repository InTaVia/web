import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

import type {
  SlideContent,
  StoryAnswerList,
  StoryContentProperty,
  StoryQuizAnswer,
} from '@/features/storycreator/contentPane.slice';
import { StoryQuizAnswerList } from '@/features/storycreator/StoryQuizAnswerList';
import Button from '@/features/ui/Button';
import TextField from '@/features/ui/TextField';

interface StoryContentDialogProps {
  element: SlideContent;
  onClose: () => void;
  onSave: (element: SlideContent) => void;
}

export function StoryContentDialog(props: StoryContentDialogProps): JSX.Element {
  const { element, onClose, onSave } = props;

  const [tmpProperties, setTmpProperties] = useState({ ...element.properties });

  const onChange = (event: any) => {
    const newVal = { ...tmpProperties[event.target.id], value: event.target.value };
    setTmpProperties({ ...tmpProperties, [event.target.id]: newVal });
  };

  const setAnswerListForQuiz = (answers: Array<StoryQuizAnswer>) => {
    const newVal = { ...tmpProperties.answerlist, answers: answers } as StoryAnswerList;
    setTmpProperties({ ...tmpProperties, answerlist: newVal });
  };

  let editableAttributes = [];

  editableAttributes = Object.values(tmpProperties as object)
    .filter((prop: StoryContentProperty) => {
      return prop.editable;
    })
    .sort((a: StoryContentProperty, b: StoryContentProperty) => {
      return a.sort - b.sort;
    });

  const name = element.type;

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {`Edit ${name}`}
                </Dialog.Title>
                <div className="mt-2">
                  <div className="grid h-auto w-auto grid-cols-[auto,auto] gap-4">
                    {editableAttributes.map((property: StoryContentProperty) => {
                      switch (property.type) {
                        case 'text':
                          return (
                            <>
                              <div>{property.label}</div>
                              <TextField
                                id={property.id}
                                key={property.label}
                                onChange={onChange}
                                value={property.value}
                              />
                            </>
                          );
                        case 'textarea':
                          return (
                            <>
                              <div>{property.label}</div>
                              <TextField
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
                                answerList={property as StoryAnswerList}
                              />
                            </>
                          );
                      }
                    })}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <div className="grid grid-cols-2 grid-rows-1 gap-1">
                    <Button
                      size="small"
                      round="round"
                      shadow="small"
                      color="warning"
                      onClick={onClose}
                    >
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
                        const newElement = { ...element, properties: tmpProperties };
                        console.log(newElement);
                        onSave(newElement);
                        onClose();
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
