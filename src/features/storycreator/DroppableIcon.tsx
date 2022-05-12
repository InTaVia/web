import AdjustIcon from '@mui/icons-material/Adjust';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import LinearScaleOutlinedIcon from '@mui/icons-material/LinearScaleOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';

import styles from '@/features/ui/ui.module.css';

export interface DroppableIconProps {
  type: string;
}

const getIcon: any = (type: string) => {
  switch (type) {
    case 'Timeline':
      return (
        <LinearScaleOutlinedIcon
          className={styles['droppable-icon']}
          fontSize="large"
          color="primary"
          key="timelineIcon"
        />
      );
    case 'Map':
      return (
        <MapOutlinedIcon
          className={styles['droppable-icon']}
          fontSize="large"
          color="primary"
          key="mapIcon"
        />
      );
    case 'Text':
      return (
        <NoteAltOutlinedIcon
          className={styles['droppable-icon']}
          fontSize="large"
          color="primary"
          key="annotationIcon"
        />
      );
    case 'Image':
      return (
        <ImageOutlinedIcon
          className={styles['droppable-icon']}
          fontSize="large"
          color="primary"
          key="imageIcon"
        />
      );
    case 'Person':
      return (
        <PersonOutlineOutlinedIcon
          className={styles['droppable-icon']}
          color="primary"
          key="personIcon"
        />
      );
    case 'Quiz':
      return (
        <QuizOutlinedIcon
          className={styles['droppable-icon']}
          fontSize="large"
          color="primary"
          key="EventIcon"
        />
      );
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
