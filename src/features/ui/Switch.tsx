import { Switch as HeadlessSwitch } from "@headlessui/react";

interface SwitchProperties {
	value: boolean;
	onChange: (val: boolean) => void;
}

export function Switch(props: SwitchProperties): JSX.Element {
	const { value, onChange } = props;

	return (
		<HeadlessSwitch
			checked={value}
			onChange={onChange}
			className={`${
				value ? "bg-blue-600" : "bg-gray-200"
			} relative inline-flex h-6 w-11 items-center rounded-full`}
		>
			<span
				className={`${
					value ? "translate-x-6" : "translate-x-1"
				} inline-block h-4 w-4 transform rounded-full bg-white transition`}
			/>
		</HeadlessSwitch>
	);
}
