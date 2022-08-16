import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import Button from '@/features/ui/Button';
import { selectModalOpen, setModal } from '@/features/ui/ui.slice';
import { VisualQuerying } from '@/features/visual-querying/VisualQuerying';

export function VisualQueryingModal(): JSX.Element {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector((state) => {
    return selectModalOpen(state, 'visualQueryModal');
  });

  function closeModal() {
    dispatch(setModal({ modal: 'visualQueryModal', isOpen: false }));
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                    <Button round="round" color="accent" onClick={closeModal}>
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
