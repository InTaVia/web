import { ArrowUpIcon } from '@heroicons/react/outline';
import { FileInput, FileInputTrigger, useToast } from '@intavia/ui';

interface LoadStoryProps {
  onStoryImport: (data: Record<string, any>) => void;
}

export function LoadStory(props: LoadStoryProps): JSX.Element {
  const { onStoryImport } = props;

  const { toast } = useToast();

  function onChangeFileInput(files: FileList | null) {
    if (files != null && files.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const file = files[0]!;
      loadData(file);
    }
  }

  function loadData(file: File) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onLoad(event: any) {
      onStoryImport(JSON.parse(event.target.result));

      toast({
        title: 'Success',
        description: 'Successfully imported story.',
        variant: 'default',
      });
    }

    function onError() {
      toast({
        title: 'Error',
        description: 'Failed to import story.',
        variant: 'destructive',
      });
    }

    const reader = new FileReader();
    reader.onload = onLoad;
    reader.onerror = onError;
    reader.readAsText(file);
  }

  return (
    <>
      <FileInput className="w-36" accept=".json" onValueChange={onChangeFileInput}>
        <FileInputTrigger>
          <ArrowUpIcon className="h-5 w-5" />
          Import Story
        </FileInputTrigger>
      </FileInput>

      <div className="flex items-center">Please select an InTaVia Story Configuration File</div>
    </>
  );
}
