import { listData } from '@/lib/dummydata';
import React from 'react';
import { ListFilter } from '@/components/ListFilter';
import { Card } from '@/components/Card';

export const ListPage = () => {
    const data = listData;

    return (
        <div className="flex h-full">
            <div className="flex-[3]">
                <div className="mb-5 flex h-full flex-col gap-12 overflow-y-scroll pr-5 pb-5">
                    <ListFilter />
                    {data.map((item, index) => (
                        <Card key={index} item={item} />
                    ))}
                </div>
            </div>
            <div className="flex-[2] md:bg-[#fcf5f3]">2</div>
        </div>
    );
};
