import React from 'react';
import { Link } from 'react-router-dom';
import {
    MapPinHouse,
    DollarSign,
    Bed,
    Bath,
    Bookmark,
    PhoneForwarded
} from 'lucide-react';

export const Card = ({ item }) => {
    return (
        <div className="flex gap-5 rounded-md border bg-white p-4 shadow-md transition hover:shadow-lg">
            {/* Image wrapper with overflow-hidden to keep border radius during scale */}
            <Link
                to={`/list/${item.id}`}
                className="h-[200px] flex-[2] overflow-hidden rounded-md"
            >
                <img
                    src={item.img}
                    className="h-full w-full transform object-cover transition-transform duration-300 hover:scale-105"
                    alt={item.title}
                />
            </Link>

            {/* Info Section */}
            <div className="flex flex-[3] flex-col justify-between gap-5">
                <h3 className="text-xl font-bold hover:text-amber-400">
                    <Link to={`/list/${item.id}`}>{item.title}</Link>
                </h3>
                <div className="flex items-center gap-3 text-gray-600">
                    <MapPinHouse />
                    <span>{item.address}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                    <DollarSign />
                    <span>{item.price}</span>
                </div>
                <div className="flex justify-between">
                    <div className="flex gap-5 text-gray-600">
                        <div className="flex items-center gap-2">
                            <Bed />
                            <span>{item.bedroom} bedrooms</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bath />
                            <span>{item.bathroom} bathrooms</span>
                        </div>
                    </div>
                    <div className="flex cursor-pointer items-center gap-4 text-gray-600">
                        <Bookmark />
                        <PhoneForwarded />
                    </div>
                </div>
            </div>
        </div>
    );
};
