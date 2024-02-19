'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import { LatLngExpression } from 'leaflet';
import { CSSProperties } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

type MapProps = {
  className?: string;
  mapStyles?: CSSProperties;
  markers?: { position: LatLngExpression; content: React.ReactNode }[];
};

const Map = ({ className, mapStyles, markers }: MapProps) => {
  return (
    <div className={className}>
      <MapContainer style={mapStyles} center={[51.505, -0.09]} zoom={2.5} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers?.map((marker, index) => {
          return (
            <Marker key={index} position={marker.position}>
              <Popup>{marker.content}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
