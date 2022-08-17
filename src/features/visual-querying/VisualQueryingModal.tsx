import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { usePersonsSearch } from '@/features/entities/use-persons-search';
import { usePersonsSearchFilters } from '@/features/entities/use-persons-search-filters';
import Button from '@/features/ui/Button';
import { selectModalOpen, setModal } from '@/features/ui/ui.slice';
import { VisualQuerying } from '@/features/visual-querying/VisualQuerying';
import type {
  DateConstraint,
  ProfessionConstraint,
  TextConstraint,
} from '@/features/visual-querying/visualQuerying.slice';
import { ConstraintType, selectConstraints } from '@/features/visual-querying/visualQuerying.slice';

export function VisualQueryingModal(): JSX.Element {
  const dispatch = useAppDispatch();
  const constraints = useAppSelector(selectConstraints);

  const searchFilters = usePersonsSearchFilters();
  const { search } = usePersonsSearch();

  const isOpen = useAppSelector((state) => {
    return selectModalOpen(state, 'visualQueryModal');
  });

  function closeModal() {
    dispatch(setModal({ modal: 'visualQueryModal', isOpen: false }));
  }

  function sendQuery() {
    // Get parameters from constraints
    const nameConstraint = constraints.find((constraint) => {
      return constraint.type === ConstraintType.Name;
    });
    const name = nameConstraint ? (nameConstraint as TextConstraint).value : undefined;

    // TODO (samuelbeck): add date-lived-constraint
    const dateOfBirthConstraint = constraints.find((constraint) => {
      return (
        constraint.type === ConstraintType.Dates && constraint.id === 'date-of-birth-constraint'
      );
    });
    const dateOfBirth = dateOfBirthConstraint
      ? (dateOfBirthConstraint as DateConstraint).value
      : undefined;

    const dateOfDeathConstraint = constraints.find((constraint) => {
      return (
        constraint.type === ConstraintType.Dates && constraint.id === 'date-of-death-constraint'
      );
    });
    const dateOfDeath = dateOfDeathConstraint
      ? (dateOfDeathConstraint as DateConstraint).value
      : undefined;

    const professionsConstraint = constraints.find((constraint) => {
      return constraint.type === ConstraintType.Profession;
    });
    const professions =
      (professionsConstraint as ProfessionConstraint | undefined)?.value ?? undefined;

    // TODO (samuelbeck): add place constraints

    // // Clear entities from state
    // dispatch(clearEntities());

    // // Send the query
    // void trigger(
    //   {
    //     q: name ?? undefined,
    //     dateOfBirthStart: dateOfBirth ? dateOfBirth[0] : undefined,
    //     dateOfBirthEnd: dateOfBirth ? dateOfBirth[1] : undefined,
    //     dateOfDeathStart: dateOfDeath ? dateOfDeath[0] : undefined,
    //     dateOfDeathEnd: dateOfDeath ? dateOfDeath[1] : undefined,
    //     professions: JSON.stringify(professions),
    //   },
    //   true,
    // );

    // Write search params in url
    search({
      ...searchFilters,
      page: 1,
      q: name,
      dateOfBirthStart: dateOfBirth ? dateOfBirth[0] : undefined,
      dateOfBirthEnd: dateOfBirth ? dateOfBirth[1] : undefined,
      dateOfDeathStart: dateOfDeath ? dateOfDeath[0] : undefined,
      dateOfDeathEnd: dateOfDeath ? dateOfDeath[1] : undefined,
      professions: professions,
    });

    closeModal();
  }

  function isButtonDisabled(): boolean {
    return !constraints.some((constraint) => {
      return constraint.value !== null && constraint.value !== '';
    });
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
