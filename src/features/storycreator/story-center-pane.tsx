import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import type { Entity, Event } from '@intavia/api-client/dist/models';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@intavia/ui';
import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';
import ReactResizeDetector from 'react-resize-detector';
import type { StringLiteral } from 'typescript';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  selectEntities,
  selectEvents,
  selectMediaResources,
  selectVocabularyEntries,
} from '@/app/store/intavia.slice';
import type { Collection } from '@/app/store/intavia-collections.slice';
import { selectCollections } from '@/app/store/intavia-collections.slice';
import type { ComponentProperty } from '@/features/common/component-property';
import { PropertiesDialog } from '@/features/common/properties-dialog';
import { getEventKindPropertiesById } from '@/features/common/visualization.config';
import type { Visualization } from '@/features/common/visualization.slice';
import { selectAllVisualizations } from '@/features/common/visualization.slice';
import type { ContentPane, ContentSlotId } from '@/features/storycreator/contentPane.slice';
import {
  addContentToContentPane,
  createContentPane,
  selectAllConentPanes,
} from '@/features/storycreator/contentPane.slice';
import { SlideEditor } from '@/features/storycreator/SlideEditor';
import StroyCreatorToolbar from '@/features/storycreator/story-creator-toolbar';
import { usePostStoryMutation } from '@/features/storycreator/story-suite-api.service';
import type { Slide, Story } from '@/features/storycreator/storycreator.slice';
import {
  createSlide,
  editStory,
  selectSlidesByStoryID,
  setContentPaneToSlot,
  setImage,
  setLayoutForSlide,
} from '@/features/storycreator/storycreator.slice';
import type { PanelLayout } from '@/features/ui/analyse-page-toolbar/layout-popover';
import type { UiWindow } from '@/features/ui/ui.slice';
import { selectWindows } from '@/features/ui/ui.slice';
import type {
  LayoutPaneContent,
  LayoutTemplateItem,
} from '@/features/visualization-layouts/visualization-group';
import { layoutTemplates } from '@/features/visualization-layouts/visualization-group';

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

  const { t } = useI18n<'common'>();

  const dispatch = useAppDispatch();

  const slides = useAppSelector((state) => {
    return selectSlidesByStoryID(state, story.id);
  });

  const vocabularies = useAppSelector(selectVocabularyEntries);

  const collections = useAppSelector(selectCollections);

  const mediaRessources = useAppSelector(selectMediaResources);

  const filteredSlides = slides.filter((slide: Slide) => {
    return slide.selected;
  });
  const selectedSlide = filteredSlides.length > 0 ? filteredSlides[0] : slides[0] ?? null;

  const ref = useRef<HTMLDivElement>(null);

  const [propertiesEditElement, setPropertiesEditElement] = useState<any | null>(null);
  const [previewStatus, setPreviewStatus] = useState<'default' | 'error' | 'loading'>('default');

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleSaveEdit = (newStory: Story) => {
    dispatch(editStory(newStory));
  };

  const [postStory] = usePostStoryMutation();

  const handleCloseEditDialog = () => {
    setPropertiesEditElement(null);
  };

  const setSlideThumbnail = function () {
    if (ref.current === null || selectedSlide === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true, canvasWidth: 200, canvasHeight: 100 })
      .then((dataUrl) => {
        dispatch(setImage({ slide: selectedSlide, image: dataUrl }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addContentPane = (slotId: StringLiteral, contentToAddType: string | undefined) => {
    if (selectedSlide === null) {
      return;
    }

    const contId = `contentPane-${Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
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
      if (key !== 'cols' && key !== 'rows') {
        if (layoutTemplate.type === 'contentPane') {
          const contentPaneSlots = selectedSlide
            ? selectedSlide.contentPaneSlots
            : ({} as Record<ContentSlotId, string | null>);
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
    if (selectedSlide === null) {
      return;
    }
    checkForEmptyContentPaneSlots(layoutTemplates[i_layout] as LayoutPaneContent);
    dispatch(setLayoutForSlide({ slide: selectedSlide, layout: i_layout }));
  };

  const windows = useAppSelector(selectWindows);

  const addContent = (type: string, i_layoutItem: any, i_targetPane: string | undefined) => {
    const layoutItem = i_layoutItem;

    let targetPane = i_targetPane;
    if (targetPane === undefined) {
      targetPane = 'contentPane0';
    }

    const ids = windows.map((window: UiWindow) => {
      return window.i;
    });

    let counter = 1;
    const text = type;
    let newText = text;
    while (ids.includes(newText)) {
      newText = text + ' (' + counter + ')';
      counter++;
    }
    layoutItem['i'] = newText;
    layoutItem['type'] = type;

    switch (type) {
      case 'Image':
        layoutItem['h'] = 4;
        layoutItem['w'] = 1;
        break;
      case 'Quiz':
        layoutItem['h'] = 3;
        layoutItem['w'] = 1;
        break;
      case 'Video/Audio':
        layoutItem['h'] = 3;
        layoutItem['w'] = 1;
        break;
      case 'Title':
        layoutItem['h'] = 8;
        layoutItem['w'] = 1;
        break;
      default:
        layoutItem['h'] = 3;
        layoutItem['w'] = 1;
        break;
    }

    dispatch(
      addContentToContentPane({
        story: selectedSlide?.story,
        slide: selectedSlide?.id,
        contentPane: targetPane,
        layout: {
          x: layoutItem['x'],
          y: layoutItem['y'],
          w: layoutItem['w'],
          h: layoutItem['h'],
        },
        type: layoutItem['type'],
        key: newText,
      }),
    );
  };

  const addContentWithData = (
    type: string,
    data: any,
    i_layoutItem: any,
    i_targetPane: string | undefined,
  ) => {
    const layoutItem = i_layoutItem;

    let targetPane = i_targetPane;
    if (targetPane === undefined) {
      targetPane = 'contentPane0';
    }

    const ids = windows.map((window: UiWindow) => {
      return window.i;
    });

    let counter = 1;
    const text = type;
    let newText = text;
    while (ids.includes(newText)) {
      newText = text + ' (' + counter + ')';
      counter++;
    }
    layoutItem['i'] = newText;
    layoutItem['type'] = type;

    switch (type) {
      case 'Entity':
        layoutItem['h'] = 4;
        layoutItem['w'] = 1;
        break;
      default:
        layoutItem['h'] = 1;
        layoutItem['w'] = 1;
        break;
    }

    dispatch(
      addContentToContentPane({
        story: selectedSlide?.story,
        slide: selectedSlide?.id,
        contentPane: targetPane,
        layout: {
          x: layoutItem['x'],
          y: layoutItem['y'],
          w: layoutItem['w'],
          h: layoutItem['h'],
        },
        type: layoutItem['type'],
        key: newText,
      }),
    );
  };

  const increaseNumberOfContentPanes = (contentToAddType: string | undefined) => {
    if (selectedSlide === null) {
      return;
    }

    const layout = selectedSlide!.layout;

    const newLayout = (layout + '-content') as PanelLayout;
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

  const createStoryObject = (preview: boolean) => {
    const storyVisualizations: Record<string, Visualization> = {};
    const storyContentPanes: Record<string, ContentPane> = {};
    const storyEntityIds = [] as Array<Entity['id']>;
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
        if (preview) {
          delete ret.image;
        }
        return [ret.id, ret];
      }),
    );

    const linkedEvents = storyEntityIds.flatMap((entityId: Entity['id']) => {
      return allEntities[entityId]?.relations.map((relation) => {
        return relation.event;
      });
    });

    const combinedStoryEventIds = [...linkedEvents, ...storyEventIds];

    const storyEvents = Object.fromEntries(
      combinedStoryEventIds
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

    const storyCollections = Object.fromEntries(
      Object.keys(collections)
        .filter((key) => {
          return (
            collections[key].entities.filter((value) => {
              return Object.keys(storyEntities).includes(value);
            }).length > 0 ||
            collections[key].events.filter((value) => {
              return Object.keys(storyEvents).includes(value);
            }).length > 0
          );
        })
        .map((key) => {
          return [key, collections[key] as Collection];
        }),
    );

    const storyMediaIds = Object.values(storyEntities)
      .filter((entity) => {
        return entity.media != null && entity.media.length > 0;
      })
      .flatMap((entity) => {
        return entity.media;
      }) as Array<string>;

    const storyMedias = Object.fromEntries(
      storyMediaIds
        .filter((key) => {
          return key in mediaRessources;
        })
        .map((key) => {
          return [key, mediaRessources[key] as MediaResource];
        }),
    );

    const storyVocabulary = {};
    const storyEventLocations = {};

    for (const event of Object.values(storyEvents) as Array<Event>) {
      // event.kind
      storyVocabulary[event.kind] = getEventKindPropertiesById(event.kind);

      //relation roles
      for (const rel of event.relations) {
        if (rel.role in vocabularies) {
          storyVocabulary[rel.role] = vocabularies[rel.role]?.label.default;
        }

        // related event might be a place
        if (allEntities[rel.entity] != null && allEntities[rel.entity]?.kind === 'place') {
          console.log(allEntities[rel.entity], allEntities[rel.entity].geometry);
          if (allEntities[rel.entity].geometry != null) {
            console.log('found', allEntities[rel.entity]);
            if (event.id in storyEventLocations) {
              storyEventLocations[event.id].push({
                geometry: allEntities[rel.entity].geometry,
                label: allEntities[rel.entity]?.label.default,
              });
            } else {
              storyEventLocations[event.id] = [
                {
                  geometry: allEntities[rel.entity].geometry,
                  label: allEntities[rel.entity]?.label.default,
                },
              ];
            }
          }
        }
      }
    }

    return {
      ...story,
      slides: slideOutput,
      visualizations: storyVisualizations,
      contentPanes: storyContentPanes,
      storyEntities: storyEntities,
      storyEvents: storyEvents,
      collections: storyCollections,
      media: storyMedias,
      vocabulary: storyVocabulary,
      storyEventLocations: storyEventLocations,
    };
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
          setStoryExportObject(createStoryObject());
          setDialogOpen(true);
        }}
        onOpenSettingsDialog={() => {
          setPropertiesEditElement(story);
        }}
        onPreviewStory={() => {
          setPreviewStatus('loading');
          postStory(createStoryObject(true))
            .unwrap()
            .then((fulfilled: any) => {
              const response = { ...fulfilled } as StoryViewerResponse;
              const url = response.url;
              window.open(url, '_newtab' + Date.now());
              setPreviewStatus('default');
            })
            .catch((rejected: unknown) => {
              setPreviewStatus('error');
            });
        }}
        previewStatus={previewStatus}
      />
      <ReactResizeDetector key="test" handleWidth handleHeight>
        {({ width, height }) => {
          const aspectRatio = 3 / 4;
          let newWidth;
          if (height !== undefined) {
            newWidth = desktop ? width : aspectRatio * height;
          } else {
            newWidth = 'unset';
          }

          return (
            <div className="grid h-full w-full grid-cols-1 justify-items-center">
              <div className="h-full border border-intavia-neutral-300" style={{ width: newWidth }}>
                {selectedSlide ? (
                  <SlideEditor
                    slide={selectedSlide as Slide}
                    imageRef={ref}
                    layout={selectedSlide!.layout}
                    desktop={desktop}
                    timescale={timescale}
                    increaseNumberOfContentPanes={increaseNumberOfContentPanes}
                    addContent={addContent}
                    checkForEmptyContentPaneSlots={checkForEmptyContentPaneSlots}
                  />
                ) : (
                  <div className="flex justify-center">Please add at least one slide!</div>
                )}
              </div>
            </div>
          );
        }}
      </ReactResizeDetector>

      {propertiesEditElement != null && (
        <Dialog open={propertiesEditElement != null} onOpenChange={handleCloseEditDialog}>
          <PropertiesDialog
            onClose={handleCloseEditDialog}
            element={propertiesEditElement}
            onSave={handleSaveEdit}
          />
        </Dialog>
      )}

      {isDialogOpen && (
        <Dialog
          open={isDialogOpen}
          onOpenChange={() => {
            setDialogOpen(false);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Story</DialogTitle>
            </DialogHeader>

            <form id={'storyExportDialog'} name={'storyExportDialog'} noValidate>
              <textarea
                id="message"
                rows={6}
                className="dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder:text-neutral-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 block w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2.5 text-sm text-neutral-900 focus:border-blue-500 focus:ring-blue-500"
                defaultValue={JSON.stringify(storyExportObject, null, 2)}
              ></textarea>
            </form>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                }}
              >
                {t(['common', 'form', 'cancel'])}
              </Button>

              <a
                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(storyExportObject, null, 2),
                )}`}
                download={`${story.properties.name?.value ?? story.id}.istory.json`}
              >
                <Button>Download</Button>
              </a>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
