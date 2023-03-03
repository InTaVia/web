import type { ChangeEvent } from "react";

interface LoadStoryProps {
	onStoryImport: (data: Record<string, any>) => void;
}

export function LoadStory(props: LoadStoryProps): JSX.Element {
	const { onStoryImport } = props;

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files != null && event.target.files.length > 0) {
			const file = event.target.files[0] as File;
			loadData(file);
		}
	};

	function loadData(file: File) {
		const onLoad = (event: any) => {
			onStoryImport(JSON.parse(event.target.result));
		};

		const reader = new FileReader();
		reader.onload = onLoad;
		reader.readAsText(file);
	}

	const formId = "import-data";
	const inputId = "template-file-upload";
	return (
		<div className="flex flex-row gap-2">
			<form
				className="isolate mt-1 -translate-y-1 cursor-pointer drop-shadow-md transition-transform hover:translate-y-0 hover:drop-shadow-sm disabled:translate-y-0 disabled:drop-shadow-sm"
				id={formId}
				name={formId}
				noValidate
			>
				<input
					accept=".json"
					name="file"
					type="file"
					id={inputId}
					onChange={handleChange}
					className="hidden"
				/>
				<label
					htmlFor={inputId}
					className="isolate box-border -translate-y-1 cursor-pointer rounded-md border-none bg-intavia-brand-700
          p-1.5
    px-3
    py-1.5 text-sm
    font-normal text-intavia-gray-50 outline-current
    drop-shadow-md transition-transform
     hover:translate-y-0 hover:bg-intavia-brand-900 hover:drop-shadow-sm focus:outline-2 focus:outline-offset-2 active:bg-intavia-brand-50 active:text-intavia-gray-900 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:drop-shadow-sm"
				>
					Import Story
				</label>
			</form>
			<p>Please select an InTaVia Story Configuration File</p>
		</div>
	);
}
