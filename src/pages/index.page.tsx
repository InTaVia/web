import {
	ChartBarSquareIcon,
	ChatBubbleOvalLeftEllipsisIcon,
	ChevronRightIcon,
	InformationCircleIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Button, Input } from "@intavia/ui";
import { PageMetadata } from "@stefanprobst/next-page-metadata";
import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { Fragment } from "react";

import { useI18n } from "@/app/i18n/use-i18n";
import { withDictionaries } from "@/app/i18n/with-dictionaries";
import { usePageTitleTemplate } from "@/app/metadata/use-page-title-template";
import { useSearchEntities } from "@/components/search/use-search-entities";
import { useSearchEntitiesFilters } from "@/components/search/use-search-entities-filters";
import IntaviaLogo from "~/public/assets/images/logo.svg";

export const getStaticProps = withDictionaries(["common"]);

export default function HomePage(): JSX.Element {
	const { t } = useI18n<"common">();
	const titleTemplate = usePageTitleTemplate();

	const metadata = { title: t(["common", "home", "metadata", "title"]) };
	const cards = [
		{
			id: "card-dcl",
			title: t(["common", "home", "card-dcl", "title"]),
			text: t(["common", "home", "card-dcl", "text"]),
			href: { pathname: "/search" },
			icon: <MagnifyingGlassIcon className="h-6 w-6" />,
			img: { src: "/assets/images/eu.png", alt: "Data Curation Lab" },
			button: t(["common", "app-bar", "data-curation-lab"]),
		},
		{
			title: t(["common", "home", "card-vas", "title"]),
			text: t(["common", "home", "card-vas", "text"]),
			href: { pathname: "/visual-analytics-studio" },
			icon: <ChartBarSquareIcon className="h-6 w-6" />,
			img: { src: "/assets/images/teaser_vas.png", alt: "Visual Analytics Studio" },
			button: t(["common", "app-bar", "visual-analytics-studio"]),
		},
		{
			title: t(["common", "home", "card-stc", "title"]),
			text: t(["common", "home", "card-stc", "text"]),
			href: { pathname: "/storycreator" },
			icon: <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />,
			img: { src: "/assets/images/teaser_stc.png", alt: "Storytelling Creator" },
			button: t(["common", "app-bar", "story-creator"]),
		},
	];

	return (
		<Fragment>
			<PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
			<div className="flex h-full w-full flex-col justify-between">
				<section className="flex max-h-[500px] min-h-[400px] flex-col place-content-center items-center gap-10 bg-gradient-to-r from-intavia-brand-400 to-intavia-green-400">
					<div className="flex flex-row items-center gap-8">
						<div className="relative h-28 w-32">
							<Link href="/">
								<Image alt="" className="object-contain" fill src={IntaviaLogo} />
							</Link>
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-600">
								{t(["common", "home", "hero", "title"])}
							</h1>
							<h2 className="text-2xl text-gray-600">
								{t(["common", "home", "hero", "subtitle"])}
							</h2>
						</div>
						<Link href="/info">
							<InformationCircleIcon strokeWidth="1.25" className="h-8 w-8" />
						</Link>
					</div>
					<div className="w-full px-96">
						<SearchForm />
					</div>
				</section>
				<section className="flex justify-center gap-x-10">
					{cards.map((card) => {
						return (
							<div
								key={card.title}
								className="flex w-96 max-w-sm flex-col flex-nowrap rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800"
							>
								<Link
									className="flex place-content-center items-center gap-2 pt-3 text-intavia-green-900"
									href={card.href.pathname}
								>
									<div>{card.icon}</div>
									<div className="text-lg font-medium dark:text-white">{card.title}</div>
								</Link>

								<p className="h-full px-5 py-2 text-justify font-normal text-gray-700 dark:text-gray-400">
									{card.text}
								</p>
								<Link
									className="flex w-full place-content-end items-center gap-2 rounded-b-lg bg-intavia-green-50 px-5 py-3 font-medium"
									href={card.href.pathname}
								>
									{card.button}
									<ChevronRightIcon className="h-5 w-5" />
								</Link>
							</div>
						);
					})}
				</section>
				<footer className="flex h-16 place-content-center items-center gap-4 bg-gray-200 px-20 text-gray-900">
					<Image alt="" height={36} src="/assets/images/eu.png" width={55} />
					<p>
						This project has received funding from the European Union&apos;s Horizon 2020 research
						and innovation programme under grant agreement No. 101004825. This website reflects only
						the authors&apos; views and the European Union is not liable for any use that may be
						made of the information contained therein.
					</p>
				</footer>
			</div>
		</Fragment>
	);
}

function SearchForm(): JSX.Element {
	const { t } = useI18n<"common">();

	const searchFilters = useSearchEntitiesFilters();
	const { search } = useSearchEntities();

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		const formData = new FormData(event.currentTarget);

		const searchTerm = formData.get("q") as string;

		search({ ...searchFilters, page: 1, q: searchTerm });

		event.preventDefault();
	}

	return (
		<form
			autoComplete="off"
			className="mx-auto w-full max-w-7xl px-8 py-4"
			name="search"
			noValidate
			onSubmit={onSubmit}
			role="search"
		>
			<div className="grid grid-cols-[1fr_auto_auto] gap-2">
				<Input
					aria-label={t(["common", "search", "search"])}
					className="bg-neutral-50"
					defaultValue={searchFilters.q}
					key={searchFilters.q}
					name="q"
					placeholder={t(["common", "search", "search-term"])}
					type="search"
				/>

				<Button type="submit">{t(["common", "search", "search"])}</Button>
			</div>
		</form>
	);
}
