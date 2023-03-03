import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { useSearchEntities } from "@/components/search/use-search-entities";
import { useSearchEntitiesFilters } from "@/components/search/use-search-entities-filters";
import Button from "@/features/ui/Button";
import { selectModalOpen, setModal } from "@/features/ui/ui.slice";
import { VisualQuerying } from "@/features/visual-querying/VisualQuerying";
import { selectConstraints } from "@/features/visual-querying/visualQuerying.slice";

export function VisualQueryingModal(): JSX.Element {
	const dispatch = useAppDispatch();
	const constraints = useAppSelector(selectConstraints);

	const searchFilters = useSearchEntitiesFilters();
	const { search } = useSearchEntities();

	const isOpen = useAppSelector((state) => {
		return selectModalOpen(state, "visualQueryModal");
	});

	function closeModal() {
		dispatch(setModal({ modal: "visualQueryModal", isOpen: false }));
	}

	function sendQuery() {
		const q = constraints["person-name"].value ?? undefined;
		const [bornAfter, bornBefore] = constraints["person-birth-date"].value?.map((d) => {
			return new Date(d).toISOString();
		}) ?? [undefined, undefined];
		const [diedAfter, diedBefore] = constraints["person-death-date"].value?.map((d) => {
			return new Date(d).toISOString();
		}) ?? [undefined, undefined];
		const occupations_id = constraints["person-occupation"].value ?? undefined;

		search({ ...searchFilters, q, bornAfter, bornBefore, diedAfter, diedBefore, occupations_id });

		closeModal();
	}

	function isButtonDisabled(): boolean {
		return !Object.values(constraints).some((constraint) => {
			return constraint.value !== null && constraint.value !== "";
		});
	}

	return (
		<>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-40" onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
										Visual Query
									</Dialog.Title>

									<VisualQuerying />

									<div className="flex gap-3 pt-3">
										<Button round="round" onClick={closeModal}>
											Cancel
										</Button>
										<Button
											round="round"
											color="accent"
											onClick={sendQuery}
											disabled={isButtonDisabled()}
										>
											Search
										</Button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
