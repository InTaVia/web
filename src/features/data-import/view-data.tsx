import type { ImportData } from '@intavia/data-import';

interface ViewDataProps {
  data: ImportData | null;
}

export function ViewData(props: ViewDataProps): JSX.Element {
  const { data } = props;
  return <div className="bg-indigo-300">{data && JSON.stringify(data, null, 2)}</div>;
}
