import { ArrowUpIcon } from '@heroicons/react/outline';
import { FileInput, FileInputTrigger, useToast } from '@intavia/ui';
import { Fragment, useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import { replaceWith as intaviaDataReplaceWith } from '@/app/store/intavia.slice';
import { replaceWith as collectionsReplaceWith } from '@/app/store/intavia-collections.slice';
import { replaceWith as visualizationReplaceWith } from '@/features/common/visualization.slice';
import { isIntaviaProjectFile } from '@/features/data-import/intavia-formats.config';
import { replaceWith as networkReplaceWith } from '@/features/ego-network/network.slice';
import { replaceWith as contentPaneReplaceWith } from '@/features/storycreator/contentPane.slice';
import { replaceWith as storycreatorReplaceWith } from '@/features/storycreator/storycreator.slice';
import { replaceWith as uiReplaceWith } from '@/features/ui/ui.slice';
import { replaceWith as workspacesReplaceWith } from '@/features/visualization-layouts/workspaces.slice';

export function ProjectImport(): JSX.Element {
  const { t } = useI18n<'common'>();
  const [projectImport, setProjectImport] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const { toast } = useToast();

  const replaceWith = {
    collections: collectionsReplaceWith,
    intavia: intaviaDataReplaceWith,
    workspaces: workspacesReplaceWith,
    storycreator: storycreatorReplaceWith,
    network: networkReplaceWith,
    visualization: visualizationReplaceWith,
    contentPane: contentPaneReplaceWith,
    ui: uiReplaceWith,
  };

  function onChangeFileInput(files: FileList | null) {
    if (files != null && files.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const file = files[0]!;
      loadData(file);
    }
  }

  const onProjectImport = (data: Record<string, any>) => {
    const projectObj = { ...data };

    for (const [key, value] of Object.entries(projectObj)) {
      if (key in replaceWith) {
        dispatch(replaceWith[key](value));
      }
    }
  };

  function loadData(file: File) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onLoad(event: any) {
      //check at least for keys of project file
      const data = JSON.parse(event.target.result);

      if (!isIntaviaProjectFile(data)) {
        toast({
          title: 'Error',
          description:
            'Failed to import intavia project. It appears that the selected file is not an InTaVia project file.',
          variant: 'destructive',
        });
        return;
      }

      onProjectImport(data);

      toast({
        title: 'Success',
        description: 'Successfully imported intavia project.',
        variant: 'default',
      });
    }

    function onError() {
      toast({
        title: 'Error',
        description: 'Failed to import intavia project.',
        variant: 'destructive',
      });
    }

    const reader = new FileReader();
    reader.onload = onLoad;
    reader.onerror = onError;
    reader.readAsText(file);
  }

  return (
    <Fragment>
      <FileInput accept=".json" onValueChange={onChangeFileInput}>
        <FileInputTrigger>
          <ArrowUpIcon className="h-5 w-5" />
          Import Project
        </FileInputTrigger>
      </FileInput>
      <div className="flex items-center">Please select an InTaVia Project File</div>
    </Fragment>
  );
}
