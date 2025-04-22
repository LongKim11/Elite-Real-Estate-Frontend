import React from 'react';

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
