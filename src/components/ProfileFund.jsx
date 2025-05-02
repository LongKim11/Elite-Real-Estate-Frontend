import React from 'react';
import { FundHistoryCard } from './FundHistoryCard';
import { PostPaymentHistoryCard } from './PostPaymentHistoryCard';
import { AddFundDialog } from './AddFundDialog';
import { format } from 'date-fns';
import { Shield, Clock, CreditCard, DollarSign, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getValidListingPlanByUser } from '@/api/saleService';
import { Link } from 'react-router-dom';

export const ProfileFund = ({ userInfo }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['getValidListingPlan'],
        queryFn: getValidListingPlanByUser,
        onSuccess: (res) => {
            console.log('Valid Listing Plan', res);
        },
        onError: (err) => {
            console.log('Valid Listing Plan Error', err.response.data.error);
        }
    });

    const listingPlans = data?.data;

    return (
        <div className="mt-5 h-full">
            <div className="rounded-md border bg-white p-6 shadow-md">
                <div className="flex items-center justify-between border-b pb-4">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Fund Management
                    </h1>
                    <div className="w-fit">
                        <AddFundDialog />
                    </div>
                </div>

                {/* Current Balance */}
                <div className="mt-5 rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-5">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-green-200 p-3">
                            <DollarSign className="h-6 w-6 text-green-700" />
                        </div>
                        <div>
                            <p className="text-lg text-gray-600">
                                Current Balance
                            </p>
                            <p className="text-3xl font-bold text-gray-800">
                                {userInfo?.data.balance.toLocaleString() ||
                                    '0.00'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Listing Plans Section */}
                <div className="mt-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Your Listing Plans
                        </h2>
                        {listingPlans?.length > 0 && (
                            <Link to={'/listing-plan'}>
                                <button className="rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200">
                                    Buy More Plans
                                </button>
                            </Link>
                        )}
                    </div>
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            Loading your listing plans...
                        </div>
                    ) : (
                        <>
                            {listingPlans && listingPlans.length > 0 ? (
                                <div className="space-y-4">
                                    {listingPlans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                                        >
                                            {/* Plan Header */}
                                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Shield className="h-5 w-5 text-blue-600" />
                                                        <h3 className="text-lg font-medium text-gray-800">
                                                            {plan.packetName}
                                                        </h3>
                                                    </div>
                                                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                                                        {plan.amountPaid.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Plan Details */}
                                            <div className="p-5">
                                                <div className="mb-4 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-3">
                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-600">
                                                            VIP Gold
                                                        </p>
                                                        <p className="text-2xl font-bold text-amber-600">
                                                            {
                                                                plan.vipGoldRemaining
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            remaining
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-600">
                                                            VIP Silver
                                                        </p>
                                                        <p className="text-2xl font-bold text-gray-500">
                                                            {
                                                                plan.vipSilverRemaining
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            remaining
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-600">
                                                            Regular
                                                        </p>
                                                        <p className="text-2xl font-bold text-blue-600">
                                                            {
                                                                plan.regularRemaining
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            remaining
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Clock className="h-4 w-4" />
                                                        <span>
                                                            Expires: Never
                                                            Expires
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <CreditCard className="h-4 w-4" />
                                                        <span>
                                                            Purchased:{' '}
                                                            {format(
                                                                new Date(
                                                                    plan.createdAt
                                                                ),
                                                                'MMM d, yyyy HH:mm'
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                                    <Shield className="h-12 w-12 text-gray-300" />
                                    <h3 className="mt-2 text-lg font-medium text-gray-700">
                                        No Active Listing Plans
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Purchase a plan to start creating
                                        property listings
                                    </p>
                                    <Link to={'/listing-plan'}>
                                        <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                            Purchase Your First Plan
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Navigation Cards */}
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Payment History Card */}
                    <FundHistoryCard />

                    {/* Post Payment Card */}
                    <PostPaymentHistoryCard />
                </div>
            </div>
        </div>
    );
};
