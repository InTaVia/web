import { TrashIcon } from "@heroicons/react/24/outline";

import { useAppDispatch } from "@/app/store";
import { Button } from "@intavia/ui";
import type {
	Constraint,
	PersonBirthDateConstraint,
	PersonDeathDateConstraint,
	PersonNameConstraint,
	PersonOccupationConstraint,
} from "@/features/visual-querying/constraints.types";
import { DateConstraintWidget } from "@/features/visual-querying/DateConstraintWidget";
import { ProfessionConstraintWidget } from "@/features/visual-querying/ProfessionConstraintWidget";
import { TextConstraintWidget } from "@/features/visual-querying/TextConstraintWidget";
import { setConstraintValue } from "@/features/visual-querying/visualQuerying.slice";

interface ConstraintContainerHeaderProps {
	constraint: Constraint;
	setSelectedConstraint: (constraintId: string | null) => void;
}

interface ConstraintContainerProps {
	position: { x: number; y: number };
	constraint: Constraint;
	setSelectedConstraint: (constraintId: string | null) => void;
}

function ConstraintContainerHeader(props: ConstraintContainerHeaderProps): JSX.Element {
	const { constraint, setSelectedConstraint } = props;

	const dispatch = useAppDispatch();

	function confirmDeleteConstraint() {
		const confirmation = confirm(`Do you want to delete the ${constraint.id} constraint?`);
		if (confirmation) {
			dispatch(setConstraintValue({ ...constraint, value: null }));
			setSelectedConstraint(null);
		}
	}

	function renderTypeSpecificHeader(): JSX.Element {
		switch (constraint.kind.id) {
			case "date-range":
				if (constraint.value !== null) {
					return (
						<>
							<p className="text-base text-intavia-brand-700">
								{new Date(constraint.value[0]).getFullYear()}
							</p>
							<p className="text-base text-intavia-gray-700">-</p>
							<p className="text-base text-intavia-brand-700">
								{new Date(constraint.value[1]).getFullYear()}
							</p>
						</>
					);
				}
				return <></>;
			default:
				return <></>;
		}
	}

	return (
		<div className="flex h-12 w-full flex-row items-center justify-between bg-intavia-gray-50">
			<div className="h-content justify-left flex flex-row items-center gap-2">
				<p className="ml-3 mr-4 text-lg">{constraint.label.default}</p>
				{renderTypeSpecificHeader()}
			</div>

			<Button
				round="circle"
				size="small"
				className="mr-3"
				color="warning"
				onClick={confirmDeleteConstraint}
				disabled={constraint.value === null || constraint.value === ""}
			>
				<TrashIcon className="h-5 w-5" />
			</Button>
		</div>
	);
}

export function ConstraintContainer(props: ConstraintContainerProps): JSX.Element {
	const { constraint, position, setSelectedConstraint } = props;

	function renderWidget(): JSX.Element {
		switch (constraint.kind.id) {
			case "date-range":
				return (
					<DateConstraintWidget
						width={400}
						height={200}
						constraint={constraint as PersonBirthDateConstraint | PersonDeathDateConstraint}
					/>
				);
			case "label":
				return (
					<TextConstraintWidget
						constraint={constraint as PersonNameConstraint}
						setSelectedConstraint={setSelectedConstraint}
					/>
				);
			// case 'geometry':
			//   return <PlaceConstraintWidget width={550} height={350} constraint={constraint} />;
			case "vocabulary":
				return (
					<ProfessionConstraintWidget
						width={300}
						height={400}
						constraint={constraint as PersonOccupationConstraint}
					/>
				);
		}
	}

	return (
		<div
			className="absolute text-clip rounded-md border bg-white"
			style={{ left: position.x, top: position.y }}
		>
			<ConstraintContainerHeader
				constraint={constraint}
				setSelectedConstraint={setSelectedConstraint}
			/>
			{renderWidget()}
		</div>
	);
}
