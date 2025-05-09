import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
    getAllUserPostPayment,
    getAllUserListingPlan
} from '@/api/saleService';
import { Spinner } from '@/components/Spinner';
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
    CreditCard,
    Crown,
    Download,
    Home,
    ShieldCheck,
    Search,
    Tag,
    Trophy
} from 'lucide-react';

export const SalesMangementPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [tierFilter, setTierFilter] = useState('all');
    const [packageFilter, setPackageFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('user-quotas');

    const { data: postPayments, isLoading: isGettingPostPayments } = useQuery({
        queryKey: ['getAllUserPostPayments'],
        queryFn: getAllUserPostPayment,
        onSuccess: (res) => {
            console.log('Post Payments', res);
        },
        onError: (err) => {
            console.log('Post Payments Error', err);
        }
    });

    const { data: listingPlans, isLoading: isGettingListingPlans } = useQuery({
        queryKey: ['getAllUserListingPlans'],
        queryFn: getAllUserListingPlan,
        onSuccess: (res) => {
            console.log('Listing Plans', res);
        },
        onError: (err) => {
            console.log('Listing Plans Error', err.response.data.error);
        }
    });

    const filteredPostPayments =
        postPayments?.data?.filter((payment) => {
            const matchesSearch =
                !searchQuery ||
                payment.userId
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesTier =
                tierFilter === 'all' || payment.postTier === tierFilter;

            return matchesSearch && matchesTier;
        }) || [];

    const filteredListingPlans =
        listingPlans?.data?.filter((plan) => {
            const matchsSearch =
                !searchQuery ||
                plan.userId.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesPackage =
                packageFilter === 'all' ||
                plan.packetName.toLowerCase() === packageFilter.toLowerCase();

            return matchsSearch && matchesPackage;
        }) || [];

    const totalPostPaymentAmount =
        postPayments?.data?.reduce(
            (sum, p) => (p.paymentType === 'POST' ? sum + p.amount : sum),
            0
        ) || 0;

    const totalPlansRevenue =
        listingPlans?.data?.reduce((sum, plan) => sum + plan.amountPaid, 0) ||
        0;

    const totalPackageUsed =
        postPayments?.data?.filter((p) => p.paymentType === 'PACKAGE').length ||
        0;
    const totalDirectPayments =
        postPayments?.data?.filter((p) => p.paymentType === 'POST').length || 0;

    if (isGettingPostPayments || isGettingListingPlans) {
        return (
            <div className="flex h-full items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="h-full space-y-6 overflow-y-auto p-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Sales Management
                </h1>
                <p className="text-muted-foreground">
                    Monitor user quotas and post payments
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            $
                            {(
                                totalPostPaymentAmount + totalPlansRevenue
                            ).toLocaleString()}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Combined from quotas and direct payments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            User Quotas
                        </CardTitle>
                        <ShieldCheck className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {listingPlans?.data?.length || 0}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            ${totalPlansRevenue.toLocaleString()} total revenue
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Posts
                        </CardTitle>
                        <Home className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {postPayments?.data?.length || 0}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            {totalPackageUsed} from packages,{' '}
                            {totalDirectPayments} direct
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs Navigation */}
            <Tabs
                defaultValue="post-payments"
                className="space-y-4"
                value={activeTab}
                onValueChange={setActiveTab}
            >
                <TabsList>
                    <TabsTrigger
                        value="user-quotas"
                        className="flex items-center gap-2"
                    >
                        <ShieldCheck className="h-4 w-4" />
                        <span>User Quotas</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="post-payments"
                        className="flex items-center gap-2"
                    >
                        <Home className="h-4 w-4" />
                        <span>Post Payments</span>
                    </TabsTrigger>
                </TabsList>

                {/* Post Payments Tab */}
                <TabsContent value="post-payments" className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                        <div className="relative sm:w-72">
                            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                            <Input
                                placeholder="Search by phone number..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select
                                value={tierFilter}
                                onValueChange={setTierFilter}
                            >
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Filter by tier" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Tiers
                                    </SelectItem>
                                    <SelectItem value="VIP_GOLD">
                                        VIP Gold
                                    </SelectItem>
                                    <SelectItem value="VIP_SILVER">
                                        VIP Silver
                                    </SelectItem>
                                    <SelectItem value="REGULAR">
                                        Regular
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* Post Payments Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Phone Number</TableHead>
                                <TableHead>Post ID</TableHead>
                                <TableHead>Tier</TableHead>
                                <TableHead>Payment Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPostPayments.length > 0 ? (
                                filteredPostPayments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-medium text-pink-500">
                                            {payment.userId}
                                        </TableCell>
                                        <Link to={`/list/${payment.postId}`}>
                                            <TableCell className="cursor-pointer font-mono text-xs hover:underline">
                                                {payment.postId}
                                            </TableCell>
                                        </Link>
                                        <TableCell>
                                            {payment.postTier ===
                                                'VIP_GOLD' && (
                                                <Badge
                                                    variant="outline"
                                                    className="flex w-[90px] items-center gap-1 border-amber-200 bg-amber-50 text-amber-700"
                                                >
                                                    <Crown className="h-3 w-3" />{' '}
                                                    VIP Gold
                                                </Badge>
                                            )}
                                            {payment.postTier ===
                                                'VIP_SILVER' && (
                                                <Badge
                                                    variant="outline"
                                                    className="flex w-[90px] items-center gap-1 border-gray-200 bg-gray-100 text-gray-700"
                                                >
                                                    <Trophy className="h-3 w-3" />{' '}
                                                    VIP Silver
                                                </Badge>
                                            )}
                                            {payment.postTier === 'REGULAR' && (
                                                <Badge
                                                    variant="outline"
                                                    className="flex w-[90px] items-center gap-1 border-blue-200 bg-blue-50 text-blue-700"
                                                >
                                                    <Tag className="h-3 w-3" />{' '}
                                                    Regular
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {payment.paymentType ===
                                            'PACKAGE' ? (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100"
                                                >
                                                    Quota
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-green-100 text-green-700 hover:bg-green-100"
                                                >
                                                    Direct
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {payment.paymentType === 'POST' ? (
                                                <span className="font-semibold text-green-600">
                                                    $
                                                    {payment.amount.toLocaleString()}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="border-green-200 bg-green-50 text-green-700"
                                            >
                                                {payment.status.toLowerCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {format(
                                                new Date(payment.createdAt),
                                                'MMM dd, yyyy'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="h-24 text-center"
                                    >
                                        <div className="text-muted-foreground flex flex-col items-center justify-center">
                                            <ShieldCheck className="mb-2 h-8 w-8" />
                                            <span>
                                                No post payments match your
                                                filters
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TabsContent>

                {/* User Quotas Tab */}
                <TabsContent value="user-quotas" className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                        <div className="relative sm:w-72">
                            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                            <Input
                                placeholder="Search by phone number..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select
                                value={packageFilter}
                                onValueChange={setPackageFilter}
                            >
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Filter by package" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Packages
                                    </SelectItem>
                                    <SelectItem value="VIP">VIP</SelectItem>
                                    <SelectItem value="STANDARD">
                                        Standard
                                    </SelectItem>
                                    <SelectItem value="BASIC">Basic</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* User Quotas Table */}

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User ID</TableHead>
                                <TableHead>Package</TableHead>
                                <TableHead>Amount Paid</TableHead>
                                <TableHead>VIP Gold</TableHead>
                                <TableHead>VIP Silver</TableHead>
                                <TableHead>Regular</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Expires</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredListingPlans.length > 0 ? (
                                filteredListingPlans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell className="font-medium text-pink-500">
                                            {plan.userId}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`flex w-[100px] items-center gap-1 ${
                                                    plan.packetName === 'VIP'
                                                        ? 'border-amber-200 bg-amber-50 text-amber-700'
                                                        : plan.packetName ===
                                                            'STANDARD'
                                                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                                                          : 'border-gray-200 bg-gray-100 text-gray-700'
                                                } `}
                                            >
                                                {plan.packetName === 'VIP' ? (
                                                    <Crown className="h-3 w-3" />
                                                ) : plan.packetName ===
                                                  'STANDARD' ? (
                                                    <Trophy className="h-3 w-3" />
                                                ) : (
                                                    <Tag className="h-3 w-3" />
                                                )}
                                                {plan.packetName}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold text-green-600">
                                            ${plan.amountPaid.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="w-8 text-center font-medium text-amber-600">
                                                    {plan.vipGoldRemaining}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="w-8 text-center font-medium text-gray-600">
                                                    {plan.vipSilverRemaining}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="w-8 text-center font-medium text-blue-600">
                                                    {plan.regularRemaining}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {format(
                                                new Date(plan.createdAt),
                                                'MMM dd, yyyy'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {plan.expiredAt
                                                ? format(
                                                      new Date(plan.expiredAt),
                                                      'MMM dd, yyyy'
                                                  )
                                                : 'Never'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="h-24 text-center"
                                    >
                                        <div className="text-muted-foreground flex flex-col items-center justify-center">
                                            <ShieldCheck className="mb-2 h-8 w-8" />
                                            <span>
                                                No plans match your search
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </div>
    );
};
