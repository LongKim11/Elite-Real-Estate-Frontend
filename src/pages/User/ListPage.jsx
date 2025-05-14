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

    const tierPriority = {
        VIP_GOLD: 1,
        VIP_SILVER: 2,
        REGULAR: 3
    };

    const filteredListings = {
        data: [...(listing?.data || [])].sort(
            (a, b) =>
                (tierPriority[a.postTier] || 4) -
                (tierPriority[b.postTier] || 4)
        )
    };

    return (
        <div className="flex h-full pt-5 pr-12 pl-12">
            <div className="max-w-[60%] flex-grow basis-3/5">
                {isLoading ? (
                    <Spinner />
                ) : (
                    <div className="flex h-full flex-col gap-12 overflow-y-scroll pr-8 pb-8">
                        <ListFilter
                            filters={filters}
                            onChange={setFilters}
                            onFilter={handleFilter}
                        />
                        {filteredListings?.data?.map((item, index) => (
                            <Card
                                key={index}
                                item={item.property}
                                postTier={item.postTier}
                            />
                        ))}
                        {(filteredListings?.data === null ||
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
            <div className="max-w-[40%] flex-grow basis-2/5">
                <Map items={filteredListings?.data ?? []} />
            </div>
        </div>
    );
};
