import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

import type { FullButtonProperties } from "@/features/ui/Button";
import { getButtonClasses } from "@/features/ui/Button";

export type ButtonLinkProperties = Partial<FullButtonProperties> &
	Pick<FullButtonProperties, "children"> & { href: string };

export default function ButtonLink(props: ButtonLinkProperties): JSX.Element {
	const { href, ...otherProps } = props;
	const { className, children, disabled: _disabled, extraProps } = getButtonClasses(otherProps);

	return (
		<Link
			href={href}
			className={className}
			{...(extraProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
		>
			{children}
		</Link>
	);
}
