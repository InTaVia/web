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
  switch (type) {
    case 'Timeline':
      return <ChartBarIcon className="h-6 w-6 -rotate-90 text-intavia-brand-800" />;
    case 'Map':
      return <MapIcon className="h-6 w-6 text-intavia-brand-800" />;
    case 'Text':
      return <DocumentTextIcon className="h-6 w-6 text-intavia-brand-800" />;
    case 'Image':
      return <PhotographIcon className="h-6 w-6 text-intavia-brand-800" />;
    case 'Person':
      return (
        <PersonOutlineOutlinedIcon
          className={styles['droppable-icon']}
          color="primary"
          key="personIcon"
        />
      );
    case 'Quiz':
      return <ChatIcon className="h-6 w-6 text-intavia-brand-800" />;
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
