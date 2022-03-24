import worldGeoJSON from 'geojson-world-map';
import { useEffect, useRef, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';

export interface LeafletCountriesProps {
  selected: Array<string>;
}

export function LeafletCountries(props: LeafletCountriesProps) {
  const [selected, setSelected] = useState(props.selected);
  const geoJSONRef = useRef(null);

  const color = '#4a83ec';

  const getFillColor = (country: any): string => {
    if (props.selected.includes(country.properties.name)) {
      return 'red';
    } else {
      return '#1a1d62';
    }
  };

  const getStyle = (feature: any): any => {
    return {
      color: color,
      weight: 0.5,
      fillColor: getFillColor(feature),
      fillOpacity: 1,
    };
  };

  const handleClick = (e: any): any => {
    const selectedFeature = e.sourceTarget.feature;
    const countryName: string = selectedFeature.properties.name;

    const newSelected: Array<string> = [...props.selected];

    const index = newSelected.indexOf(countryName);

    if (index > -1) {
      newSelected.splice(index, 1);
    } else {
      newSelected.push(countryName);
    }
    setSelected(newSelected);
  };

  useEffect(() => {
    const layer: any = geoJSONRef.current;

    if (layer !== null) {
      layer.on({
        click: handleClick,
      });
      return () => {
        layer.off('click', handleClick);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selected, selected]);

  return (
    <MapContainer center={[48, 12]} zoom={1} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON
        ref={geoJSONRef}
        data={worldGeoJSON}
        style={getStyle}
        onEachFeature={(feature: any, layer: any) => {
          layer.on({
            click: handleClick,
          });
        }}
      />
    </MapContainer>
  );
}
