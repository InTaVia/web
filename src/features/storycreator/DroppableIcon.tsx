import {
  ChartBarIcon,
  ChatIcon,
  DocumentTextIcon,
  MapIcon,
  PhotographIcon,
} from '@heroicons/react/outline';
import AdjustIcon from '@mui/icons-material/Adjust';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

import styles from '@/features/ui/ui.module.css';

export interface DroppableIconProps {
  type: string;
}

const getIcon: any = (type: string) => {
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
    case 'Person':
      return (
        <PersonOutlineOutlinedIcon
          className={styles['droppable-icon']}
          color="primary"
          key="personIcon"
        />
      );
    case 'Quiz':
      return <ChatIcon className={classStr} />;
    case 'Event':
      return <AdjustIcon className={styles['droppable-icon']} color="primary" key="EventIcon" />;
    default:
      break;
  }
};

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
