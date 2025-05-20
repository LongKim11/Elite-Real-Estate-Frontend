import React from 'react';
import { getPropertyDetails } from '@/api/listingService';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ApartmentForm } from '@/components/ApartmentForm';
import { HouseForm } from '@/components/HouseForm';
import { LandForm } from '@/components/LandForm';
import { Spinner } from '@/components/Spinner';

export const EditPropertyPage = () => {
    const { id } = useParams();

    const { data: propertyData, isLoading } = useQuery({
        queryKey: ['getPropertyDetails', id],
        queryFn: () => getPropertyDetails(id),
        enabled: !!id,
        onSuccess: (res) => {
            console.log('Property Details', res);
        },
        onError: (err) => {
            console.log('Property Details Error', err.response.data.error);
        }
    });

    const category = propertyData?.data?.property?.category;

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="h-full overflow-y-auto">
            {category === 'Apartment' && (
                <ApartmentForm
                    updateStatus={true}
                    item={propertyData?.data?.property}
                />
            )}
            {category === 'Land' && (
                <LandForm
                    updateStatus={true}
                    item={propertyData?.data?.property}
                />
            )}
            {category === 'House' && (
                <HouseForm
                    updateStatus={true}
                    item={propertyData?.data?.property}
                />
            )}
        </div>
    );
};
