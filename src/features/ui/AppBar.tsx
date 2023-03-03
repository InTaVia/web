import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { cn } from "@intavia/ui";
import Image from "next/image";
import Link from "next/link";

import { useI18n } from "@/app/i18n/use-i18n";
import { usePathname } from "@/app/route/use-pathname";
import IntaviaLogo from "~/public/assets/images/logo.svg";

interface Link {
	id: string;
	href: { pathname: string };
	label: JSX.Element | string;
	current: boolean;
}

export function AppBar(): JSX.Element {
	const { t } = useI18n<"common">();
	const currentPath = usePathname();

	const linksLeft: Array<Link> = [
		{
			id: "data-curation-lab",
			href: { pathname: "/search" },
			label: t(["common", "app-bar", "data-curation-lab"]),
			current: false,
		},
		{
			id: "visual-analytics-studio",
			href: { pathname: "/visual-analytics-studio" },
			label: t(["common", "app-bar", "visual-analytics-studio"]),
			current: false,
		},
		{
			id: "storytelling-creator",
			href: { pathname: "/storycreator" },
			label: t(["common", "app-bar", "story-creator"]),
			current: false,
		},
	];

	const linksRight: Array<Link> = [
		{
			id: "data-import",
			href: { pathname: "/data-import" },
			label: t(["common", "data-import", "ui", "import-data"]),
			current: false,
		},
		{
			id: "info",
			href: { pathname: "/info" },
			label: <InformationCircleIcon strokeWidth="1.25" className="h-8 w-8" />,
			current: false,
		},
	];

	const currentLink = linksLeft.concat(linksRight).find((link) => {
		return link.href.pathname === currentPath;
	});
	if (currentLink) {
		currentLink.current = true;
	}

	return (
		<div className="h-16 w-full bg-white">
			<div className="flex flex-row flex-nowrap justify-between">
				<div className="flex flex-row items-center gap-2">
					<div className="relative h-14 w-32">
						<Link href="/">
							<Image alt="" className="object-contain" fill src={IntaviaLogo} />
						</Link>
					</div>
					<div className="flex h-16 flex-row items-center gap-3">
						{linksLeft.map((item) => {
							return (
								<Link
									key={item.id}
									href={item.href.pathname}
									className={cn(
										item.current ? "text-intavia-brand-900" : "text-black",
										"px-3 text-base hover:text-intavia-brand-900",
									)}
									aria-current={item.current ? "page" : undefined}
								>
									{item.label}
								</Link>
							);
						})}
					</div>
				</div>
				<div className="flex h-16 flex-row items-center gap-6 pr-6">
					{linksRight.map((item) => {
						return (
							<Link
								key={item.id}
								href={item.href.pathname}
								className={cn(
									item.current ? "text-intavia-brand-900" : "text-black",
									"px-3 text-base hover:text-intavia-brand-900",
								)}
								aria-current={item.current ? "page" : undefined}
							>
								{item.label}
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
