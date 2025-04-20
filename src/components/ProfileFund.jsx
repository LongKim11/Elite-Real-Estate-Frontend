import { Button } from '@/components/ui/button';
import React from 'react';
import { FundHistoryCard } from './FundHistoryCard';
import { PostPaymentHistoryCard } from './PostPaymentHistoryCard';
import { AddFundDialog } from './AddFundDialog';

export const ProfileFund = () => {
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
                <div className="mt-6 rounded-lg bg-amber-50 p-4">
                    <p className="text-lg text-gray-600">Current Balance</p>
                    <p className="text-3xl font-bold text-gray-800">$175.00</p>
                </div>

                {/* Navigation Cards */}
                <div className="mt-8 grid grid-cols-2 gap-6">
                    {/* Payment History Card */}
                    <FundHistoryCard />

                    {/* Post Payment Card */}
                    <PostPaymentHistoryCard />
                </div>

                {/* Recent Activity Preview */}
                <div className="mt-8 border-t pt-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-700">
                            Recent Activity
                        </h2>
                        <Button variant="ghost" size="sm" className="text-sm">
                            View All
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {/* Recent transactions preview */}
                        <div className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50">
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-800">
                                    Deposit
                                </span>
                                <span className="text-sm text-gray-500">
                                    2023-05-15
                                </span>
                            </div>
                            <span className="font-semibold text-green-600">
                                +$50.00
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50">
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-800">
                                    Post Payment
                                </span>
                                <span className="text-sm text-gray-500">
                                    2023-05-12
                                </span>
                            </div>
                            <span className="font-semibold text-red-600">
                                -$15.00
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50">
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-800">
                                    Post Payment
                                </span>
                                <span className="text-sm text-gray-500">
                                    2023-05-10
                                </span>
                            </div>
                            <span className="font-semibold text-red-600">
                                -$25.00
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
