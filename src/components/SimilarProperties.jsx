import React from 'react';
import { format } from 'date-fns';
import { MapPin, Ruler, Calendar, Clock, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(price);
};

const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
};

const properties = [
    {
        propertyId: '8f140541-4dcb-46be-b815-b70d00b62ab8',
        address: {
            addressId: 'Phường An Phú_Ninh Kiều_Cần Thơ',
            ward: 'Phường An Phú',
            town: 'Ninh Kiều',
            province: 'Cần Thơ'
        },
        userId: '0915307658',
        price: 7000000,
        squareMeters: 35,
        description:
            'Căn hộ studio tiện nghi, gần trung tâm, an ninh 24/7, chỉ việc xách vali vào ở.',
        title: 'Căn hộ mini gần Vincom Xuân Khánh',
        category: 'Apartment',
        typeTransaction: 'sale',
        longitude: '105.774634',
        latitude: '10.033485',
        projectName: 'An Phú Residence',
        fullAddress: 'Số 25, Đường 3/2, Phường An Phú, Quận Ninh Kiều, Cần Thơ',
        startTime: '2025-04-18T17:00:00',
        expireTime: '2025-07-30T17:00:00',
        numBedrooms: 1,
        numBathrooms: 1,
        floor: 5,
        buildingName: 'Block A',
        hasBalcony: true,
        maintenanceFee: 300000,
        parkingAvailability: true,
        images: [
            {
                storageId: '088d1f15-66d4-47df-9ccf-353665e21be9',
                imageUrl:
                    'https://iqjzpkwxosxhbbbrkeyv.supabase.co/storage/v1//object/public/propertyimgv01/properties/1745652542991_a1.jpg'
            },
            {
                storageId: '001bc9ae-6e68-42c6-bec4-7ecec4417b75',
                imageUrl:
                    'https://iqjzpkwxosxhbbbrkeyv.supabase.co/storage/v1//object/public/propertyimgv01/properties/1745652544294_a2.jpg'
            }
        ]
    },
    {
        propertyId: '9f240541-5dcb-46be-c815-b70d00b62cd9',
        address: {
            addressId: 'Phường Tân An_Ninh Kiều_Cần Thơ',
            ward: 'Phường Tân An',
            town: 'Ninh Kiều',
            province: 'Cần Thơ'
        },
        userId: '0915307659',
        price: 8500000,
        squareMeters: 45,
        description: 'Căn hộ 1 phòng ngủ hiện đại, view đẹp, nội thất cao cấp.',
        title: 'Căn hộ 1PN view sông Cần Thơ',
        category: 'Apartment',
        typeTransaction: 'rent',
        projectName: 'Riverside Residence',
        fullAddress:
            'Số 45, Đường Nguyễn Văn Cừ, Phường Tân An, Quận Ninh Kiều, Cần Thơ',
        startTime: '2025-04-20T10:00:00',
        expireTime: '2025-08-15T10:00:00',
        numBedrooms: 1,
        numBathrooms: 1,
        images: [
            {
                imageUrl:
                    'https://iqjzpkwxosxhbbbrkeyv.supabase.co/storage/v1//object/public/propertyimgv01/properties/1745652545396_a3.jpg'
            }
        ]
    },
    {
        propertyId: '7e150542-3dcb-46be-a815-b70d00b62ef7',
        address: {
            addressId: 'Phường Xuân Khánh_Ninh Kiều_Cần Thơ',
            ward: 'Phường Xuân Khánh',
            town: 'Ninh Kiều',
            province: 'Cần Thơ'
        },
        userId: '0915307660',
        price: 12000000,
        squareMeters: 65,
        description:
            'Căn hộ 2 phòng ngủ rộng rãi, đầy đủ tiện nghi, gần trường đại học Cần Thơ.',
        title: 'Căn hộ 2PN gần Đại học Cần Thơ',
        category: 'Apartment',
        typeTransaction: 'rent',
        projectName: 'Xuân Khánh Complex',
        fullAddress:
            'Số 15, Đường 30/4, Phường Xuân Khánh, Quận Ninh Kiều, Cần Thơ',
        startTime: '2025-04-25T14:00:00',
        expireTime: '2025-09-01T14:00:00',
        numBedrooms: 2,
        numBathrooms: 2,
        images: [
            {
                imageUrl:
                    'https://iqjzpkwxosxhbbbrkeyv.supabase.co/storage/v1//object/public/propertyimgv01/properties/1745652546515_a4.jpg'
            }
        ]
    },
    {
        propertyId: '7e150542-3dcb-46be-a815-b70d00b62ef7',
        address: {
            addressId: 'Phường Xuân Khánh_Ninh Kiều_Cần Thơ',
            ward: 'Phường Xuân Khánh',
            town: 'Ninh Kiều',
            province: 'Cần Thơ'
        },
        userId: '0915307660',
        price: 12000000,
        squareMeters: 65,
        description:
            'Căn hộ 2 phòng ngủ rộng rãi, đầy đủ tiện nghi, gần trường đại học Cần Thơ.',
        title: 'Căn hộ 2PN gần Đại học Cần Thơ',
        category: 'Apartment',
        typeTransaction: 'rent',
        projectName: 'Xuân Khánh Complex',
        fullAddress:
            'Số 15, Đường 30/4, Phường Xuân Khánh, Quận Ninh Kiều, Cần Thơ',
        startTime: '2025-04-25T14:00:00',
        expireTime: '2025-09-01T14:00:00',
        numBedrooms: 2,
        numBathrooms: 2,
        images: [
            {
                imageUrl:
                    'https://iqjzpkwxosxhbbbrkeyv.supabase.co/storage/v1//object/public/propertyimgv01/properties/1745652546515_a4.jpg'
            }
        ]
    }
];

export const SimilarProperties = () => {
    return (
        <div className="relative w-full px-8">
            <Carousel className="w-full">
                <CarouselContent>
                    {properties.map((property) => (
                        <CarouselItem
                            key={property.propertyId}
                            className="md:basis-1/2 lg:basis-1/3"
                        >
                            <Link to={`/list/${property.propertyId}`}>
                                <div className="group h-full overflow-hidden rounded-lg border-2 border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                                    {/* Image */}
                                    <div className="relative h-40 w-full overflow-hidden">
                                        <img
                                            src={property.images[0]?.imageUrl}
                                            alt={property.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-2 left-2 flex gap-2">
                                            <Badge
                                                className={
                                                    property.typeTransaction ===
                                                    'rent'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-green-600 text-white'
                                                }
                                            >
                                                {property.typeTransaction ===
                                                'rent'
                                                    ? 'For Rent'
                                                    : 'For Sale'}
                                            </Badge>
                                            <Badge className="bg-indigo-600">
                                                {property.category}
                                            </Badge>
                                        </div>
                                        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                            <p className="text-lg font-bold text-white">
                                                {formatPrice(property.price)}
                                                {property.typeTransaction ===
                                                'rent'
                                                    ? '/month'
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-3">
                                        <h3 className="mb-2 line-clamp-1 text-base font-semibold">
                                            {property.title}
                                        </h3>

                                        <div className="space-y-2 text-xs">
                                            {/* Project Name */}
                                            <div className="flex items-center gap-1">
                                                <Building
                                                    size={14}
                                                    className="text-blue-500"
                                                />
                                                <span className="line-clamp-1">
                                                    {property.projectName}
                                                </span>
                                            </div>

                                            {/* Location */}
                                            <div className="flex items-center gap-1">
                                                <MapPin
                                                    size={14}
                                                    className="text-blue-500"
                                                />
                                                <span className="line-clamp-1">
                                                    {property.address.ward},{' '}
                                                    {property.address.town}
                                                </span>
                                            </div>

                                            {/* Square Meters */}
                                            <div className="flex items-center gap-1">
                                                <Ruler
                                                    size={14}
                                                    className="text-blue-500"
                                                />
                                                <span>
                                                    {property.squareMeters} m²
                                                </span>
                                            </div>
                                        </div>

                                        {/* Footer with Dates */}
                                        <div className="text-2xs mt-2 grid grid-cols-2 gap-1 border-t border-gray-200 pt-2">
                                            <div className="flex items-center gap-1">
                                                <Calendar
                                                    size={12}
                                                    className="text-red-600"
                                                />
                                                <span className="text-xs text-gray-600">
                                                    {formatDate(
                                                        property.startTime
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-end gap-1">
                                                <Clock
                                                    size={12}
                                                    className="text-red-600"
                                                />
                                                <span className="text-xs text-gray-600">
                                                    {formatDate(
                                                        property.expireTime
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious />

                <CarouselNext />
            </Carousel>
        </div>
    );
};
