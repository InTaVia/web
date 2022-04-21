import uiStyles from '@/features/ui/ui.module.css';

export interface WindowProperties {
  closable: boolean;
  title: string;
  class: string;
  id: string;
  children: any; //todo: replace any with real type
}

function Window(props: WindowProperties) {
  const closable: boolean = props.closable ? props.closable : true;

  const buttonArea: any = [];

  if (closable) {
    buttonArea.push(
      <div
        key="closeButton"
        className={uiStyles['close-button']}
        onClick={(e) => {
          props.onRemoveWindow(props.id);
        }}
      >
        X
      </div>,
    );
  }

  return (
    <div className={props.class} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div className={uiStyles['header-area']}>
        {props.title}
        {buttonArea}
      </div>
      <div className={uiStyles['content-area']}>{props.children}</div>
    </div>
  );
}

export default Window;
