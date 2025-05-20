import React from 'react';
import { Users, Newspaper, Wallet, ShoppingCart } from 'lucide-react';
import { MonthlySalesChart } from '@/components/MonthlySalesChart';
import { UserQuotaDistribution } from '@/components/UserQuotaDistribution';
import { PropertyDistributionChart } from '@/components/PropertyDistributionChart';
import { useQuery } from '@tanstack/react-query';
import { getOverviewStatistics } from '@/api/authService';
import { Spinner } from '@/components/Spinner';

export const DashboardPage = () => {
    const { data: overviewStatistics, isLoading: isGettingOverviewStatistics } =
        useQuery({
            queryKey: ['getOverviewStatistics'],
            queryFn: getOverviewStatistics,
            onSuccess: (res) => {
                console.log('Overview Statistics', res);
            },
            onError: (err) => {
                console.log(
                    'Overview Statistics Error',
                    err.response.data.error
                );
            }
        });

    const totalUsers =
        overviewStatistics !== undefined &&
        overviewStatistics?.data?.userStatistics?.userRegistrationsByTimePeriod
            ?.TotalUsers;

    const totalProperties =
        overviewStatistics !== undefined &&
        Object.values(
            overviewStatistics?.data?.listingStatistics.propertyTypeCounts
        ).reduce((sum, value) => sum + value, 0);

    const totalDeposits =
        overviewStatistics !== undefined &&
        overviewStatistics?.data?.walletTopupStatistics?.topupAmountsByStatus
            ?.Success.Total;

    const totalPostSales =
        overviewStatistics !== undefined &&
        Object.values(
            overviewStatistics?.data?.salesStatistics
                ?.totalAmountByStatusAndTier?.SUCCESS
        ).reduce((sum, value) => sum + value, 0);

    const userQuotasCount =
        overviewStatistics !== undefined &&
        overviewStatistics?.data?.salesStatistics.packetSalesCount;

    const propertyDistribution =
        overviewStatistics !== undefined &&
        overviewStatistics?.data?.listingStatistics?.propertyTypeCounts;

    const dashboardData = {
        users: totalUsers,
        posts: totalProperties,
        deposits: totalDeposits,
        sales: totalPostSales
    };

    if (isGettingOverviewStatistics) {
        return (
            <div className="flex h-full items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Users Card */}
                <div className="rounded-2xl bg-blue-600 p-6 shadow-lg transition-all hover:shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold tracking-wide text-white/80">
                                REGISTERED USERS
                            </p>
                            <p className="mt-2 text-3xl font-extrabold text-white">
                                {dashboardData.users}
                            </p>
                        </div>
                        <div className="rounded-full bg-white/20 p-3">
                            <Users
                                className="text-white"
                                size={28}
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <span className="font-semibold text-green-300">
                            +12%
                        </span>
                        <span className="ml-2 text-sm text-white/80">
                            since last month
                        </span>
                    </div>
                </div>

                {/* Total Posts Card */}
                <div className="rounded-2xl bg-amber-500 p-6 shadow-lg transition-all hover:shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold tracking-wide text-white/90">
                                PROPERTY VOLUMES
                            </p>
                            <p className="mt-2 text-3xl font-extrabold text-white">
                                {dashboardData.posts}
                            </p>
                        </div>
                        <div className="rounded-full bg-white/30 p-3">
                            <Newspaper
                                className="text-white"
                                size={28}
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <span className="font-semibold text-green-100">
                            +5%
                        </span>
                        <span className="ml-2 text-sm text-white/90">
                            since last month
                        </span>
                    </div>
                </div>

                {/* Total Deposits Card */}
                <div className="rounded-2xl bg-green-500 p-6 shadow-lg transition-all hover:shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold tracking-wide text-white/90">
                                TOTAL DEPOSITS
                            </p>
                            <p className="mt-2 text-3xl font-extrabold text-white">
                                ${dashboardData.deposits.toLocaleString()}
                            </p>
                        </div>
                        <div className="rounded-full bg-white/30 p-3">
                            <Wallet
                                className="text-white"
                                size={28}
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <span className="font-semibold text-white">+18%</span>
                        <span className="ml-2 text-sm text-white/90">
                            since last month
                        </span>
                    </div>
                </div>

                {/* Total Sales Card */}
                <div className="rounded-2xl bg-indigo-500 p-6 shadow-lg transition-all hover:shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold tracking-wide text-white/90">
                                POST SALES
                            </p>
                            <p className="mt-2 text-3xl font-extrabold text-white">
                                ${dashboardData.sales.toLocaleString()}
                            </p>
                        </div>
                        <div className="rounded-full bg-white/30 p-3">
                            <ShoppingCart
                                className="text-white"
                                size={28}
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <span className="font-semibold text-white">+24%</span>
                        <span className="ml-2 text-sm text-white/90">
                            since last month
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-6 space-y-6">
                <MonthlySalesChart />

                <div className="grid grid-cols-1 gap-6 overflow-hidden md:grid-cols-2">
                    <UserQuotaDistribution userQuotasCount={userQuotasCount} />

                    <PropertyDistributionChart
                        propertyDistribution={propertyDistribution}
                    />
                </div>
            </div>
        </div>
    );
};
