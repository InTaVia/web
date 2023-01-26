import type { ImportData } from '@intavia/data-import';

interface ViewDataProps {
  data: ImportData | null;
}

export function ViewData(props: ViewDataProps): JSX.Element {
  const { data } = props;
  return (
    <div className="h-full">
      <textarea
        className="h-full w-full resize-none font-mono"
        value={data != null ? JSON.stringify(data, null, 4) : ''}
        readOnly
      ></textarea>
    </div>
  );
}
