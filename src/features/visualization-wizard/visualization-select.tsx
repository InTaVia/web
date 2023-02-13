import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { Fragment } from 'react';

import type { Visualization } from '@/features/common/visualization.slice';

interface VisualizationSelectProps {
  options: Record<Visualization['id'], Visualization>;
  setSelectedVisualizationId: (id: Visualization['id'] | null) => void;
  selectedVisualizationId: Visualization['id'] | null;
}
export function VisualizationSelect(props: VisualizationSelectProps): JSX.Element {
  const { options, selectedVisualizationId, setSelectedVisualizationId } = props;
  if (selectedVisualizationId == null) {
    const initalOption = Object.values(options)[0]!;
    setSelectedVisualizationId(initalOption.id);
    return <></>;
  }

  return (
    <Listbox
      value={selectedVisualizationId}
      onChange={(visualizatonId: Visualization['id']) => {
        setSelectedVisualizationId(visualizatonId);
      }}
    >
      <div className="relative mt-1 w-60">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">{`${options[selectedVisualizationId].type}: ${
            options[selectedVisualizationId].properties.name.value ||
            options[selectedVisualizationId].id
          }`}</span>
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
            {Object.values(options).map((option, optionIdx) => {
              return (
                <Listbox.Option
                  key={`option${optionIdx}`}
                  className={({ active }) => {
                    return `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`;
                  }}
                  value={option.id}
                >
                  {({ selected }) => {
                    return (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                        >
                          {`${option.type}: ${option.properties.name.value || option.id}`}
                        </span>
                        {selected ? (
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
  );
}
