import { AlertDialog, AlertDialogTrigger, Button, IconButton, Separator } from '@intavia/ui';
import { nanoid } from '@reduxjs/toolkit';
import { ChevronRightIcon, Trash2Icon } from 'lucide-react';
import { Fragment, useContext, useState } from 'react';

import { PageContext } from '@/app/context/page.context';
import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import type { IntaviaIconTypes } from '@/features/common/icons/intavia-icon';
import { IntaviaIcon } from '@/features/common/icons/intavia-icon';
import type { Visualization } from '@/features/common/visualization.slice';
import {
  addEntitiesToVisualization,
  addEventsToVisualization,
  addTargetEntitiesToVisualization,
  copyVisualization,
  createVisualization,
  removeVisualization,
  selectAllVisualizations,
  visualizationTypes,
  visualizationTypesStoryCreator,
} from '@/features/common/visualization.slice';
import { selectUsedVisualizations as selectUsedVisualizationsSC } from '@/features/storycreator/storycreator.slice';
import type { SlotId } from '@/features/visualization-layouts/workspaces.slice';
import { selectUsedVisualizations as selectUsedVisualizationsVAS } from '@/features/visualization-layouts/workspaces.slice';
import { DeleteVisualizationAlertDialog } from '@/features/visualization-wizard/delete-visualization-alert';
import { VisualizationSelect } from '@/features/visualization-wizard/visualization-select';

interface VisualizationWizardProps {
  visualizationSlot: SlotId;
  onAddVisualization: (visualizationSlot: string, visId: string) => void;
}
export default function VisualizationWizard(props: VisualizationWizardProps): JSX.Element {
  const { visualizationSlot, onAddVisualization } = props;
  const dispatch = useAppDispatch();
  const { plural, t } = useI18n<'common'>();
  const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);

  const [selectedVisualizationId, setSelectedVisualizationId] = useState<
    Visualization['id'] | null
  >(null);

  const visualizations = useAppSelector(selectAllVisualizations);

  const usedVisualizations = [
    ...useAppSelector(selectUsedVisualizationsVAS),
    ...useAppSelector(selectUsedVisualizationsSC),
  ];
  const pageContext = useContext(PageContext);
  const isStoryCreator = pageContext.page === 'story-creator';

  function createVis(type: Visualization['type']) {
    const visId = `visualization-${nanoid(4)}`;

    dispatch(
      createVisualization({
        id: visId,
        type: type,
        name: visId,
        entityIds: [],
        eventIds: [],
        targetEntityIds: [],
      }),
    );

    return visId;
  }

  function onCreateVisualization(type: Visualization['type']) {
    const visId = createVis(type);
    onAddVisualization(visualizationSlot, visId);
  }

  function onLoadVisualization() {
    onAddVisualization(visualizationSlot, selectedVisualizationId!);
  }

  function onCopyVisualization() {
    const newVisId = `${selectedVisualizationId!}-${nanoid(2)}`;
    dispatch(copyVisualization({ visID: selectedVisualizationId!, newVisID: newVisId }));
    onAddVisualization(visualizationSlot, newVisId);
  }

  function onCloneVisualization(type: Visualization['type']) {
    const visId = createVis(type);
    const sourceVis = visualizations[selectedVisualizationId!];
    if (sourceVis != null && sourceVis.entityIds.length > 0) {
      dispatch(addEntitiesToVisualization({ visId: visId, entities: sourceVis.entityIds }));
    }
    if (sourceVis != null && sourceVis.eventIds.length > 0) {
      dispatch(addEventsToVisualization({ visId: visId, events: sourceVis.eventIds }));
    }
    if (sourceVis != null && sourceVis.targetEntityIds.length > 0) {
      dispatch(
        addTargetEntitiesToVisualization({
          visId: visId,
          targetEntities: sourceVis.targetEntityIds,
        }),
      );
    }

    onAddVisualization(visualizationSlot, visId);
  }

  function onDeleteVisualization() {
    const id = selectedVisualizationId;
    setSelectedVisualizationId(null);
    if (id != null) {
      dispatch(removeVisualization(id));
    }

    setAlertDialogOpen(false);
  }

  const visTypes = isStoryCreator ? visualizationTypesStoryCreator : visualizationTypes;

  return (
    <div className="flex h-full w-full flex-col place-content-center items-center gap-5 p-5">
      <div className="flex flex-row place-content-center items-center gap-2">
        {visTypes.map((visType) => {
          return (
            <Button
              key={`new-vis-${visType}`}
              onClick={() => {
                onCreateVisualization(visType);
              }}
            >
              {/* FIXME Workaround because we have ego-network and network as keys throughout the application */}
              <IntaviaIcon
                icon={visType === 'ego-network' ? 'network' : visType}
                className="shrink-0 fill-none"
              />
              {`${t(['common', 'form', 'new'])} ${t([
                'common',
                'visualizations',
                `${visType}`,
                'label',
                plural(1),
              ])}`}
            </Button>
          );
        })}
      </div>

      {Object.values(visualizations).filter((vis) => {
        return visTypes.includes(vis.type);
      }).length > 0 && (
        <>
          <Separator />
          <div className="flex gap-2">
            <VisualizationSelect
              isStoryCreator={isStoryCreator}
              onValueChange={setSelectedVisualizationId}
            />
            {selectedVisualizationId != null && visualizations[selectedVisualizationId] != null && (
              <Fragment>
                <Button onClick={onLoadVisualization}>
                  <IntaviaIcon
                    icon={
                      visualizations[selectedVisualizationId]!.type === 'ego-network'
                        ? 'network'
                        : visualizations[selectedVisualizationId]!.type
                    }
                    className="shrink-0 fill-none"
                  />
                  <span className="flex-nowrap">{t(['common', 'form', 'open'])}</span>
                </Button>
                <Button onClick={onCopyVisualization} variant="subtle">
                  <IntaviaIcon
                    icon={
                      visualizations[selectedVisualizationId]!.type === 'ego-network'
                        ? 'network'
                        : visualizations[selectedVisualizationId]!.type
                    }
                    className="shrink-0 fill-none"
                  />
                  <span className="flex-nowrap">{t(['common', 'form', 'copy'])}</span>
                </Button>
                <AlertDialog open={isAlertDialogOpen} onOpenChange={setAlertDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <IconButton
                      className="h-10 w-10"
                      disabled={usedVisualizations.includes(selectedVisualizationId)}
                      label="Delete visualization"
                      variant="destructive"
                    >
                      <Trash2Icon className="h-5 w-5 shrink-0" />
                    </IconButton>
                  </AlertDialogTrigger>

                  <DeleteVisualizationAlertDialog
                    onDelete={onDeleteVisualization}
                    visualizationId={
                      visualizations[selectedVisualizationId]!.properties.name.value ||
                      selectedVisualizationId
                    }
                    visualizationType={t([
                      'common',
                      'visualizations',
                      visualizations[selectedVisualizationId]!.type,
                      'label',
                      plural(1),
                    ])}
                  />
                </AlertDialog>
              </Fragment>
            )}
          </div>
          <div className="flex gap-2">
            {selectedVisualizationId != null && visualizations[selectedVisualizationId] != null && (
              <Fragment>
                {visTypes
                  .filter((visType) => {
                    return visType !== visualizations[selectedVisualizationId]!.type;
                  })
                  .map((visType) => {
                    return (
                      <Button
                        key={`create-${visType}`}
                        onClick={() => {
                          onCloneVisualization(visType as Visualization['type']);
                        }}
                        variant="subtle"
                      >
                        <IntaviaIcon
                          icon={
                            visualizations[selectedVisualizationId]!.type === 'ego-network'
                              ? 'network'
                              : visualizations[selectedVisualizationId]!.type
                          }
                          className="shrink-0 fill-none"
                        />
                        <ChevronRightIcon className="h-3 w-3" />
                        <IntaviaIcon
                          icon={visType === 'ego-network' ? 'network' : visType}
                          className="shrink-0 fill-none"
                        />
                        <span className="flex-nowrap">
                          {t(['common', 'form', 'turn'])}{' '}
                          {t(['common', 'visualizations', visType, 'label', plural(1)])}
                        </span>
                      </Button>
                    );
                  })}
              </Fragment>
            )}
          </div>
        </>
      )}
    </div>
  );
}
