import { listData } from '@/lib/dummydata';
import React from 'react';
import { ListFilter } from '@/components/ListFilter';
import { Card } from '@/components/Card';
import { Map } from '@/components/Map';

export const ListPage = () => {
    const data = listData;

    return (
        <div className="flex h-full pr-12 pl-32">
            <div className="flex-[3]">
                <div className="mb-5 flex h-full flex-col gap-12 overflow-y-scroll pr-8 pb-5">
                    <ListFilter />
                    {data.map((item, index) => (
                        <Card key={index} item={item} />
                    ))}
                </div>
            </div>
            <div className="h-full flex-[2] md:bg-[#fcf5f3]">
                <Map items={data} />
            </div>
        </div>
    );
};
