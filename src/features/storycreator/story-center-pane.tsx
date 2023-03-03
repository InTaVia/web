import "~/node_modules/react-grid-layout/css/styles.css";
import "~/node_modules/react-resizable/css/styles.css";

import type { Entity, Event } from "@intavia/api-client/dist/models";
import { toPng } from "html-to-image";
import { useRef, useState } from "react";
import ReactResizeDetector from "react-resize-detector";
import type { StringLiteral } from "typescript";

import { useI18n } from "@/app/i18n/use-i18n";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { selectEntities, selectEvents } from "@/app/store/intavia.slice";
import type { ComponentProperty } from "@/features/common/component-property";
import { PropertiesDialog } from "@/features/common/properties-dialog";
import type { Visualization } from "@/features/common/visualization.slice";
import { selectAllVisualizations } from "@/features/common/visualization.slice";
import type { ContentPane, ContentSlotId } from "@/features/storycreator/contentPane.slice";
import {
	addContentToContentPane,
	createContentPane,
	selectAllConentPanes,
} from "@/features/storycreator/contentPane.slice";
import { SlideEditor } from "@/features/storycreator/SlideEditor";
import StroyCreatorToolbar from "@/features/storycreator/story-creator-toolbar";
import { usePostStoryMutation } from "@/features/storycreator/story-suite-api.service";
import type { Slide, Story } from "@/features/storycreator/storycreator.slice";
import {
	editStory,
	selectSlidesByStoryID,
	setContentPaneToSlot,
	setImage,
	setLayoutForSlide,
} from "@/features/storycreator/storycreator.slice";
import type { PanelLayout } from "@/features/ui/analyse-page-toolbar/layout-popover";
import { Button } from "@intavia/ui";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTrigger,
	DialogHeader,
	DialogTitle,
} from "@intavia/ui";
import type { UiWindow } from "@/features/ui/ui.slice";
import { selectWindows } from "@/features/ui/ui.slice";
import { useDialogState } from "@/features/ui/use-dialog-state";
import type {
	LayoutPaneContent,
	LayoutTemplateItem,
} from "@/features/visualization-layouts/visualization-group";
import { layoutTemplates } from "@/features/visualization-layouts/visualization-group";

interface StoryCenterPaneProps {
	story: Story;
	desktop: boolean;
	onDesktopChange: (desktop: boolean) => void;
	timescale: boolean;
	onTimescaleChange: (timescale: boolean) => void;
}

interface StoryViewerResponse {
	url: string;
}

export function StoryCenterPane(props: StoryCenterPaneProps): JSX.Element {
	const { story, desktop, onDesktopChange, timescale, onTimescaleChange } = props;

	const { t } = useI18n<"common">();

	const dispatch = useAppDispatch();

	const slides = useAppSelector((state) => {
		return selectSlidesByStoryID(state, story.id);
	});

	const filteredSlides = slides.filter((slide: Slide) => {
		return slide.selected;
	});
	const selectedSlide = filteredSlides.length > 0 ? filteredSlides[0] : slides[0];

	const ref = useRef<HTMLDivElement>(null);

	const [propertiesEditElement, setPropertiesEditElement] = useState<any | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const dialog = useDialogState();

	const handleSaveEdit = (newStory: Story) => {
		dispatch(editStory(newStory));
	};

	const [postStory] = usePostStoryMutation();

	const handleCloseEditDialog = () => {
		setPropertiesEditElement(null);
	};

	const setSlideThumbnail = function () {
		if (ref.current === null) {
			return;
		}

		toPng(ref.current, { cacheBust: true })
			.then((dataUrl) => {
				dispatch(setImage({ slide: selectedSlide, image: dataUrl }));
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const addContentPane = (slotId: StringLiteral, contentToAddType: string | undefined) => {
		const contId = `contentPane-${Math.random()
			.toString(36)
			.replace(/[^a-z]+/g, "")
			.substring(0, 4)}`;

		dispatch(setContentPaneToSlot({ id: contId, slotId: slotId, slide: selectedSlide }));
		dispatch(createContentPane({ id: contId }));

		if (contentToAddType !== undefined) {
			addContent(contentToAddType, {}, contId);
		}
	};

	const checkForEmptyContentPaneSlots = (
		layoutTemplate: any,
		contentToAddType: string | undefined = undefined,
	) => {
		for (const [key, value] of Object.entries(layoutTemplate)) {
			if (key !== "cols" && key !== "rows") {
				if (layoutTemplate.type === "contentPane") {
					const contentPaneSlots = selectedSlide!.contentPaneSlots;
					const slotId = layoutTemplate.id as ContentSlotId;
					if (contentPaneSlots[slotId] === null) {
						addContentPane(layoutTemplate.id, contentToAddType);
					}
				}
			} else {
				(value as Array<LayoutTemplateItem>).map((item: LayoutTemplateItem) => {
					checkForEmptyContentPaneSlots(item, contentToAddType);
				});
			}
		}
	};

	const onLayoutSelected = (i_layout: PanelLayout) => {
		checkForEmptyContentPaneSlots(layoutTemplates[i_layout] as LayoutPaneContent);
		dispatch(setLayoutForSlide({ slide: selectedSlide, layout: i_layout }));
	};

	const windows = useAppSelector(selectWindows);

	const addContent = (type: string, i_layoutItem: any, i_targetPane: string | undefined) => {
		const layoutItem = i_layoutItem;

		let targetPane = i_targetPane;
		if (targetPane === undefined) {
			targetPane = "contentPane0";
		}

		const ids = windows.map((window: UiWindow) => {
			return window.i;
		});

		let counter = 1;
		const text = type;
		let newText = text;
		while (ids.includes(newText)) {
			newText = text + " (" + counter + ")";
			counter++;
		}
		layoutItem["i"] = newText;
		layoutItem["type"] = type;

		switch (type) {
			case "Image":
				layoutItem["h"] = 4;
				layoutItem["w"] = 1;
				break;
			case "Quiz":
				layoutItem["h"] = 2;
				layoutItem["w"] = 1;
				break;
			case "Video/Audio":
				layoutItem["h"] = 2;
				layoutItem["w"] = 1;
				break;
			default:
				layoutItem["h"] = 1;
				layoutItem["w"] = 1;
				break;
		}

		dispatch(
			addContentToContentPane({
				story: selectedSlide?.story,
				slide: selectedSlide?.id,
				contentPane: targetPane,
				layout: {
					x: layoutItem["x"],
					y: layoutItem["y"],
					w: layoutItem["w"],
					h: layoutItem["h"],
				},
				type: layoutItem["type"],
				key: newText,
			}),
		);
	};

	const increaseNumberOfContentPanes = (contentToAddType: string | undefined) => {
		const layout = selectedSlide!.layout;

		const newLayout = (layout + "-content") as PanelLayout;
		if (Object.keys(layoutTemplates).includes(newLayout)) {
			checkForEmptyContentPaneSlots(
				layoutTemplates[newLayout] as LayoutPaneContent,
				contentToAddType,
			);
			dispatch(setLayoutForSlide({ slide: selectedSlide, layout: newLayout }));
		}
	};

	setSlideThumbnail();

	const allVisualizations = useAppSelector(selectAllVisualizations);
	const allContentPanes = useAppSelector(selectAllConentPanes);
	const allEntities = useAppSelector(selectEntities);
	const allEvents = useAppSelector(selectEvents);

	/* const storyObject = useMemo(() => {
    const storyVisualizations: Record<string, Visualization> = {};
    const storyContentPanes: Record<string, ContentPane> = {};
    const storyEntityIds = [];
    const storyEventIds: Array<string> = [];

    Object.values(story.slides).forEach((slide) => {
      for (const visID of Object.values(slide.visualizationSlots)) {
        if (visID != null) {
          const vis = allVisualizations[visID] as Visualization;
          storyVisualizations[visID] = vis;
          storyEntityIds.push(...vis.entityIds);
          storyEventIds.push(...vis.eventIds);
        }
      }
      for (const contID of Object.values(slide.contentPaneSlots)) {
        if (contID != null) {
          storyContentPanes[contID] = allContentPanes[contID] as ContentPane;
        }
      }
    });

    const slideOutput = Object.fromEntries(
      Object.values(story.slides).map((s) => {
        const ret = { ...s };
        delete ret.image;
        return [ret.id, ret];
      }),
    );

    const storyEvents = Object.fromEntries(
      storyEventIds
        .filter((key) => {
          return key in allEvents;
        })
        .map((key) => {
          return [key, allEvents[key]];
        }),
    );

    const linkedEntities = (Object.values(storyEvents) as Array<Event>).flatMap((event: Event) => {
      return event.relations.map((relation) => {
        return relation.entity;
      });
    });

    storyEntityIds.push(...linkedEntities);

    const storyEntities = Object.fromEntries(
      storyEntityIds
        .filter((key) => {
          return key in allEntities;
        })
        .map((key) => {
          return [key, allEntities[key]];
        }),
    );


    return {
      ...story,
      slides: slideOutput,
      visualizations: storyVisualizations,
      contentPanes: storyContentPanes,
      storyEntities: storyEntities,
      storyEvents: storyEvents,
    };
  }, [story, allContentPanes, allVisualizations]); */

	const [storyExportObject, setStoryExportObject] = useState<{
		slides: Record<string, Slide>;
		visualizations: Record<string, Visualization>;
		contentPanes: Record<string, ContentPane>;
		properties: Record<string, ComponentProperty>;
		storyEntities: Record<string, Entity>;
		storyEvents: Record<string, Event>;
	}>();

	const createStoryObject = () => {
		const storyVisualizations: Record<string, Visualization> = {};
		const storyContentPanes: Record<string, ContentPane> = {};
		const storyEntityIds = [];
		const storyEventIds: Array<string> = [];

		Object.values(story.slides).forEach((slide) => {
			for (const visID of Object.values(slide.visualizationSlots)) {
				if (visID != null) {
					const vis = allVisualizations[visID] as Visualization;
					storyVisualizations[visID] = vis;
					storyEntityIds.push(...vis.entityIds);
					storyEventIds.push(...vis.eventIds);
				}
			}
			for (const contID of Object.values(slide.contentPaneSlots)) {
				if (contID != null) {
					storyContentPanes[contID] = allContentPanes[contID] as ContentPane;
				}
			}
		});

		const slideOutput: Record<string, Slide> = Object.fromEntries(
			Object.values(story.slides).map((s) => {
				const ret = { ...s };
				delete ret.image;
				return [ret.id, ret];
			}),
		);

		const storyEvents = Object.fromEntries(
			storyEventIds
				.filter((key) => {
					return key in allEvents;
				})
				.map((key) => {
					return [key, allEvents[key] as Event];
				}),
		);

		const linkedEntities = (Object.values(storyEvents) as Array<Event>).flatMap((event: Event) => {
			return event.relations.map((relation) => {
				return relation.entity;
			});
		});

		storyEntityIds.push(...linkedEntities);

		const storyEntities = Object.fromEntries(
			storyEntityIds
				.filter((key) => {
					return key in allEntities;
				})
				.map((key) => {
					return [key, allEntities[key] as Entity];
				}),
		);

		setStoryExportObject({
			...story,
			slides: slideOutput,
			visualizations: storyVisualizations,
			contentPanes: storyContentPanes,
			storyEntities: storyEntities,
			storyEvents: storyEvents,
		});
	};

	return (
		<div className="grid h-full w-full grid-rows-[max-content_1fr]">
			<StroyCreatorToolbar
				onLayoutSelected={onLayoutSelected}
				desktop={desktop}
				onDesktopChange={onDesktopChange}
				timescale={timescale}
				onTimescaleChange={onTimescaleChange}
				onExportStory={() => {
					createStoryObject();
					dialog.open();
				}}
				onOpenSettingsDialog={() => {
					setPropertiesEditElement(story);
				}}
			/>
			<ReactResizeDetector key="test" handleWidth handleHeight>
				{({ width, height }) => {
					const aspectRatio = 3 / 4;
					let newWidth;
					if (height !== undefined) {
						newWidth = desktop ? width : aspectRatio * height;
					} else {
						newWidth = "unset";
					}
					return (
						<div className="grid h-full w-full grid-cols-1 justify-items-center">
							<div className="h-full border border-intavia-gray-300" style={{ width: newWidth }}>
								<SlideEditor
									slide={selectedSlide as Slide}
									imageRef={ref}
									layout={selectedSlide!.layout}
									desktop={desktop}
									timescale={timescale}
									increaseNumberOfContentPanes={increaseNumberOfContentPanes}
									addContent={addContent}
								/>
							</div>
						</div>
					);
				}}
			</ReactResizeDetector>
			{propertiesEditElement != null && (
				<PropertiesDialog
					onClose={handleCloseEditDialog}
					element={propertiesEditElement}
					onSave={handleSaveEdit}
				/>
			)}
			{dialog.isOpen && (
				<Dialog dialog={dialog} title="Export Story">
					<DialogContent>
						<form
							id={"storyExportDialog"}
							name={"storyExportDialog"}
							noValidate
							onSubmit={(event) => {
								event.preventDefault();
								postStory(storyExportObject)
									.unwrap()
									.then((fulfilled: any) => {
										const response = { ...fulfilled } as StoryViewerResponse;
										const url = response.url;
										setPreviewUrl(url);
									})
									.catch((rejected: unknown) => {
										console.error(rejected);
									});
							}}
						>
							<textarea
								id="message"
								rows={6}
								className="dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
								defaultValue={JSON.stringify(storyExportObject, null, 2)}
							></textarea>
						</form>
					</DialogContent>
					<DialogControls>
						<Button
							size="small"
							round="round"
							shadow="small"
							color="warning"
							onClick={dialog.close}
						>
							{t(["common", "form", "cancel"])}
						</Button>
						<a
							href={`data:text/json;charset=utf-8,${encodeURIComponent(
								JSON.stringify(storyExportObject, null, 2),
							)}`}
							download={`${story.properties.name?.value ?? story.id}.istory.json`}
						>
							<Button size="small" round="round" shadow="small" color="accent">
								Download
							</Button>
						</a>
						<Button
							size="small"
							round="round"
							shadow="small"
							color="accent"
							form={"storyExportDialog"}
							type="submit"
						>
							{t(["common", "form", "submit"])}
						</Button>
						{previewUrl !== null && (
							<a target="_blank" href={previewUrl} rel="noreferrer">
								<Button size="small" round="round" shadow="small" color="accent">
									Preview
								</Button>
							</a>
						)}
					</DialogControls>
				</Dialog>
			)}
		</div>
	);
}
