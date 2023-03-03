import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

import { useAppDispatch } from "@/app/store";
import { Input, Button } from "@intavia/ui";
import type { PersonNameConstraint } from "@/features/visual-querying/constraints.types";
import { setConstraintValue } from "@/features/visual-querying/visualQuerying.slice";

interface TextConstraintWidgetProps {
	constraint: PersonNameConstraint;
	setSelectedConstraint: (constraintId: string | null) => void;
}

export function TextConstraintWidget(props: TextConstraintWidgetProps): JSX.Element {
	const { constraint, setSelectedConstraint } = props;

	const dispatch = useAppDispatch();

	const [text, setText] = useState(constraint.value);

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		dispatch(setConstraintValue({ ...constraint, value: text }));

		setSelectedConstraint(null);

		event.preventDefault();
	}

	return (
		<form onSubmit={onSubmit} className="flex justify-center gap-2 p-2">
			<Input
				placeholder="Please enter a name"
				value={text ?? ""}
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					return setText(e.target.value);
				}}
				autoFocus={true}
			/>
			<Button disabled={text === ""}>Add</Button>
		</form>
	);
}
