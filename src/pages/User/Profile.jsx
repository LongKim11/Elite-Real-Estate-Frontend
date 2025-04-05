import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { listData } from '@/lib/dummydata';
import { Card } from '@/components/Card';

export const Profile = () => {
    const [activeTab, setActiveTab] = useState('myList');
    const data = listData;

    return (
        <div className="flex h-full">
            {/* Profile */}
            <div className="flex-[3] overflow-y-scroll">
                {/* Wrapper */}
                <div className="mt-5 flex flex-col gap-8 pr-8">
                    {/* User Information */}
                    <div className="rounded-md border bg-white p-6 shadow-md">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h1 className="text-2xl font-semibold text-gray-800">
                                User Information
                            </h1>
                            <Button className="bg-amber-300 text-black hover:bg-amber-400">
                                Update Profile
                            </Button>
                        </div>
                        <div className="mt-4 flex items-center gap-6">
                            <img
                                src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                className="h-[50px] w-[50px] rounded-full object-cover shadow-md"
                                alt="Avatar"
                            />
                            <div className="space-y-2 text-gray-700">
                                <p className="text-lg font-medium">
                                    <span className="font-bold">Username:</span>{' '}
                                    John Doe
                                </p>
                                <p className="text-lg font-medium">
                                    <span className="font-bold">Email:</span>{' '}
                                    john@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-12 rounded-md border bg-white p-6 shadow-md">
                        <div className="flex justify-between pb-4">
                            <div className="flex gap-3">
                                <button
                                    className={`px-4 pb-2 text-lg font-semibold transition ${
                                        activeTab === 'myList'
                                            ? 'border-b-2 border-blue-500 text-blue-500'
                                            : 'text-gray-500 hover:text-blue-500'
                                    }`}
                                    onClick={() => setActiveTab('myList')}
                                >
                                    My List
                                </button>
                                <button
                                    className={`px-4 pb-2 text-lg font-semibold transition ${
                                        activeTab === 'savedList'
                                            ? 'border-b-2 border-blue-500 text-blue-500'
                                            : 'text-gray-500 hover:text-blue-500'
                                    }`}
                                    onClick={() => setActiveTab('savedList')}
                                >
                                    Saved List
                                </button>
                            </div>
                            <Button className="bg-amber-300 text-black hover:bg-amber-400">
                                Add New Post
                            </Button>
                        </div>

                        {/* Tab Content */}
                        <div className="mt-6 space-y-8">
                            {activeTab === 'myList' &&
                                data.map((item, index) => (
                                    <Card key={index} item={item} />
                                ))}
                            {activeTab === 'savedList' &&
                                data.map((item, index) => (
                                    <Card key={index} item={item} />
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment History */}
            <div className="flex-[2] bg-[#fcf5f3]">
                <div className="px-5">Payment History</div>
            </div>
        </div>
    );
};
