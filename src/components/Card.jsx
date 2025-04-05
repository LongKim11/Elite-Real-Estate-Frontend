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
        <div className="flex gap-5">
            <Link to={`/list/${item.id}`} className="h-[200px] flex-[2]">
                <img
                    src={item.img}
                    className="h-full w-full transform rounded-md object-cover transition-transform hover:scale-105"
                ></img>
            </Link>
            <div className="flex flex-[3] flex-col justify-between gap-5">
                <h3 className="text-xl font-bold hover:text-amber-400">
                    <Link to={`/list/${item.id}`}>{item.title}</Link>
                </h3>
                <div className="flex items-center gap-3">
                    <MapPinHouse />
                    <span>{item.address}</span>
                </div>
                <div className="flex items-center gap-3">
                    <DollarSign />
                    <span>{item.price}</span>
                </div>
                <div className="flex justify-between">
                    <div className="flex gap-5">
                        <div className="flex items-center gap-3">
                            <Bed />
                            <span>{item.bedroom} bedrooms</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Bath />
                            <span>{item.bathroom} bathrooms</span>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <Bookmark />
                        <PhoneForwarded />
                    </div>
                </div>
            </div>
        </div>
    );
};
