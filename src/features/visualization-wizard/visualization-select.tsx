import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@intavia/ui';
import { useMemo, useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppSelector } from '@/app/store';
import { IntaviaIcon } from '@/features/common/icons/intavia-icon';
import {
  type Visualization,
  selectAllVisualizations,
  visualizationTypes,
  visualizationTypesStoryCreator,
} from '@/features/common/visualization.slice';

interface VisualizationSelectProps {
  onValueChange(id: Visualization['id'] | null): void;
  isStoryCreator: boolean;
}

export function VisualizationSelect(props: VisualizationSelectProps): JSX.Element {
  const { onValueChange, isStoryCreator } = props;

  const [selectedVisualizationId, setSelectedVisualizationId] = useState<
    Visualization['id'] | null
  >(null);

  const { plural, t } = useI18n<'common'>();

  const visTypes = isStoryCreator ? visualizationTypesStoryCreator : visualizationTypes;
  const _visualizations = useAppSelector(selectAllVisualizations);
  const visualizationTypeGroups = useMemo(() => {
    const groups = Object.values(_visualizations).reduce((acc, visualization) => {
      const { id, type } = visualization;
      if (visTypes.includes(type)) {
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(id);
      }
      return acc;
    }, {});

    return groups;
  }, [_visualizations, visTypes]);

  useMemo(() => {
    const filteredVisualizationIdsByPageContext = Object.entries(_visualizations)
      .filter(([_, vis]) => {
        return visTypes.includes(vis.type);
      })
      .map(([visId, _]) => {
        return visId;
      });

    if (filteredVisualizationIdsByPageContext.length === 0) {
      setSelectedVisualizationId(null);
      onValueChange(null);
      return;
    }

    if (
      selectedVisualizationId == null ||
      (selectedVisualizationId != null &&
        !filteredVisualizationIdsByPageContext.includes(selectedVisualizationId))
    ) {
      const visId = filteredVisualizationIdsByPageContext[0] as Visualization['id'];
      setSelectedVisualizationId(visId);
      onValueChange(visId);
      return;
    }

    // if (
    //   // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    //   selectedVisualizationId != null &&
    //   !filteredVisualizationIdsByPageContext.includes(selectedVisualizationId)
    // ) {
    //   if (Object.keys(_visualizations).length > 0) {
    //     const visId = Object.keys(_visualizations)[0] as Visualization['id'];
    //     setSelectedVisualizationId(visId);
    //     onValueChange(visId);
    //   } else {
    //     setSelectedVisualizationId(null);
    //     onValueChange(null);
    //   }
    // }
  }, [_visualizations, onValueChange, selectedVisualizationId, visTypes]);

  return (
    <Select
      value={selectedVisualizationId}
      onValueChange={(visId: Visualization['id']) => {
        onValueChange(visId);
        setSelectedVisualizationId(visId);
      }}
    >
      <SelectTrigger>
        <SelectValue>
          {selectedVisualizationId != null &&
          Object.keys(_visualizations).includes(selectedVisualizationId) ? (
            <span className="block truncate">{`${t([
              'common',
              'visualizations',
              `${_visualizations[selectedVisualizationId].type}`,
              'label',
              plural(1),
            ])}: ${
              _visualizations[selectedVisualizationId].properties.name.value ||
              _visualizations[selectedVisualizationId].id
            }`}</span>
          ) : (
            // TODO Move into dictionary
            <span>Please select a visualization</span>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {visTypes
          .filter((visType) => {
            return visType in visualizationTypeGroups;
          })
          .map((visTypeKey) => {
            const visIds: Array<Visualization['id']> = visualizationTypeGroups[visTypeKey];
            return (
              <SelectGroup key={`vis-select-label-${visTypeKey}`}>
                <SelectLabel className="bg-neutral-200 pl-1">
                  <span className="m-0 flex flex-row items-center gap-1 whitespace-nowrap">
                    {/* FIXME: workaround  ego-network and network */}
                    <IntaviaIcon
                      icon={visTypeKey === 'ego-network' ? 'network' : visTypeKey}
                      className="fill-none"
                    />
                    {`${visIds.length} ${t([
                      'common',
                      'visualizations',
                      `${visTypeKey}`,
                      'label',
                      plural(visIds.length),
                    ])}`}
                  </span>
                </SelectLabel>
                {visIds.map((visId) => {
                  return (
                    <SelectItem key={`vis-select-item-${visId}`} value={visId}>
                      <span>{`${_visualizations[visId].properties.name.value || visId}`}</span>
                      {_visualizations[visId]?.entityIds.length === 0 &&
                        _visualizations[visId]?.eventIds.length === 0 && (
                          <span> ({t(['common', 'visualizations', 'empty'])})</span>
                        )}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            );
          })}
      </SelectContent>
    </Select>
  );
}
