import styles from '@/features/storycreator/storycreator.module.css';

export default function ButtonRow(props: any) {
  return (
    <div className={`${styles['button-row']}`} style={props.style}>
      {props.children}
    </div>
  );
}
