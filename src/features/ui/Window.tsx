import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

import uiStyles from '@/features/ui/ui.module.css';

export interface WindowProperties {
  title: string;
  class: string;
  id: string;
  children: any; //todo: replace any with real type
  onClick: void;
  onRemoveWindow: () => void;
  onCopyWindow: () => void;
}

function Window(props: WindowProperties) {
  const onRemoveWindow = props.onRemoveWindow;
  const onCopyWindow = props.onCopyWindow;
  const id = props.id;

  const buttonArea: any = [];

  if (onRemoveWindow) {
    buttonArea.push(
      <div
        key="closeButton"
        className={uiStyles['button-area-button']}
        onClick={(e) => {
          onRemoveWindow(id);
        }}
      >
        <ClearOutlinedIcon fontSize="medium" />
      </div>,
    );
  }

  if (onCopyWindow) {
    buttonArea.push(
      <div
        key="copyButton"
        className={uiStyles['button-area-button']}
        onClick={(e) => {
          onCopyWindow(id);
        }}
      >
        <ContentCopyOutlinedIcon fontSize="medium" />
      </div>,
    );
  }

  return (
    <div
      className={props.class}
      onClick={props.onClick}
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
    >
      <div className={uiStyles['header-area']}>
        {props.title}
        {buttonArea}
      </div>
      <div className={uiStyles['content-area']}>{props.children}</div>
    </div>
  );
}

export default Window;
