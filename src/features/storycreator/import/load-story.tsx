import { FileInput, FileInputTrigger } from '@intavia/ui';

interface LoadStoryProps {
  onStoryImport: (data: Record<string, any>) => void;
}

export function LoadStory(props: LoadStoryProps): JSX.Element {
  const { onStoryImport } = props;

  function onChangeFileInput(files: FileList | null) {
    if (files != null && files.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const file = files[0]!;
      loadData(file);
    }
  }

  function loadData(file: File) {
    function onLoad(event: any) {
      onStoryImport(JSON.parse(event.target.result));
    }

    const reader = new FileReader();
    reader.onload = onLoad;
    reader.readAsText(file);
  }

  return (
    <div className="flex items-center gap-2">
      <FileInput accept=".json" name="file" onValueChange={onChangeFileInput}>
        <FileInputTrigger>Import story</FileInputTrigger>
      </FileInput>

      <p>Please select an InTaVia Story Configuration File</p>
    </div>
  );
}
