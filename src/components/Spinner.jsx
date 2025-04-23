import React from 'react';
import { Triangle } from 'react-loader-spinner';

export const Spinner = () => {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <Triangle
                visible={true}
                height="80"
                width="80"
                color="#fece51"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );
};
