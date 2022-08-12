import { Dialog } from '@headlessui/react';

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
    <Dialog as="div" open={isOpen} onClose={closeModal}>
      <Dialog.Panel className="relative h-96 w-96 overflow-hidden ">
        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
          Visual Query
        </Dialog.Title>

        <VisualQuerying />

        <Button onClick={closeModal}>Search</Button>
        <Button onClick={closeModal}>Cancel</Button>
      </Dialog.Panel>
    </Dialog>
  );
}
