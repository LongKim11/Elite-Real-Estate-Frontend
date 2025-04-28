import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Link } from 'react-router-dom';
import { ProfileFund } from '@/components/ProfileFund';
import { getMe } from '@/api/authService';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/Spinner';
import { getOwned } from '@/api/listingService';
import { getSavedList } from '@/api/listingService';

export const Profile = () => {
    const [activeTab, setActiveTab] = useState('myList');

    const { data: userInfo, isLoading: isLoadingUserInfo } = useQuery({
        queryKey: ['getMe'],
        queryFn: getMe,
        onSuccess: (data) => {
            console.log('Get Me data:', data);
        },
        onError: (err) => {
            console.log('Get me error', err.response.data.error);
        }
    });

    const { data: ownedPost, isLoading: isLoadingOwnedPost } = useQuery({
        queryKey: ['getOwned'],
        queryFn: getOwned,
        onSuccess: (data) => {
            console.log('Get owned data:', data);
        },
        onError: (err) => {
            console.log('Get owned error', err.response.data.error);
        }
    });

    const { data: savedPost, isLoading: isLoadingSavedPost } = useQuery({
        queryKey: ['getFavorites'],
        queryFn: getSavedList,
        onSuccess: (data) => {
            console.log('Get saved post data', data);
        },
        onError: (err) => {
            console.log('Get saved post error', err.response.data.error);
        }
    });

    return (
        <>
            {isLoadingUserInfo || isLoadingOwnedPost || isLoadingSavedPost ? (
                <Spinner />
            ) : (
                <div className="flex h-full overflow-y-scroll pr-12 pl-32">
                    {' '}
                    {/* Profile */}
                    <div className="flex-[3]">
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
                                        src="/user-default.png"
                                        className="h-[50px] w-[50px] rounded-full object-cover"
                                        alt="Avatar"
                                    />
                                    <div className="space-y-2 text-gray-700">
                                        <p className="text-lg font-medium">
                                            <span className="font-bold">
                                                Username:
                                            </span>{' '}
                                            {userInfo?.data.fullName}
                                        </p>

                                        <p className="text-lg font-medium">
                                            <span className="font-bold">
                                                Status:
                                            </span>{' '}
                                            {userInfo?.data.inActive === false
                                                ? 'Active'
                                                : 'Blocked'}
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
                                            onClick={() =>
                                                setActiveTab('myList')
                                            }
                                        >
                                            My List
                                        </button>
                                        <button
                                            className={`px-4 pb-2 text-lg font-semibold transition ${
                                                activeTab === 'savedList'
                                                    ? 'border-b-2 border-blue-500 text-blue-500'
                                                    : 'text-gray-500 hover:text-blue-500'
                                            }`}
                                            onClick={() =>
                                                setActiveTab('savedList')
                                            }
                                        >
                                            Saved List
                                        </button>
                                    </div>
                                    <Link to={'/add-post'}>
                                        <Button className="bg-amber-300 text-black hover:bg-amber-400">
                                            Add New Post
                                        </Button>
                                    </Link>
                                </div>

                                {/* Tab Content */}
                                <div className="mt-6 space-y-8">
                                    {activeTab === 'myList' &&
                                        ownedPost?.data?.map((item, index) => (
                                            <Card
                                                key={index}
                                                item={item}
                                                canUpdate={true}
                                            />
                                        ))}
                                    {activeTab === 'savedList' &&
                                        savedPost?.data?.map((item, index) => (
                                            <Card key={index} item={item} />
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Payment History */}
                    <div className="flex-[2]">
                        <ProfileFund userInfo={userInfo} />
                    </div>
                </div>
            )}
        </>
    );
};
