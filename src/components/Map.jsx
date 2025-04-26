import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Pin } from './Pin';

const MapBounds = ({ items }) => {
    const map = useMap();

    useEffect(() => {
        if (items.length === 0) return;

        const bounds = L.latLngBounds(
            items.map((item) => [item.latitude, item.longitude])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
    }, [items, map]);

    return null;
};

export const Map = ({ items }) => {
    return (
        <MapContainer
            center={[21.0285, 105.8542]}
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
            <MapBounds items={items} />
        </MapContainer>
    );
};
