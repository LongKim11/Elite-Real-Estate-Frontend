import React from 'react';
import { ListFilter } from '@/components/ListFilter';
import { Card } from '@/components/Card';
import { Map } from '@/components/Map';
import { useQuery } from '@tanstack/react-query';
import { getListing } from '@/api/listingService';
import { Spinner } from '@/components/Spinner';

export const ListPage = () => {
    const { data: listing, isLoading } = useQuery({
        queryKey: ['listing'],
        queryFn: getListing,
        onSuccess: (res) => {
            console.log('Listing Response:', res);
        },
        onError: (err) => {
            console.error('Listing Error:', err.response.data.error);
        }
    });

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="flex h-full pr-12 pl-32">
                    <div className="flex-[3]">
                        <div className="mb-5 flex h-full flex-col gap-12 overflow-y-scroll pr-8 pb-5">
                            <ListFilter />
                            {listing?.data?.map((item, index) => (
                                <Card key={index} item={item} />
                            ))}
                        </div>
                    </div>
                    <div className="h-full flex-[2] md:bg-[#fcf5f3]">
                        <Map items={listing?.data} />
                    </div>
                </div>
            )}
        </>
    );
};
