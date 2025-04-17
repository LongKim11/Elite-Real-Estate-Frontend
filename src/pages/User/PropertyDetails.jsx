import { Slider } from '@/components/Slider';
import React from 'react';
import { singlePostData, userData } from '@/lib/dummydata';
import { MapPinHouse, MessageSquareMore, Bookmark } from 'lucide-react';
import { Map } from '@/components/Map';
import { Button } from '@/components/ui/button';

export const PropertyDetails = () => {
    return (
        <div className="flex h-full px-12">
            {/* Left */}
            <div className="flex-[3] overflow-y-hidden">
                {/* Wrapper */}
                <div className="pr-12">
                    <Slider images={singlePostData.images} />
                    {/* Property Introduction */}
                    <div className="mt-12">
                        <div className="flex justify-between">
                            <div className="flex flex-col gap-5">
                                <h1 className="text-3xl font-bold">
                                    {singlePostData.title}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <MapPinHouse />
                                    <span className="font-bold">
                                        {singlePostData.address}
                                    </span>
                                </div>
                                <div>$ {singlePostData.price}</div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-5 rounded-md bg-amber-100 px-12">
                                <img
                                    src={userData.img}
                                    className="h-[50px] w-[50px] rounded-full object-cover"
                                ></img>
                                <span className="font-bold">
                                    {userData.name}
                                </span>
                            </div>
                        </div>
                        <div className="bottom mt-12 text-justify">
                            {singlePostData.description}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className="h-full flex-[2] overflow-y-scroll bg-[#fcf5f3]">
                <div className="flex flex-col gap-8 px-6">
                    {/* General Section */}
                    <p className="text-xl font-semibold text-gray-800">
                        General
                    </p>
                    <div className="flex flex-col gap-6 rounded-lg bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <MapPinHouse />
                            <div>
                                <span className="text-lg font-medium text-gray-800">
                                    Utilities
                                </span>
                                <p className="text-sm text-gray-600">
                                    Renter is responsible
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <MapPinHouse />
                            <div>
                                <span className="text-lg font-medium text-gray-800">
                                    Utilities
                                </span>
                                <p className="text-sm text-gray-600">
                                    Renter is responsible
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <MapPinHouse />
                            <div>
                                <span className="text-lg font-medium text-gray-800">
                                    Utilities
                                </span>
                                <p className="text-sm text-gray-600">
                                    Renter is responsible
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sizes Section */}
                    <p className="text-xl font-semibold text-gray-800">Sizes</p>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                            <MapPinHouse />
                            <span className="text-lg font-medium text-gray-800">
                                80 sqft
                            </span>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                            <MapPinHouse />
                            <span className="text-lg font-medium text-gray-800">
                                80 sqft
                            </span>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                            <MapPinHouse />
                            <span className="text-lg font-medium text-gray-800">
                                80 sqft
                            </span>
                        </div>
                    </div>

                    {/* Nearby Places Section */}
                    <p className="text-xl font-semibold text-gray-800">
                        Nearby Places
                    </p>
                    <div className="grid grid-cols-2 justify-between gap-6">
                        <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                            <MapPinHouse />
                            <div>
                                <span className="text-lg font-medium text-gray-800">
                                    Utilities
                                </span>
                                <p className="text-sm text-gray-600">
                                    Renter is responsible
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                            <MapPinHouse />
                            <div>
                                <span className="text-lg font-medium text-gray-800">
                                    Utilities
                                </span>
                                <p className="text-sm text-gray-600">
                                    Renter is responsible
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                            <MapPinHouse />
                            <div>
                                <span className="text-lg font-medium text-gray-800">
                                    Utilities
                                </span>
                                <p className="text-sm text-gray-600">
                                    Renter is responsible
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                            <MapPinHouse />
                            <div>
                                <span className="text-lg font-medium text-gray-800">
                                    Utilities
                                </span>
                                <p className="text-sm text-gray-600">
                                    Renter is responsible
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="mapContainer h-[300px] w-full">
                        {' '}
                        <Map items={[singlePostData]} />{' '}
                    </div>

                    {/* Buttons Section */}
                    <div className="mb-8 flex justify-between gap-4">
                        <Button className="w-1/2 bg-green-500 hover:bg-green-600">
                            <MessageSquareMore />
                            <span>Send a message</span>
                        </Button>
                        <Button className="bg-am w-1/2 bg-blue-500 hover:bg-blue-600">
                            <Bookmark />
                            <span>Save the property</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
