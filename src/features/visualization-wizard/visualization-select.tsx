import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@intavia/ui';

import type { Visualization } from '@/features/common/visualization.slice';

interface VisualizationSelectProps {
  options: Record<Visualization['id'], Visualization>;
  setSelectedVisualizationId: (id: Visualization['id'] | null) => void;
  selectedVisualizationId: Visualization['id'] | null;
}

export function VisualizationSelect(props: VisualizationSelectProps): JSX.Element | null {
  const { options, selectedVisualizationId, setSelectedVisualizationId } = props;

  if (selectedVisualizationId == null) {
    const initalOption = Object.values(options)[0]!;
    setSelectedVisualizationId(initalOption.id);
    return null;
  }

  return (
    <Select
      value={selectedVisualizationId}
      onValueChange={(visualizatonId: Visualization['id']) => {
        setSelectedVisualizationId(visualizatonId);
      }}
    >
      <SelectTrigger>
        <SelectValue>
          <span className="block truncate">{`${options[selectedVisualizationId].type}: ${
            options[selectedVisualizationId].properties.name.value ||
            options[selectedVisualizationId].id
          }`}</span>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {Object.values(options).map((option, optionIdx) => {
          return (
            <SelectItem key={`option${optionIdx}`} value={option.id}>
              {`${option.type}: ${option.properties.name.value || option.id}`}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
