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
                    <Link
                        to={`/list/${item.propertyId}`}
                        style={{
                            fontWeight: 'bold',
                            fontSize: '16px'
                        }}
                        className="space-y-3"
                    >
                        <img
                            src={item.images[0].imageUrl}
                            alt={item.title}
                            style={{
                                width: '100%',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                            }}
                            className="transition-all duration-300 ease-in-out hover:scale-105"
                        />
                        <span>{item.title}</span>
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {item.category === 'Land' ? (
                                <>
                                    {' '}
                                    <span className="font-bold text-amber-600">
                                        {item.roadFrontage}m road
                                    </span>
                                    <span className="font-bold text-amber-600">
                                        {item.squareMeters}m² square
                                    </span>
                                </>
                            ) : (
                                <>
                                    {' '}
                                    <span className="font-bold text-amber-600">
                                        {item.numBedrooms} bedrooms
                                    </span>
                                    <span className="font-bold text-amber-600">
                                        {item.numBathrooms} badrooms
                                    </span>
                                </>
                            )}
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
