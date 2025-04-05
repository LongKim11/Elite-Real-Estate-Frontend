import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Pin } from './Pin';

export const Map = ({ items }) => {
    return (
        <MapContainer
            center={[52.4797, -1.90269]}
            zoom={7}
            scrollWheelZoom={true}
            className="h-full w-full rounded-md"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {items.map((item, index) => (
                <Pin item={item} key={index} />
            ))}
        </MapContainer>
    );
};
