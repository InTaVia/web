import type { Entity } from "@intavia/api-client";
import {
	Button,
	Dialog,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@intavia/ui";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { useI18n } from "@/app/i18n/use-i18n";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { selectLocalEntities } from "@/app/store/intavia.slice";
import { addEntitiesToCollection } from "@/app/store/intavia-collections.slice";
import { useCollection } from "@/components/search/collection.context";
import { EditEntityDialog } from "@/components/search/edit-entity-dialog";
import { getTranslatedLabel } from "@/lib/get-translated-label";

interface SearchResultProps<T extends Entity> {
	entity: T;
}

export function SearchResult<T extends Entity>(props: SearchResultProps<T>): JSX.Element {
	const { entity: upstreamEntity } = props;

	const { t } = useI18n<"common">();

	const id = upstreamEntity.id;
	const localEntities = useAppSelector(selectLocalEntities);
	const hasLocalEntity = id in localEntities;
	const entity = hasLocalEntity ? (localEntities[id] as T) : upstreamEntity;

	const router = useRouter();
	const detailsUrl = { pathname: `/entities/${encodeURIComponent(entity.id)}` };

	const dispatch = useAppDispatch();
	const { currentCollection } = useCollection();

	const [isDialogOpen, setDialogOpen] = useState(false);

	function onShowDetails() {
		void router.push(detailsUrl);
	}

	function onEditItem() {
		setDialogOpen(true);
	}

	function onAddToCollection() {
		if (currentCollection == null) return;
		dispatch(addEntitiesToCollection({ id: currentCollection, entities: [id] }));
	}

	return (
		<article className="flex items-center justify-between gap-8 px-8 py-2.5">
			<div className="grid gap-1 leading-tight">
				<Link href={detailsUrl}>
					<span>{getTranslatedLabel(entity.label)}</span>
					{hasLocalEntity ? <span> (edited locally)</span> : null}
				</Link>
				<div className="text-xs text-neutral-500">
					{t(["common", "entity", "kinds", entity.kind, "one"])}
				</div>
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="h-8 w-8 p-1" variant="outline">
						<span className="sr-only">Menu</span>
						<MenuIcon className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent className="w-56">
					<DropdownMenuItem onSelect={onShowDetails}>
						{t(["common", "search", "show-details"])}
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={onEditItem}>
						{t(["common", "search", "edit-item"])}
					</DropdownMenuItem>
					<DropdownMenuItem disabled={currentCollection == null} onSelect={onAddToCollection}>
						{t(["common", "search", "add-to-collection"])}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
				<EditEntityDialog
					entity={entity}
					onClose={() => {
						setDialogOpen(false);
					}}
				/>
			</Dialog>
		</article>
	);
}
