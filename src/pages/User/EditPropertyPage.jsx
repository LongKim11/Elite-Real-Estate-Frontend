import React from 'react';
import { getPropertyDetails } from '@/api/listingService';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

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

    return <div>EditPropertyPage</div>;
};
