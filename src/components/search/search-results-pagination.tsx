import { cn } from "@intavia/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { LinkProps } from "next/link";
import Link from "next/link";
import type { ReactNode } from "react";

import { useI18n } from "@/app/i18n/use-i18n";
import { useSearchEntities } from "@/components/search/use-search-entities";
import { useSearchEntitiesFilters } from "@/components/search/use-search-entities-filters";
import { useSearchEntitiesResults } from "@/components/search/use-search-entities-results";
import { usePagination } from "@/lib/use-pagination";

export function SearchResultsPagination(): JSX.Element | null {
	const { t } = useI18n<"common">();

	const searchFilters = useSearchEntitiesFilters();
	const searchResults = useSearchEntitiesResults();
	const { getSearchUrl: getSearchParams } = useSearchEntities();

	const { page, pages } = searchResults.data ?? {};
	const pagination = usePagination({ page, pages });

	if (page == null || pages == null || pagination.length <= 1) return null;

	return (
		<nav aria-label={t(["common", "pagination", "pagination"])}>
			<ul className="flex items-center gap-3" role="list">
				<li>
					<PaginationLink
						href={getSearchParams({ ...searchFilters, page: page - 1 })}
						isCurrentPage={page === 1}
						isDisabled={page === 1}
						label={t(["common", "pagination", "go-to-previous-page"])}
					>
						<ChevronLeftIcon className="h-4 w-4" width="1em" />
					</PaginationLink>
				</li>
				{pagination.map((item) => {
					if (item.type === "ellipsis") {
						return (
							<li key={item.position}>
								<span>...</span>
							</li>
						);
					}

					if (item.page === page) {
						return (
							<li key={item.page}>
								<PaginationLink
									href={getSearchParams({ ...searchFilters, page: item.page })}
									isCurrentPage
									isDisabled
									label={t(["common", "pagination", "page"], {
										values: { page: String(item.page) },
									})}
								>
									{item.page}
								</PaginationLink>
							</li>
						);
					}

					return (
						<li key={item.page}>
							<PaginationLink
								href={getSearchParams({ ...searchFilters, page: item.page })}
								label={t(["common", "pagination", "go-to-page"], {
									values: { page: String(item.page) },
								})}
							>
								{item.page}
							</PaginationLink>
						</li>
					);
				})}
				<li>
					<PaginationLink
						href={getSearchParams({ ...searchFilters, page: page + 1 })}
						isCurrentPage={page === pages}
						isDisabled={page === pages}
						label={t(["common", "pagination", "go-to-next-page"])}
					>
						<ChevronRightIcon className="h-4 w-4" width="1em" />
					</PaginationLink>
				</li>
			</ul>
		</nav>
	);
}

interface PaginationLinkProps extends LinkProps {
	children: ReactNode;
	isCurrentPage?: boolean;
	isDisabled?: boolean;
	label: string;
}

function PaginationLink(props: PaginationLinkProps): JSX.Element {
	const {
		children,
		href,
		isCurrentPage = false,
		isDisabled = false,
		label,
		prefetch,
		scroll = true,
		shallow = true,
		...attrs
	} = props;

	const ariaCurrent = isCurrentPage ? "page" : undefined;

	if (isDisabled) {
		return (
			<span
				aria-current={ariaCurrent}
				aria-label={label}
				className={cn("text-neutral-500", isCurrentPage && "underline underline-offset-2")}
				{...attrs}
			>
				{children}
			</span>
		);
	}

	return (
		<Link
			aria-current={ariaCurrent}
			aria-label={label}
			href={href}
			prefetch={prefetch}
			scroll={scroll}
			shallow={shallow}
			{...attrs}
		>
			{children}
		</Link>
	);
}
