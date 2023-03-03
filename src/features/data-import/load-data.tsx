import { importData } from "@intavia/data-import";
import type { ImportData } from "@intavia/data-import/dist/import-data";
import type { ChangeEvent } from "react";
import { useState } from "react";

import { useI18n } from "@/app/i18n/use-i18n";

interface LoadDataProps {
	setImportedData: (data: ImportData | null) => void;
}

export function LoadData(props: LoadDataProps): JSX.Element {
	const { setImportedData } = props;
	const { t } = useI18n<"common">();

	const [file, setFile] = useState<File | null>(null);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files != null && event.target.files.length > 0) {
			const file = event.target.files[0] as File;
			setFile(file);
			loadData(file);
		} else {
			setFile(null);
			setImportedData(null);
		}
	};

	function loadData(file: File) {
		// const formData = new FormData(event.currentTarget);
		// const file = formData.get('file') as File;

		function onSuccess(data: ImportData) {
			setImportedData(data);
		}

		function onError() {
			// TODO: Some notification
			setImportedData(null);
		}

		importData({ file, onSuccess, onError });

		// event.preventDefault();
	}

	const formId = "import-data";
	const inputId = "template-file-upload";
	return (
		<div className="flex flex-row gap-2">
			<form id={formId} name={formId} noValidate>
				<input
					accept=".xlsx"
					name="file"
					type="file"
					id={inputId}
					onChange={handleChange}
					className="hidden"
				/>
				<label
					htmlFor={inputId}
					className="rounded-full bg-intavia-brand-700 p-1.5 px-3 py-1.5 text-sm font-normal text-intavia-gray-50
          outline-current hover:bg-intavia-brand-900 focus:outline-2
          focus:outline-offset-2 active:bg-intavia-brand-50 active:text-intavia-gray-900
          disabled:bg-gray-300 disabled:text-gray-600"
				>
					{t(["common", "data-import", "ui", "load-data"])}
					{/* <Button color="accent" size="small" round="pill"></Button> */}
				</label>
			</form>
			<p>{file ? file.name : "Please select an InTaVia Excel Template"}</p>
		</div>
	);
}
