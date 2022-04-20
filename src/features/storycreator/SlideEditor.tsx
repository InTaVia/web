import { Card, CardContent, CardMedia, TextareaAutosize, Typography } from '@mui/material';
import { Responsive, WidthProvider } from 'react-grid-layout';

import { useAppDispatch, useAppSelector } from '@/features/common/store';
import styles from '@/features/storycreator/storycreator.module.css';
import uiStyles from '@/features/ui/ui.module.css';
import { addWindow, editWindow, removeWindow, selectWindows } from '@/features/ui/ui.slice';
import Window from '@/features/ui/Window';

interface Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static: boolean;
  isDraggable: boolean;
  content: string;
}

interface DropProps {
  type: string;
  static: boolean;
  props: any;
}

const ReactGridLayout = WidthProvider(Responsive);

const rowHeight = 30;
const height = 600;

export function SlideEditor(props: any) {
  const dispatch = useAppDispatch();

  const windows = useAppSelector(selectWindows);

  const removeWindowHandler = (id: any) => {
    dispatch(removeWindow({ id: id }));
  };

  const onDrop = (i_layout, i_layoutItem, event) => {
    const dropProps: DropProps = JSON.parse(event.dataTransfer.getData('text'));
    const layoutItem = i_layoutItem;

    const ids = windows.map((e: any) => {
      return e.key;
    });

    let counter = 1;
    const text = dropProps.type;
    let newText = text;
    while (ids.includes(newText)) {
      newText = text + ' (' + counter + ')';
      counter++;
    }
    layoutItem['i'] = newText;
    layoutItem['type'] = dropProps.type;

    switch (dropProps.type) {
      case 'Annotation':
        layoutItem['h'] = 3;
        layoutItem['w'] = 2;
        break;
      case 'Image':
        layoutItem['h'] = 12;
        layoutItem['w'] = 3;
        break;
      case 'Timeline':
        layoutItem['h'] = 12;
        layoutItem['w'] = 3;
        break;
      case 'Map':
        layoutItem['h'] = height / rowHeight;
        layoutItem['w'] = 48;

        if (dropProps.props.static as boolean) {
          layoutItem['x'] = 0;
          layoutItem['y'] = 0;
          layoutItem['static'] = true;
          layoutItem['isDraggable'] = false;
        }
        break;

      default:
        layoutItem['h'] = 2;
        layoutItem['w'] = 2;
        break;
    }

    dispatch(
      addWindow({
        grid: {
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

  const createWindowContent = (element: any) => {
    switch (element.type) {
      case 'Annotation':
        return (
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            style={{
              width: '100%',
              height: '100%',
              minWidth: '100%',
              minHeight: '100%',
              border: 'none',
              resize: 'none',
            }}
            placeholder={element.key}
          />
        );
      case 'Image':
        return (
          <Card
            style={{
              height: '100%',
              maxHeight: '100%',
              position: 'relative',
            }}
          >
            <CardMedia
              style={{ height: '85%', width: '100%' }}
              image="https://post.healthline.com/wp-content/uploads/2021/06/lizard-iguana-1200x628-facebook.jpg"
              title="Contemplative Reptile"
            />
            <CardContent className={styles['card-content']}>
              <Typography gutterBottom variant="h5" component="h2">
                Lizard
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Lizards are a widespread group of squamate reptiles, with over 6,000 species,
                ranging across all continents except Antarctica
              </Typography>
            </CardContent>
          </Card>
        );
      case 'Timeline':
        //return <TimelineExample data={[]} />;
        return [];
      case 'Map':
        //return <LeafletExample data={[]} />;
        return [];
      default:
        return [];
    }
  };

  const createLayoutPane = (element: any) => {
    switch (element.type) {
      case 'Annotation':
      case 'Image':
      case 'Map':
        return (
          <div key={'gridWindow' + element.id} className={styles.elevated} data-grid={element.grid}>
            <Window
              className={styles['annotation-window']}
              title={element.type}
              id={element.id}
              onRemoveWindow={removeWindowHandler}
              static={element.static}
              isDraggable={true}
              key={element.key}
            >
              {createWindowContent(element)}
            </Window>
          </div>
        );
      default:
        return (
          <div key={'gridWindow' + element.id} className={styles.elevated} data-grid={element.grid}>
            <Window
              className={styles['annotation-window']}
              title={element.type}
              id={element.id}
              onRemoveWindow={removeWindowHandler}
              key={element.key}
            >
              {element.key}
            </Window>
          </div>
        );
    }
  };

  return (
    <div className={styles['slide-editor-wrapper']}>
      <ReactGridLayout
        className="layout"
        /* cols={48} */
        layout={windows}
        rowHeight={30}
        compactType="horizontal"
        width={1200}
        height={height}
        allowOverlap={true}
        isDroppable={true}
        draggableHandle={'.' + uiStyles['header-area']}
        style={{
          width: '100%',
          height: '100%',
        }}
        onDrop={onDrop}
        onResize={(iLayout, element, resized) => {
          /*           let oldLayout = [...layout];
            let newLayout = [] as any;
            for (let entry of oldLayout) {
              if (entry.i === resized.i) {
                entry = { ...entry, ...resized };
              }
              newLayout.push(entry);
            } */
          /* setLayout(newLayout); */

          const oldLayout = [...iLayout];
          for (const entry of oldLayout) {
            if (entry.i === resized.i) {
              dispatch(editWindow({ ...entry, ...resized }));
            }
          }
        }}
        onDrag={(iLayout, element, dragged) => {
          //dispatch(editWindow({ entry: dragged }));
          const oldLayout = [...iLayout];
          for (const entry of oldLayout) {
            if (entry.i === dragged.i) {
              console.log(JSON.stringify(entry), JSON.stringify(dragged));

              //dispatch(editWindow({ ...entry, ...dragged }));
            }
          }
        }}
      >
        {/* ({layout.map((e) => createLayoutPane(e))}) */}
        {windows.map((e: any) => {
          return createLayoutPane(e);
        })}
      </ReactGridLayout>
    </div>
  );
}
