import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Pin } from './Pin';

export const Map = ({ items }) => {
    return (
        <MapContainer
            center={
                items.length !== 0
                    ? [items[0].latitude, items[0].longitude]
                    : [21.0285, 105.8542]
            }
            zoom={7}
            scrollWheelZoom={true}
            className="h-full w-full rounded-md"
            style={{ zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {items.length !== 0 &&
                items?.map((item, index) => <Pin item={item} key={index} />)}
        </MapContainer>
    );
};
