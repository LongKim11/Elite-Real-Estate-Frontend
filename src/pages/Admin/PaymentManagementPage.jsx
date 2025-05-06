import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getAllPayment } from '@/api/paymentService';
import { Spinner } from '@/components/Spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Download,
    CheckCircle,
    XCircle,
    Search,
    ArrowUpDown,
    Wallet,
    RefreshCcw
} from 'lucide-react';

export const PaymentManagementPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const { data, isLoading } = useQuery({
        queryKey: ['getAllPayment'],
        queryFn: getAllPayment,
        onSuccess: (res) => {
            console.log('All Payment', res);
        },
        onError: (err) => {
            console.log('All Payment Error', err.response?.data?.error);
        }
    });

    const filteredData =
        data?.data?.filter((payment) => {
            const matchesSearch =
                !searchQuery ||
                payment.phoneNumber
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'success' && payment.status === true) ||
                (statusFilter === 'failed' && payment.status === false);

            return matchesSearch && matchesStatus;
        }) || [];

    const totalAmount =
        data?.data?.reduce(
            (sum, payment) => (payment.status ? sum + payment.amount : sum),
            0
        ) || 0;

    const successCount =
        data?.data?.filter((payment) => payment.status).length || 0;

    const failedCount =
        data?.data?.filter((payment) => !payment.status).length || 0;

    if (isLoading)
        return (
            <div className="flex h-full items-center justify-center">
                <Spinner />
            </div>
        );

    return (
        <div className="h-full space-y-6 overflow-y-auto p-6">
            {/* Page Header */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Payment Management
                    </h1>
                    <p className="text-muted-foreground">
                        Monitor and manage all payment transactions
                    </p>
                </div>
                <Button className="w-full md:w-auto">
                    <Download className="mr-2 h-4 w-4" />
                    Export Transactions
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Volume
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${totalAmount.toLocaleString()}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            {data?.data?.length || 0} total transactions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Successful Transactions
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{successCount}</div>
                        <p className="text-muted-foreground text-xs">
                            {data?.data?.length
                                ? (
                                      (successCount / data.data.length) *
                                      100
                                  ).toFixed(1)
                                : 0}
                            % success rate
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Failed Transactions
                        </CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{failedCount}</div>
                        <p className="text-muted-foreground text-xs">
                            {data?.data?.length
                                ? (
                                      (failedCount / data.data.length) *
                                      100
                                  ).toFixed(1)
                                : 0}
                            % failure rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Table Controls */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-64">
                    <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                    <Input
                        placeholder="Search by phone number..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="success">Successful</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon">
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Payments Table */}
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>User Phone</TableHead>
                            <TableHead>
                                <div className="flex items-center">
                                    Amount
                                    <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                                </div>
                            </TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((payment) => (
                                <TableRow key={payment.walletTopupsId}>
                                    <TableCell className="font-mono text-xs text-blue-600">
                                        {payment.walletTopupsId}
                                    </TableCell>
                                    <TableCell className="font-medium text-pink-500">
                                        {payment.phoneNumber}
                                    </TableCell>
                                    <TableCell className="font-medium text-amber-600">
                                        ${payment.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-600">
                                        {format(
                                            new Date(payment.createdTime),
                                            'MMM dd, yyyy HH:mm'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {payment.status ? (
                                            <Badge
                                                variant="outline"
                                                className="border-green-200 bg-green-50 text-green-700"
                                            >
                                                <CheckCircle className="mr-1 h-3 w-3" />{' '}
                                                Successful
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="border-red-200 bg-red-50 text-red-700"
                                            >
                                                <XCircle className="mr-1 h-3 w-3" />{' '}
                                                Failed
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right"></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-muted-foreground h-24 text-center"
                                >
                                    No payments match your filters
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
