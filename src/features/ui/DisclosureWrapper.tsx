import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

interface DisclosureWrapperProps {
	defaultOpen?: boolean;
	title: string;
	children?: ReactNode;
}

export default function DisclosureWrapper(props: DisclosureWrapperProps): JSX.Element {
	const { defaultOpen = false, title, children } = props;
	return (
		<Disclosure
			as="div"
			className="grid h-full grid-rows-[max-content_1fr] overflow-auto"
			key={`disclosure${title}`}
			defaultOpen={defaultOpen}
		>
			{({ open }) => {
				return (
					<>
						<Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
							<span>{title}</span>
							<ChevronUpIcon className={`${!open ? "rotate-180" : ""} h-5 w-5 text-purple-500`} />
						</Disclosure.Button>
						<Disclosure.Panel className="h-full overflow-auto px-4 pt-4 pb-2 text-sm text-gray-500">
							{children}
						</Disclosure.Panel>
					</>
				);
			}}
		</Disclosure>
	);
}
