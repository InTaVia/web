import type { Entity, Event } from '@intavia/api-client';
// import type { LayoutGridItemId } from '@/features/common/layout.config';
// import type {
//   SlideContent,
//   SlideContentContentContent,
// } from '@/features/storytelling-creator/slide-contents.slice';

/** Using custom, application-specific media type instead of `text/plain`. */
export const type = 'application/x-intavia';

// interface ContentDataTransferData {
//   type: 'content';
//   content: SlideContent; // FIXME:
// }

// interface ContentContentContentDataTransferData {
//   type: 'content-item';
//   content: DistributiveOmit<SlideContentContentContent, 'id' | 'layout'>;
// }

interface DataDataTransferData {
  type: 'data';
  entities: Array<Entity['id']>;
  events: Array<Event['id']>;
}

// interface LayoutDataTransferData {
//   type: 'layout';
//   source: LayoutGridItemId;
// }

export type DataTransferData = DataDataTransferData;
// | ContentContentContentDataTransferData
// | ContentDataTransferData
// | DataDataTransferData
// | LayoutDataTransferData;
