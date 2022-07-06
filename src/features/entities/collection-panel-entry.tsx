import { Disclosure } from '@headlessui/react';
import { Fragment } from 'react';

import type { Entity } from '@/features/common/entity.model';

export interface CollectionPanelEntryProps {
  entity: Entity;
}

export default function CollectionPanelEntry(props: CollectionPanelEntryProps): JSX.Element {
  return (
    <div className="my-2 rounded border-2 border-red-500 p-2">
      <Disclosure>
        {({ open }) => {
          return (
            <Fragment>
              <Disclosure.Button className="display-block py-2">
                <div className="grid grid-cols-[3.6rem_1fr_minmax(50px,max-content)] grid-rows-3 gap-1">
                  <svg className="col-start-1 row-span-3 row-start-1" viewBox="0 0 1 1">
                    <path
                      fill="rebeccapurple"
                      d="M0 1 L 0.35 0.65 V 0.4 H 0.3 V 0.1 H 0.7 V 0.4 H 0.65 V 0.65 L 1 1 Z"
                    />
                  </svg>
                  <h2 className="col-start-2 row-span-3 row-start-1 my-1 place-self-center text-lg font-semibold">
                    {props.entity.name}
                  </h2>
                  <span className="font-verythin col-start-3 row-start-1 max-w-[20ch] overflow-hidden text-ellipsis whitespace-nowrap text-[0.5rem]">
                    {props.entity.kind === 'person' ? props.entity.categories.join(', ') : ''}
                  </span>
                  <span className="font-verythin col-start-3 row-start-2 max-w-[20ch] overflow-hidden text-ellipsis whitespace-nowrap text-[0.5rem]">
                    {props.entity.kind === 'person'
                      ? props.entity.gender
                      : props.entity.kind === 'place'
                      ? `${props.entity.lat} ${props.entity.lng}`
                      : ``}
                  </span>
                  <span className="font-verythin col-start-3 row-start-3 max-w-[20ch] overflow-hidden text-ellipsis whitespace-nowrap text-[0.5rem]">
                    {props.entity.kind === 'person' ? props.entity.occupation.join(', ') : ''}
                  </span>
                </div>

                <div className={open ? '' : 'text-gray-500 line-clamp-3'}>
                  <p>{props.entity.description}</p>
                </div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <h3 className="text-md font-semibold">Events</h3>

                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor voluptate, ducimus
                  minus, architecto nemo atque nisi odit dolorum adipisci deserunt fugiat quae quas
                  rem asperiores neque nostrum est. A, delectus!
                </p>
              </Disclosure.Panel>
            </Fragment>
          );
        }}
      </Disclosure>
    </div>
  );
}
