import type { CSSProperties, ReactNode } from "react";

import styles from "@/features/storycreator/storycreator.module.css";

interface ButtonRowProps {
	children: ReactNode;
	style?: CSSProperties;
}

export function ButtonRow(props: ButtonRowProps): JSX.Element {
	const { children, style } = props;

	return (
		<div className={`${styles["button-row"]}`} style={style}>
			{children}
		</div>
	);
}
