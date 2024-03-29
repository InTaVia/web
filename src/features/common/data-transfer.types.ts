import type { Entity, Event } from '@intavia/api-client';

import type { Visualization } from '@/features/common/visualization.slice';
import type { SlideContent } from '@/features/storycreator/contentPane.slice';
import type { SlotId } from '@/features/visualization-layouts/workspaces.slice';
// import type { LayoutGridItemId } from '@/features/common/layout.config';
// import type {
//   SlideContent,
//   SlideContentContentContent,
// } from '@/features/storytelling-creator/slide-contents.slice';

/** Using custom, application-specific media type instead of `text/plain`. */
export const type = 'application/x-intavia';

export interface ContentTypeTransferData {
  type: 'contentType';
  contentType: SlideContent['type'];
}

// interface ContentContentContentDataTransferData {
//   type: 'content-item';
//   content: DistributiveOmit<SlideContentContentContent, 'id' | 'layout'>;
// }

interface DataDataTransferData {
  type: 'data';
  entities: Array<Entity['id']>;
  targetEntities: Array<Entity['id']>;
  events: Array<Event['id']>;
}

// interface LayoutDataTransferData {
//   type: 'layout';
//   source: LayoutGridItemId;
// }

interface VisualizationDataTransferData {
  type: 'visualization';
  sourceSlot: SlotId;
  sourceVis: Visualization['id'] | null;
}

export type DataTransferData =
  | ContentTypeTransferData
  | DataDataTransferData
  | VisualizationDataTransferData;
// | ContentContentContentDataTransferData
// | ContentDataTransferData
// | DataDataTransferData
// | LayoutDataTransferData;
