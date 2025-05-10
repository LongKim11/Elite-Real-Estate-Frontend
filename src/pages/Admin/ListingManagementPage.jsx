import React, { useState } from 'react';
import { Spinner } from '@/components/Spinner';
import { getListingAdmin } from '@/api/listingService';
import { useQuery } from '@tanstack/react-query';
import { ListFilter } from '@/components/ListFilter';
import { Card } from '@/components/Card';
import { Map } from '@/components/Map';

export const ListingManagementPage = () => {
    const [queryString, setQueryString] = useState('');
    const [filters, setFilters] = useState({
        fullAddress: '',
        transactionType: '',
        province: '',
        district: '',
        propertyType: '',
        minPrice: '',
        maxPrice: ''
    });

    const { data: listing, isLoading } = useQuery({
        queryKey: ['getListingAdmin', queryString],
        queryFn: () => getListingAdmin(queryString),
        onSuccess: (res) => {
            console.log('Listing Response', res);
        },
        onError: (err) => {
            console.log('Listing Error', err.response?.data?.error);
        }
    });

    const buildQueryString = (filters) => {
        return Object.entries(filters)
            .filter(([_, value]) => value !== '' && value !== ' ')
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
    };

    const handleFilter = () => {
        setQueryString(buildQueryString(filters));
    };

    return (
        <div className="absolute inset-0 overflow-auto">
            <div className="flex h-[370px] gap-x-11 px-4 pt-6 pb-4">
                <div className="w-1/2">
                    <ListFilter
                        filters={filters}
                        onChange={setFilters}
                        onFilter={handleFilter}
                    />
                </div>
                <div className="h-full w-1/2">
                    <Map items={listing?.data ?? []} />
                </div>
            </div>

            {isLoading ? (
                <div className="mt-20 flex items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <div className="p-4">
                    <div className="flex flex-col gap-5 pb-10">
                        {listing?.data?.map((item, index) => (
                            <Card
                                key={index}
                                item={item.property}
                                canUpdate={true}
                                canViewSchedule={true}
                                canDelete={true}
                            />
                        ))}

                        {(listing?.data === null ||
                            listing?.data?.length === 0) && (
                            <div className="flex h-[200px] items-center justify-center">
                                <span className="text-xl font-semibold">
                                    No Property Found
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
