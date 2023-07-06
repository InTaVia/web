import type { Entity } from '@intavia/api-client';

interface AlternativeLabelsProps {
  labels: Entity['alternativeLabels'];
}

export function EntityAlternativeLabels(props: AlternativeLabelsProps): JSX.Element | null {
  const { labels } = props;

  if (labels == null || labels.length === 0) return null;

  return (
    <div className="grid gap-1">
      <dt className="font-bold uppercase text-neutral-700">Alternative labels</dt>
      <dd>
        <ul role="list">
          {labels.map((label, index) => {
            return <li key={index}>{label.default}</li>;
          })}
        </ul>
      </dd>
    </div>
  );
}
