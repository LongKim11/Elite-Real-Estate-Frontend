import React from 'react';
import { Triangle } from 'react-loader-spinner';

export const Spinner = () => {
    return (
        <Triangle
            visible={true}
            height="80"
            width="80"
            color="#fece51"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />
    );
};
