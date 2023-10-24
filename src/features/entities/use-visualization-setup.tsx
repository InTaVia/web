import type { Entity } from '@intavia/api-client';

import type { Visualization } from '@/features/common/visualization.slice';

export function useVisualizationSetup(
  entityId: Entity['id'],
): [Visualization, Visualization, Visualization] {
  const networkVisualization: Visualization = {
    id: `ego-network-${entityId}`,
    type: 'ego-network',
    name: `ego-network-${entityId}`,
    entityIds: [entityId],
    targetEntityIds: [],
    eventIds: [],
    properties: {
      showPersons: {
        type: 'boolean',
        id: 'showPersons',
        value: true,
        label: 'Show persons',
        editable: true,
        sort: 3,
      },
      showObjects: {
        type: 'boolean',
        id: 'showObjects',
        value: true,
        label: 'Show objects',
        editable: true,
        sort: 4,
      },
      showGroups: {
        type: 'boolean',
        id: 'showGroups',
        value: true,
        label: 'Show groups',
        editable: true,
        sort: 5,
      },
      showPlaces: {
        type: 'boolean',
        id: 'showPlaces',
        value: true,
        label: 'Show places',
        editable: true,
        sort: 6,
      },
    },
  };

  const mapVisualization: Visualization = {
    // id: `ego-map-${entityId}`,
    id: `ego-map`,
    type: 'map',
    name: `ego-map-${entityId}`,
    entityIds: [entityId],
    targetEntityIds: [],
    eventIds: [],
    properties: {
      spaceTimeCubeMode: {
        type: 'boolean',
        id: 'spaceTimeCubeMode',
        value: false,
        editable: false,
        label: 'Space Time Cube Mode',
      },
      cluster: {
        type: 'boolean',
        id: 'cluster',
        value: false,
        editable: false,
        label: 'Cluster',
      },
      clusterMode: {
        type: 'select',
        id: 'clusterMode',
        label: 'Cluster Style',
        value: {
          name: 'Donut',
          value: 'donut',
        },
        options: [
          {
            name: 'Donut',
            value: 'donut',
          },
          {
            name: 'Dot',
            value: 'dot',
          },
        ],
        editable: false,
      },
      renderLines: {
        type: 'boolean',
        id: 'renderLines',
        value: true,
        editable: false,
        label: 'Connect events chronologically with lines (for each entity)',
      },
      mapStyle: {
        type: 'select',
        id: 'mapStyle',
        label: 'Map Style',
        value: {
          name: 'Dataviz (Light Gray)',
          value: 'https://api.maptiler.com/maps/dataviz-light/style.json?key=Z2X5tY0jlK44wsp6Kl4i',
        },
        editable: false,
      },
      colorBy: {
        type: 'select',
        id: 'colorBy',
        label: 'Color events by',
        value: {
          name: 'Event-kind',
          value: 'event-kind',
        },
        editable: false,
      },
    },
  };

  const timelineVisualization: Visualization = {
    id: `ego-timeline-${entityId}`,
    type: 'timeline',
    name: `ego-timeline-${entityId}`,
    entityIds: [entityId],
    targetEntityIds: [],
    eventIds: [],
    properties: {
      cluster: {
        type: 'boolean',
        id: 'cluster',
        value: true,
        editable: false,
        label: 'Cluster',
      },
    },
  };

  return [networkVisualization, mapVisualization, timelineVisualization];
}
