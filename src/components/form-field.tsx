import type { ReactNode } from "react";

interface FormFieldProps {
	children: ReactNode;
}

export function FormField(props: FormFieldProps): JSX.Element {
	const { children } = props;

	return <div className="grid gap-1.5">{children}</div>;
}
