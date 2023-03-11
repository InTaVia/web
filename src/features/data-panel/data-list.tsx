import type { Entity, Event } from '@intavia/api-client';
import { isEntityKind } from '@intavia/api-client';
import { groupBy } from '@stefanprobst/group-by';
import type { ReactNode } from 'react';
import { Fragment, useMemo } from 'react';

export interface GroupData {
  label: string;
  children: ReactNode;
  childrenIds: Array<Entity['id']> | Array<Event['id']>;
  count: number;
}

interface DataListProps {
  items: Array<Entity> | Array<Event>;
  groupedByProperty?: string;
  orderGroupsByKeys?: Array<string>;
  children: (
    params:
      | { item: Entity; type: 'entity' }
      | { item: Event; type: 'event' }
      | { item: GroupData; type: 'group' },
  ) => ReactNode;
}

// FIXME: should this be paginated?
export function DataList(props: DataListProps): JSX.Element | null {
  const { items, children, groupedByProperty = undefined, orderGroupsByKeys = undefined } = props;

  const groupedItems = useMemo(() => {
    const _items = items as Array<any>;
    if (
      groupedByProperty == null ||
      !_items.every((item) => {
        return groupedByProperty in item;
      })
    )
      return null;
    return groupBy(items as Array<object>, (item: any) => {
      return item[groupedByProperty];
    }) as unknown as Record<string, Array<Entity> | Array<Event>>;
  }, [groupedByProperty, items]);

  const getListItems = (items: Array<Entity> | Array<Event>) => {
    return (
      <ul role="list">
        {items.map((item: Entity | Event) => {
          if ('kind' in item && isEntityKind(item.kind)) {
            return <li key={item.id}>{children({ item: item as Entity, type: 'entity' })}</li>;
          } else {
            return <li key={item.id}>{children({ item: item as Event, type: 'event' })}</li>;
          }
        })}
      </ul>
    );
  };

  const isEveryKeyAvailable =
    groupedItems != null && groupedByProperty != null && orderGroupsByKeys != null
      ? Object.keys(groupedItems).every((item) => {
          return orderGroupsByKeys.includes(item);
        })
      : false;

  // oderGroupsByKey
  if (
    groupedItems != null &&
    groupedByProperty != null &&
    orderGroupsByKeys != null &&
    isEveryKeyAvailable
  ) {
    return (
      <ul role="list">
        {orderGroupsByKeys.map((key, i) => {
          if (groupedItems[key] == null) return <Fragment key={i}></Fragment>;
          return (
            <li key={i}>
              {children({
                item: {
                  label: key,
                  children: getListItems(groupedItems[key]!),
                  childrenIds: groupedItems[key]!.map((item) => {
                    return item.id;
                  }),
                  count: groupedItems[key]!.length,
                },
                type: 'group',
              })}
            </li>
          );
        })}
      </ul>
    );
  }

  //no ordering of groups
  if (groupedItems != null && groupedByProperty != null && orderGroupsByKeys == null) {
    return (
      <ul role="list">
        {Object.entries(groupedItems).map(([key, value], i) => {
          return (
            <li key={i}>
              {children({
                item: {
                  label: key,
                  children: getListItems(value),
                  childrenIds: value.map((item) => {
                    return item.id;
                  }),
                  count: value.length,
                },
                type: 'group',
              })}
            </li>
          );
        })}
      </ul>
    );
  }

  return getListItems(items);
}
