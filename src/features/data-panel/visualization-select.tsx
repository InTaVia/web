import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@intavia/ui';

import { useAppSelector } from '@/app/store';
import { FormField } from '@/components/form-field';
import type { Visualization } from '@/features/common/visualization.slice';
import { selectAllVisualizations } from '@/features/common/visualization.slice';

interface VisualizationSelectProps {
  all?: boolean;
  visualizationIds: Array<Visualization['id']>;
  onChange: (visualizations: Array<Visualization['id']>) => void;
}
export function VisualizationSelect(props: VisualizationSelectProps): JSX.Element {
  const { all = false, visualizationIds, onChange } = props;

  const _visualizations = useAppSelector(selectAllVisualizations);
  const visualizations = visualizationIds
    .map((visualizationId) => {
      const visualization = _visualizations[visualizationId];
      if (visualization == null) return null;
      return [
        visualizationId,
        `${visualization.type}: ${visualization.properties.name.value || visualization.id}`,
      ];
    })
    .filter(Boolean);

  const items: Array<[string, string]> = all
    ? [['all', 'All visualizations'], ...visualizations]
    : visualizations;

  function onValueChange(value: string) {
    if (value === 'all') {
      onChange(
        visualizations.map((visualization) => {
          return visualization[0];
        }),
      );
    } else {
      onChange([value]);
    }
  }
  return (
    <FormField>
      <Label htmlFor="visualization">Visualiztions:</Label>
      <Select name="visualization" onValueChange={onValueChange} defaultValue={'all'}>
        <SelectTrigger>
          <SelectValue placeholder="Select a visualization" />
        </SelectTrigger>
        <SelectContent>
          {items.map(([id, name]) => {
            return (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </FormField>
  );
}
