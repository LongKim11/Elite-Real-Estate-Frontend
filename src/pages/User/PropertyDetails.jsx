import { Slider } from '@/components/Slider';
import React from 'react';
import {
    MapPinHouse,
    Home,
    Building,
    Bath,
    Bed,
    CheckSquare,
    Calendar,
    DollarSign,
    Ruler,
    Clock,
    Landmark,
    Car,
    TreeDeciduous,
    Warehouse,
    CheckCheck,
    Sparkles,
    Hammer,
    Crown,
    Map as MapIcon
} from 'lucide-react';
import { Map } from '@/components/Map';
import { HouseVisitDialog } from '@/components/HouseVisitDialog';
import { getPropertyDetails } from '@/api/listingService';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Spinner } from '@/components/Spinner';
import { RegisterObserverDialog } from '@/components/RegisterObserverDialog';

export const PropertyDetails = () => {
    const { id } = useParams();

    const { data, isLoading } = useQuery({
        queryKey: ['property-details', id],
        queryFn: () => getPropertyDetails(id),
        onSuccess: (res) => {
            console.log('Property Details', res);
        },
        onError: (err) => {
            console.error('Listing Error:', err.response.data.error);
        }
    });

    const property = data?.data;
    const isFollowed = data?.error;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatPrice = (price) => {
        if (price >= 1000000000) {
            return `${(price / 1000000000).toFixed(2)} tỷ VND`;
        } else if (price >= 1000000) {
            return `${(price / 1000000).toFixed(0)} triệu VND`;
        } else {
            return `${price.toLocaleString()} VND`;
        }
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="flex min-h-screen flex-col gap-8 px-4 py-6 md:px-12 lg:flex-row">
            {/* Left Column */}
            <div className="flex-[3] overflow-y-auto">
                {/* Image Slider */}
                <Slider images={property.images.map((img) => img.imageUrl)} />

                {/* Property Header */}
                <div className="mt-8">
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                        <div className="flex flex-col gap-y-3">
                            <div className="flex gap-x-2">
                                <div className="mb-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                                    {property.typeTransaction === 'sale'
                                        ? 'For Sale'
                                        : 'For Rent'}
                                </div>
                                <div className="mb-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                                    {property.category}
                                </div>
                            </div>
                            <h1 className="mb-1 text-2xl font-bold text-gray-800 md:text-3xl">
                                {property.title}
                            </h1>
                            <div className="mb-3 flex items-center gap-2 text-gray-600">
                                <MapPinHouse size={18} />
                                <span>{property.fullAddress}</span>
                            </div>
                            <div className="text-2xl font-bold text-amber-600">
                                {formatPrice(property.price)}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-4 text-gray-700">
                                <Calendar size={18} className="text-red-500" />
                                <div>
                                    <div className="font-bold">
                                        Listed on:{' '}
                                        <span>
                                            {formatDate(property.startTime)}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Expires:{' '}
                                        {formatDate(property.expireTime)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Property Description */}
                <div className="mt-12">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-4 pb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-md">
                                <CheckCheck size={20} className="text-white" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Description
                                </h2>
                                <div className="mt-1 h-1 w-20 rounded-full bg-blue-500"></div>
                            </div>
                        </div>
                    </div>

                    {/* Description Content */}
                    <div className="rounded-xl border border-blue-400 p-6 shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="leading-relaxed text-gray-700">
                            {property.description}
                        </p>
                    </div>
                </div>

                {/* General Information Header */}
                <div className="mt-12">
                    <div className="mb-6">
                        <div className="flex items-center gap-4 pb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-md">
                                <Hammer size={20} className="text-white" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    General Information
                                </h2>
                                <div className="mt-1 h-1 w-20 rounded-full bg-blue-500"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Total Area Card - Purple Theme */}
                        <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/30 p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                            <div className="rounded-full bg-blue-200 p-3 shadow-inner">
                                <Ruler className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-blue-700">
                                    Total Area
                                </div>
                                <div className="text-md font-bold text-gray-800">
                                    {property?.squareMeters} m²
                                </div>
                            </div>
                        </div>

                        {/* Property Type Card - Emerald Theme */}
                        <div className="flex items-center gap-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                            <div className="rounded-full bg-emerald-200 p-3 shadow-inner">
                                <Home className="text-emerald-600" size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-emerald-700">
                                    Property Type
                                </div>
                                <div className="text-md font-bold text-gray-800">
                                    {property.category}
                                </div>
                            </div>
                        </div>

                        {/* Project Card - Amber Theme */}
                        <div className="flex items-center gap-4 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                            <div className="rounded-full bg-amber-200 p-3 shadow-inner">
                                <Landmark
                                    className="text-amber-600"
                                    size={20}
                                />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-amber-700">
                                    Project
                                </div>
                                <div className="text-md font-bold text-gray-800">
                                    {property.projectName || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Specific Attributes */}
                {property.category === 'Apartment' && (
                    <div className="mb-8">
                        <div className="mb-6">
                            <div className="flex items-center gap-4 pb-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-md">
                                    <Sparkles
                                        size={20}
                                        className="text-white"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Apartment Details
                                    </h2>
                                    <div className="mt-1 h-1 w-20 rounded-full bg-blue-500"></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 rounded-lg border border-blue-400 bg-white p-6 shadow-md hover:shadow-lg md:grid-cols-3">
                            <div className="flex items-center gap-5">
                                <Bed className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Bedrooms
                                    </div>
                                    <div className="font-medium">
                                        {property.numBedrooms}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <Bath className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Bathrooms
                                    </div>
                                    <div className="font-medium">
                                        {property.numBathrooms}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <Building className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Floor
                                    </div>
                                    <div className="font-medium">
                                        {property.floor}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <Building className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Building
                                    </div>
                                    <div className="font-medium">
                                        {property.buildingName}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <DollarSign className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Maintenance Fee
                                    </div>
                                    <div className="font-medium">
                                        {property.maintenanceFee.toLocaleString()}{' '}
                                        VND
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <CheckSquare className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Balcony
                                    </div>
                                    <div className="font-medium">
                                        {property.hasBalcony ? 'Yes' : 'No'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <Car className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Parking
                                    </div>
                                    <div className="font-medium">
                                        {property.parkingAvailability
                                            ? 'Available'
                                            : 'Not Available'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {property.category === 'House' && (
                    <div className="mb-8">
                        <div className="mb-6">
                            <div className="flex items-center gap-4 pb-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-md">
                                    <Sparkles
                                        size={20}
                                        className="text-white"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        House Details
                                    </h2>
                                    <div className="mt-1 h-1 w-20 rounded-full bg-blue-500"></div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 rounded-lg border border-blue-400 bg-white p-6 shadow-sm hover:shadow-lg md:grid-cols-3">
                            <div className="flex items-center gap-5">
                                <Bed className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Bedrooms
                                    </div>
                                    <div className="font-medium">
                                        {property.numBedrooms}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <Bath className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Bathrooms
                                    </div>
                                    <div className="font-medium">
                                        {property.numBathrooms}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <Building className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Floors
                                    </div>
                                    <div className="font-medium">
                                        {property.numFloors}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <Home className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        House Type
                                    </div>
                                    <div className="font-medium">
                                        {property.houseType}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <Ruler className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Land Area
                                    </div>
                                    <div className="font-medium">
                                        {property.landArea} m²
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <TreeDeciduous className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Garden
                                    </div>
                                    <div className="font-medium">
                                        {property.hasGarden ? 'Yes' : 'No'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <Warehouse className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Garage
                                    </div>
                                    <div className="font-medium">
                                        {property.hasGarage ? 'Yes' : 'No'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {property.category === 'Land' && (
                    <div className="mb-8">
                        <div className="mb-6">
                            <div className="flex items-center gap-4 pb-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-md">
                                    <Sparkles
                                        size={20}
                                        className="text-white"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        House Details
                                    </h2>
                                    <div className="mt-1 h-1 w-20 rounded-full bg-blue-500"></div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 rounded-lg border border-blue-400 bg-white p-6 shadow-sm hover:shadow-lg md:grid-cols-3">
                            <div className="flex items-center gap-5">
                                <Home className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Land Type
                                    </div>
                                    <div className="font-medium">
                                        {property.landType}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <Landmark className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Zoning Type
                                    </div>
                                    <div className="font-medium">
                                        {property.zoningType}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <Ruler className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Road Frontage
                                    </div>
                                    <div className="font-medium">
                                        {property.roadFrontage} m
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <CheckSquare className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Legal Status
                                    </div>
                                    <div className="font-medium">
                                        {property.legalStatus}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <Building className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Can Build
                                    </div>
                                    <div className="font-medium">
                                        {property.canBuild ? 'Yes' : 'No'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <Clock className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Usage Duration
                                    </div>
                                    <div className="font-medium">
                                        {property.landUsageDuration}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Sidebar */}
            <div className="mt-6 flex-[2] lg:mt-0">
                <div className="sticky top-6 space-y-6">
                    {/* Location Map */}
                    <div className="bor rounded-lg border bg-white p-4 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <MapIcon className="text-blue-600" size={20} />
                            Location
                        </h3>
                        <div className="h-[300px] w-full overflow-hidden rounded-lg">
                            <Map items={[property]} />
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                            <div className="mb-1 flex items-center gap-2">
                                <MapPinHouse
                                    className="text-blue-600"
                                    size={16}
                                />
                                {property.address.ward}, {property.address.town}
                            </div>
                            <div className="font-medium text-gray-800">
                                {property.address.province}
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="rounded-lg border bg-amber-50 p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">
                            Interested in this property?
                        </h3>

                        <div className="space-y-4">
                            {isFollowed === '3' ? (
                                <Button className="w-ful">
                                    <Crown className="mr-2" size={18} />
                                    <span>Owned by You</span>
                                </Button>
                            ) : (
                                <>
                                    <HouseVisitDialog id={id} />

                                    <RegisterObserverDialog
                                        id={id}
                                        isFollowed={isFollowed}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
