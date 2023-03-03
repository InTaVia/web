import { cn } from "@intavia/ui";
import type { ReactNode } from "react";

import { useI18n } from "@/app/i18n/use-i18n";

interface NothingFoundMessageProps {
	children?: ReactNode;
	className?: string;
}

export function NothingFoundMessage(props: NothingFoundMessageProps): JSX.Element {
	const { children, className } = props;

	const { t } = useI18n<"common">();

	return (
		<div className={cn("text-neutral-500", className)}>
			{children ?? t(["common", "search", "nothing-found"])}
		</div>
	);
}
