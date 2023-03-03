import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@intavia/ui";

import { useI18n } from "@/app/i18n/use-i18n";
import { useAppSelector } from "@/app/store";
import type { Collection } from "@/app/store/intavia-collections.slice";
import { selectCollections } from "@/app/store/intavia-collections.slice";
import { useCollection } from "@/components/search/collection.context";

export function CollectionSelect(): JSX.Element {
	const { t } = useI18n<"common">();

	const _collections = useAppSelector(selectCollections);
	const { currentCollection, setCurrentCollection } = useCollection();

	const collections = Object.values(_collections);

	function onSelectionChange(id: Collection["id"]) {
		setCurrentCollection(id);
	}

	return (
		<Select
			disabled={collections.length === 0}
			onValueChange={onSelectionChange}
			value={currentCollection ?? undefined}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder={t(["common", "collections", "select-collection"])} />
			</SelectTrigger>
			<SelectContent>
				{collections.map((collection) => {
					return (
						<SelectItem key={collection.id} value={collection.id}>
							{collection.label}
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
}
