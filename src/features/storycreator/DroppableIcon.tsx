import {
  CalendarIcon as EventIcon,
  ChartBarIcon,
  ChatIcon,
  DocumentTextIcon,
  MapIcon,
  PhotographIcon,
  UserIcon as PersonIcon,
  VideoCameraIcon,
} from '@heroicons/react/outline';

import styles from '@/features/ui/ui.module.css';

export interface DroppableIconProps {
  type: string;
}

function getIcon(type: string) {
  const classStr = 'h-6 w-6 text-intavia-blue-800';
  switch (type) {
    case 'Timeline':
      return <ChartBarIcon className={classStr} />;
    case 'Map':
      return <MapIcon className={classStr} />;
    case 'Text':
      return <DocumentTextIcon className={classStr} />;
    case 'Image':
      return <PhotographIcon className={classStr} />;
    case 'Video/Audio':
      return <VideoCameraIcon className={classStr} />;
    case 'Person':
      return <PersonIcon className={styles['droppable-icon']} />;
    case 'Quiz':
      return <ChatIcon className={classStr} />;
    case 'Event':
      return <EventIcon className={styles['droppable-icon']} />;
    default:
      break;
  }
}

export function DroppableIcon(props: DroppableIconProps): JSX.Element {
  const { type } = props;

  return (
    <div
      key={`icon${type}`}
      style={{ verticalAlign: 'middle', display: 'table-cell', width: '1%' }}
    >
      {getIcon(type)}
    </div>
  );
}
