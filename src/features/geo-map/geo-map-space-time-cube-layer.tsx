import type { EmptyObject, Event, Place } from '@intavia/api-client';
import { CheckBox, Label, Slider } from '@intavia/ui';
import { Billboard, Edges, Line, Plane, Text, useCursor } from '@react-three/drei';
import { extent } from 'd3';
import type { FeatureCollection, LineString } from 'geojson';
import rangeInclusive from 'range-inclusive';
import { Fragment, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import { Canvas } from 'react-three-map/maplibre';
import { BoxGeometry, CatmullRomCurve3, Euler, Shape, ShapeGeometry, Vector3 } from 'three';

import { getEventKindPropertiesById } from '@/features/common/visualization.config';
import { convertToMercator } from '@/features/geo-map/lib/convert-to-mercator';
import { timeScale } from '@/lib/temporal-coloring';

export interface GeoMapSpaceTimeCubeLayerProps<T extends EmptyObject = EmptyObject> {
  id: string;
  data: FeatureCollection<LineString, T>;
  renderLines: boolean;
}

/**
 * GeoJSON line layer for geo-visualisation.
 */
export function GeoMapSpaceTimeCubeLayer<T extends EmptyObject = EmptyObject>(
  props: GeoMapSpaceTimeCubeLayerProps<T>,
): JSX.Element {
  const { id, data, renderLines = false } = props;
  const [currentEvent, setCurrentEvent] = useState<number>(0);
  const [useLabels, setUseLabels] = useState<boolean>(false);
  const [scale, setScale] = useState<number>();
  const [mapRotation, setMapRotation] = useState<number>(0);
  const { current: map } = useMap();
  const MAXHIGHT = 6000000;
  const MINHIGHT = 100000;
  const MINBOXOFFSET = 100000;
  const MAXBOXOFFSET = 1000000;
  const initCubeHight = MINHIGHT + (MAXHIGHT - MINHIGHT) / 2;
  const initBoxOffset = MINBOXOFFSET + (MAXBOXOFFSET - MINBOXOFFSET) / 2;
  const [cubeHight, setCubeHight] = useState<number>(initCubeHight);
  const [boxOffset, setBoxOffset] = useState<number>(initBoxOffset);
  const [isDragging, setIsDragging] = useState(false);
  const [clipMap, setClipMap] = useState(true);

  useLayoutEffect(() => {
    if (map == null) return;
    const mapZoom = map!.getZoom();
    const scale = 250000 / 2 ** mapZoom;
    setScale(scale);
    setMapRotation(map!.getBearing() || 0);
  }, []);

  useEffect(() => {
    if (map == null) return;

    function updateScale() {
      const mapZoom = map!.getZoom();
      const scale = 250000 / 2 ** mapZoom;
      setScale(scale);
    }

    function updateRotation() {
      setMapRotation(map!.getBearing() || 0);
    }

    map.on('zoom', updateScale);
    map.on('rotate', updateRotation);

    return () => {
      map.off('zoom', updateScale);
      map.off('rotate', updateRotation);
    };
  }, [map]);

  const {
    locations,
    boxGeometry,
    boxMidPoint,
    curve,
    clipGeometries,
    scaleLabels,
    extentX,
    extentY,
  } = useMemo(() => {
    if (data.features[0] == null || data.features[0].properties.spaceTime == null) return {};

    const properties = data.features[0].properties;

    const feat = properties.spaceTime as Array<any>;

    const allDates = feat.map((spaceTime) => {
      return spaceTime.date;
    });
    const temporalExtent = extent(allDates) as [Date, Date];

    const start = temporalExtent[0].getFullYear();
    const end = temporalExtent[1].getFullYear();
    const delta = end - start;
    const step = delta >= 10 ? 10 : delta >= 5 ? 5 : 1;

    const startMod = start - (start % step);
    const endMod = end - (end % step) + step;

    const labelDates: Array<Date> = rangeInclusive(startMod, endMod, step).map((year: number) => {
      return new Date(year, 0, 1);
    });

    const temporalScale = timeScale(new Date(startMod, 0, 1), new Date(endMod, 0, 1));

    const scaleLabels: Array<{ label: string; posY: number }> = labelDates.map((date) => {
      return { label: String(date.getFullYear()), posY: cubeHight * temporalScale(date) };
    });

    const locations: Array<{ position: Vector3; color: string; label: string; place: string }> = [];

    for (const f of feat) {
      const longitude = f.position[0];
      const latitude = f.position[1];
      const xy = convertToMercator([longitude, latitude]);

      const event = properties.events.filter((event: Event) => {
        return event.id === f.id;
      });
      const place = properties.places.filter((place: Place) => {
        return place.id === f.place;
      });

      const eventProps = getEventKindPropertiesById(event[0].kind);
      locations.push({
        position: new Vector3(xy[0], cubeHight * temporalScale(f.date), -xy[1]),
        color: eventProps.color.main,
        label: `${event[0].startDate || event[0].endDate} | ${event[0].label.default}`,
        place: place[0].label.default,
      });
    }

    const extentX = extent(
      locations.flatMap((location) => {
        return location.position.x;
      }),
    );
    const extentY = extent(
      locations.flatMap((location) => {
        return location.position.z;
      }),
    );

    if (extentX[0] == null || extentX[1] == null || extentY[0] == null || extentY[1] == null)
      return {};

    const boxMidPoint = [(extentX[0] + extentX[1]) / 2, (extentY[0] + extentY[1]) / 2];

    const boxGeometry = new BoxGeometry(
      extentX[1] - extentX[0] + boxOffset * 2,
      cubeHight,
      extentY[1] - extentY[0] + boxOffset * 2,
    );

    const curve = new CatmullRomCurve3(
      locations.map((location) => {
        return location.position;
      }),
    );

    const NW = convertToMercator([-180, 90]);
    const SW = convertToMercator([-180, -90]);
    const NE = convertToMercator([180, 90]);
    const SE = convertToMercator([180, -90]);

    const backdropNorth = new Shape();
    backdropNorth.moveTo(extentX[0] - boxOffset, -extentY[0] + boxOffset);
    backdropNorth.lineTo(extentX[0] - boxOffset, -extentY[0] + boxOffset + 1000000);
    backdropNorth.lineTo(extentX[1] + boxOffset, -extentY[0] + boxOffset + 1000000);
    backdropNorth.lineTo(extentX[1] + boxOffset, -extentY[0] + boxOffset);

    const shapeLeft = new Shape();
    shapeLeft.moveTo(extentX[0] - boxOffset, -extentY[0] + boxOffset);
    shapeLeft.lineTo(NW[0], NW[1]);
    shapeLeft.lineTo(SW[0], SW[1]);
    shapeLeft.lineTo(extentX[0] - boxOffset, -extentY[1] - boxOffset);

    const shapeTop = new Shape();
    shapeTop.moveTo(extentX[0] - boxOffset, -extentY[0] + boxOffset);
    shapeTop.lineTo(NW[0], NW[1]);
    shapeTop.lineTo(NE[0], NE[1]);
    shapeTop.lineTo(extentX[1] + boxOffset, -extentY[0] + boxOffset);

    const shapeRight = new Shape();
    shapeRight.moveTo(extentX[1] + boxOffset, -extentY[0] + boxOffset);
    shapeRight.lineTo(NE[0], NE[1]);
    shapeRight.lineTo(SE[0], SE[1]);
    shapeRight.lineTo(extentX[1] + boxOffset, -extentY[1] - boxOffset);

    const shapeBottom = new Shape();
    shapeBottom.moveTo(extentX[1] + boxOffset, -extentY[1] - boxOffset);
    shapeBottom.lineTo(SE[0], SE[1]);
    shapeBottom.lineTo(SW[0], SW[1]);
    shapeBottom.lineTo(extentX[0] - boxOffset, -extentY[1] - boxOffset);

    const clipGeometries = [
      new ShapeGeometry(shapeLeft),
      new ShapeGeometry(shapeTop),
      new ShapeGeometry(shapeRight),
      new ShapeGeometry(shapeBottom),
    ];

    return {
      locations,
      boxGeometry,
      boxMidPoint,
      curve,
      clipGeometries,
      scaleLabels,
      extentX,
      extentY,
    };
  }, [data.features, boxOffset, cubeHight]);

  if (locations == null) return <></>;

  return (
    <Fragment>
      {/* SETTINGS */}
      <div className={'absolute left-2 top-2 flex w-60 flex-col gap-y-3 bg-white/75 p-3'}>
        <div className="flex items-center space-x-2">
          <CheckBox
            id="clip"
            defaultChecked={clipMap}
            onCheckedChange={(value: boolean) => {
              setClipMap(value);
            }}
          />
          <Label htmlFor="clip">clip map</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="hight">hight</Label>
          <Slider
            id="hight"
            min={MINHIGHT}
            max={MAXHIGHT}
            step={1000}
            defaultValue={[initCubeHight]}
            onValueChange={(value) => {
              setCubeHight(value[0] as number);
              setIsDragging(true);
            }}
            onValueCommit={() => {
              setIsDragging(false);
            }}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="hight">bounds</Label>
          <Slider
            id="hight"
            min={MINBOXOFFSET}
            max={MAXBOXOFFSET}
            step={1000}
            defaultValue={[initBoxOffset]}
            onValueChange={(value) => {
              setBoxOffset(value[0] as number);
              setIsDragging(true);
            }}
            onValueCommit={() => {
              setIsDragging(false);
            }}
          />
        </div>
        <div className="flex items-center space-x-2">
          <CheckBox
            id="labels"
            defaultChecked={useLabels}
            onCheckedChange={(value: boolean) => {
              setUseLabels(value);
            }}
          />
          <Label htmlFor="labels">labels</Label>
          <Slider
            id="events"
            min={0}
            max={locations.length - 1}
            step={1}
            disabled={!useLabels}
            defaultValue={[0]}
            onValueChange={(value) => {
              setCurrentEvent(value[0] as number);
            }}
          />
        </div>
      </div>

      <Canvas longitude={0} latitude={0} frameloop="demand">
        <ambientLight intensity={2} />

        {/* POSITIONS */}
        {locations != null &&
          locations.map((location, index) => {
            return (
              <Fragment key={`position-${index}`}>
                <STCPosition
                  position={location.position}
                  scale={scale}
                  color={location.color}
                  placeName={location.place}
                  eventLabel={location.label}
                  isCurrent={index === currentEvent && useLabels}
                />
              </Fragment>
            );
          })}

        {/* LINES */}
        {renderLines && !isDragging && (
          <mesh>
            {/* args [path, segements along line, radius, radius segments, closed] */}
            <tubeGeometry args={[curve, 100 * locations.length, scale * 0.3, 10, false]} />
            <meshStandardMaterial color="darkgray" />
          </mesh>
        )}

        <Edges
          position={[boxMidPoint[0], cubeHight / 2, boxMidPoint[1]]}
          scale={1}
          color="gray"
          geometry={boxGeometry}
        ></Edges>

        {mapRotation >= -80 && mapRotation <= 80 && (
          <>
            <TimeScale
              scaleLabels={scaleLabels}
              pos1={[extentX[0] - boxOffset, extentY[0] - boxOffset]}
              pos2={[extentX[1] + boxOffset, extentY[0] - boxOffset]}
              labelAtPos={mapRotation < 0 ? '2' : '1'}
            />
          </>
        )}

        {mapRotation >= 20 && mapRotation <= 160 && (
          <>
            <TimeScale
              scaleLabels={scaleLabels}
              pos1={[extentX[1] + boxOffset, extentY[0] - boxOffset]}
              pos2={[extentX[1] + boxOffset, extentY[1] + boxOffset]}
              labelAtPos={mapRotation < 90 ? '2' : '1'}
              rotation={new Euler(0, -Math.PI / 2, 0)}
            />
          </>
        )}
        {mapRotation <= -20 && mapRotation >= -160 && (
          <>
            <TimeScale
              scaleLabels={scaleLabels}
              pos1={[extentX[0] - boxOffset, extentY[1] + boxOffset]}
              pos2={[extentX[0] - boxOffset, extentY[0] - boxOffset]}
              labelAtPos={mapRotation < -90 ? '2' : '1'}
              rotation={new Euler(0, Math.PI / 2, 0)}
            />
          </>
        )}
        {((mapRotation >= -180 && mapRotation <= -100) ||
          (mapRotation >= 100 && mapRotation <= 180)) && (
          <>
            <TimeScale
              scaleLabels={scaleLabels}
              pos1={[extentX[1] + boxOffset, extentY[1] + boxOffset]}
              pos2={[extentX[0] - boxOffset, extentY[1] + boxOffset]}
              labelAtPos={mapRotation < 180 && mapRotation > 0 ? '2' : '1'}
              rotation={new Euler(0, -Math.PI, 0)}
            />
          </>
        )}

        {clipMap &&
          clipGeometries.map((geom: ShapeGeometry, index: number) => {
            return (
              <Plane
                key={`clip-${index}`}
                position={[0, 0, 0]}
                scale={1}
                geometry={geom}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <meshBasicMaterial color="white" />
              </Plane>
            );
          })}
      </Canvas>
    </Fragment>
  );
}

interface STCPositionProps {
  position: Vector3;
  scale: number;
  color: string;
  placeName: string;
  eventLabel: string;
  isCurrent: boolean;
}

function STCPosition(props: STCPositionProps) {
  const { position, scale, color, placeName, eventLabel, isCurrent } = props;
  const [hover, setHover] = useState(false);

  useCursor(hover);

  return (
    <>
      <mesh
        scale={scale}
        position={[position.x, position.y, position.z]}
        onPointerOver={() => {
          setHover(true);
        }}
        onPointerOut={() => {
          setHover(false);
        }}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color={hover ? 'hotpink' : color} />
        {/* <Outlines thickness={5} screenspace opacity={0} transparent={false} angle={0} color={'red'} /> */}
      </mesh>
      {(hover || isCurrent) && (
        <>
          <mesh
            scale={scale / 2}
            position={[position.x, 0, position.z]}
            onPointerOver={() => {
              setHover(true);
            }}
            onPointerOut={() => {
              setHover(false);
            }}
          >
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial color={'gray'} />
          </mesh>
          <Billboard position={[position.x, position.y + scale * 5, position.z]} scale={scale / 3}>
            <Text fontSize={12} color="#333" strokeWidth={'0.01%'} strokeColor={'hotpink'}>
              {eventLabel}
            </Text>
          </Billboard>
          <Line
            points={[
              [position.x, 0, position.z],
              [position.x, position.y, position.z],
            ]}
            color="lightgray"
            lineWidth={2}
          />
          <Billboard position={[position.x, -scale * 3, position.z]} scale={scale / 4}>
            <Text fontSize={12} color="#333" strokeWidth={'0.01%'} strokeColor={'hotpink'}>
              {placeName}
            </Text>
          </Billboard>
        </>
      )}
    </>
  );
}

interface TimeScaleProps {
  scaleLabels: Array<{ label: string; posY: number }>;
  pos1: [number, number];
  pos2: [number, number];
  labelAtPos?: '1' | '2';
  rotation?: Euler;
}

function TimeScale(props: TimeScaleProps) {
  const { scaleLabels, pos1, pos2, labelAtPos = '1', rotation = new Euler(0, 0, 0) } = props;

  return (
    <Fragment>
      {scaleLabels.map((label, index) => {
        return (
          <>
            <Text
              key={`scale-label-${index}`}
              anchorX={labelAtPos === '1' ? 'left' : 'right'}
              anchorY="bottom"
              fontSize={10}
              scale={12000}
              color={'#444'}
              position={[
                labelAtPos === '1' ? pos1[0] : pos2[0],
                label.posY,
                labelAtPos === '1' ? pos1[1] : pos2[1],
              ]}
              rotation={rotation}
            >
              &nbsp;{`${label.label}`}&nbsp;
            </Text>
            {index > 0 && index < scaleLabels.length - 1 && (
              <Line
                points={[
                  [pos1[0], label.posY, pos1[1]],
                  [pos2[0], label.posY, pos2[1]],
                ]}
                color="lightgray"
                lineWidth={0.8}
              />
            )}
          </>
        );
      })}
    </Fragment>
  );
}
