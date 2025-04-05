import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';

export const Pin = ({ item }) => {
    return (
        <Marker position={[item.latitude, item.longitude]}>
            <Popup>
                <div
                    className="flex flex-col gap-4"
                    style={{
                        width: '250px',
                        maxWidth: '250px'
                    }}
                >
                    <img
                        src={item.img}
                        alt={item.title}
                        style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                        }}
                    />
                    <Link
                        to={`/list/${item.id}`}
                        style={{
                            fontWeight: 'bold',
                            fontSize: '16px'
                        }}
                    >
                        {item.title}
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-600">
                                {item.bedroom} bedrooms
                            </span>
                            <span className="font-bold text-amber-600">
                                {item.bathroom} badrooms
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-600">
                                ${item.price}
                            </span>
                        </div>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
};
