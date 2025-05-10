import React from 'react';
import { format } from 'date-fns';
import { MapPin, Ruler, Calendar, Clock, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getListing } from '@/api/listingService';
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

export const SimilarProperties = ({ propertyType, propertyId }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['getSimilarProperties'],
        queryFn: () => getListing(`propertyType=${propertyType}`),
        onSuccess: (res) => {
            console.log('Similar Properties', res);
        },
        onError: (err) => {
            console.log('Similar Properties Error', err.respose.data.error);
        }
    });

    const similarProperties = data?.data?.filter(
        (item) => item.property.propertyId !== propertyId
    );

    console.log(similarProperties);

    return (
        <div className="relative w-full px-8">
            {similarProperties?.length === 0 && (
                <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-gray-500">
                    <Building size={40} className="text-blue-500" />
                    <p className="text-lg font-semibold">
                        No matching properties available
                    </p>
                </div>
            )}
            {similarProperties?.length > 0 && (
                <Carousel className="w-full">
                    <CarouselContent>
                        {similarProperties?.map((item) => (
                            <CarouselItem
                                key={item.property.propertyId}
                                className="md:basis-1/2 lg:basis-1/3"
                            >
                                <Link to={`/list/${item.property.propertyId}`}>
                                    <div className="group h-full overflow-hidden rounded-lg border-2 border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                                        {/* Image */}
                                        <div className="relative h-40 w-full overflow-hidden">
                                            <img
                                                src={
                                                    item.property.images[0]
                                                        ?.imageUrl
                                                }
                                                alt={item.property.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute top-2 left-2 flex gap-2">
                                                <Badge
                                                    className={
                                                        item.property
                                                            .typeTransaction ===
                                                        'rent'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-green-600 text-white'
                                                    }
                                                >
                                                    {item.property
                                                        .typeTransaction ===
                                                    'rent'
                                                        ? 'For Rent'
                                                        : 'For Sale'}
                                                </Badge>
                                                <Badge className="bg-indigo-600">
                                                    {item.property.category}
                                                </Badge>
                                            </div>
                                            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                                <p className="text-lg font-bold text-white">
                                                    {formatPrice(
                                                        item.property.price
                                                    )}
                                                    {item.property
                                                        .typeTransaction ===
                                                    'rent'
                                                        ? '/month'
                                                        : ''}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-3">
                                            <h3 className="mb-2 line-clamp-1 text-base font-semibold">
                                                {item.property.title}
                                            </h3>

                                            <div className="space-y-2 text-xs">
                                                {/* Project Name */}
                                                <div className="flex items-center gap-1">
                                                    <Building
                                                        size={14}
                                                        className="text-blue-500"
                                                    />
                                                    <span className="line-clamp-1">
                                                        {
                                                            item.property
                                                                .projectName
                                                        }
                                                    </span>
                                                </div>

                                                {/* Location */}
                                                <div className="flex items-center gap-1">
                                                    <MapPin
                                                        size={14}
                                                        className="text-blue-500"
                                                    />
                                                    <span className="line-clamp-1">
                                                        {
                                                            item.property
                                                                .address.ward
                                                        }
                                                        ,{' '}
                                                        {
                                                            item.property
                                                                .address.town
                                                        }
                                                    </span>
                                                </div>

                                                {/* Square Meters */}
                                                <div className="flex items-center gap-1">
                                                    <Ruler
                                                        size={14}
                                                        className="text-blue-500"
                                                    />
                                                    <span>
                                                        {
                                                            item.property
                                                                .squareMeters
                                                        }{' '}
                                                        m²
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
                                                            item.property
                                                                .startTime
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
                                                            item.property
                                                                .expireTime
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
            )}
        </div>
    );
};
