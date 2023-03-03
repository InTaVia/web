import { ChevronUpIcon } from "@heroicons/react/24/outline";

export interface AllotmentHeaderProps {
	title?: string;
	onClick?: () => void;
	open?: boolean;
}

export default function AllotmentHeader(props: AllotmentHeaderProps): JSX.Element {
	const { title, onClick, open } = props;
	return (
		<div className="flex h-6 w-full items-center justify-between bg-intavia-brand-100 p-2 text-intavia-gray-700">
			<div>{title}</div>
			<div className="flex">
				<button className="h-full bg-transparent">
					<ChevronUpIcon
						onClick={onClick}
						className={`${open === true ? "rotate-180" : ""} h-5 w-5 text-intavia-brand-800`}
					/>
				</button>
			</div>
		</div>
	);
}
