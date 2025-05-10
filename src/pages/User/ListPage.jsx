import React, { useState } from 'react';
import { ListFilter } from '@/components/ListFilter';
import { Card } from '@/components/Card';
import { Map } from '@/components/Map';
import { useQuery } from '@tanstack/react-query';
import { getListing } from '@/api/listingService';
import { Spinner } from '@/components/Spinner';

export const ListPage = () => {
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
        queryKey: ['listing', queryString],
        queryFn: () => getListing(queryString),
        onSuccess: (res) => {
            console.log('Listing Response:', res);
        },
        onError: (err) => {
            console.error('Listing Error:', err.response.data.error);
        }
    });

    const buildQueryString = (filters) => {
        return Object.entries(filters)
            .filter(([_, value]) => value !== '' && value != ' ')
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
    };

    const handleFilter = () => {
        setQueryString(buildQueryString(filters));
    };

    return (
        <div className="flex h-full pt-5 pr-12 pl-12">
            <div className="flex-[3]">
                {isLoading ? (
                    <Spinner />
                ) : (
                    <div className="flex h-full flex-col gap-12 overflow-y-scroll pr-8 pb-8">
                        <ListFilter
                            filters={filters}
                            onChange={setFilters}
                            onFilter={handleFilter}
                        />
                        {listing?.data?.map((item, index) => (
                            <Card key={index} item={item.property} />
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
                )}
            </div>
            <div className="h-full flex-[2] md:bg-[#fcf5f3]">
                <Map items={listing?.data ?? []} />
            </div>
        </div>
    );
};
