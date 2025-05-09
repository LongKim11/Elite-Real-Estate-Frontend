import React, { useState } from 'react';
import { getAllSchedule } from '@/api/rentalService';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/Spinner';
import { format } from 'date-fns';
import {
    Search,
    Trophy,
    Phone,
    Mail,
    Clock,
    RefreshCcw,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

// Status Badge Component
const StatusBadge = ({ status }) => {
    switch (status?.toLowerCase()) {
        case 'confirmed':
            return (
                <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Confirmed
                </Badge>
            );
        case 'cancelled':
            return (
                <Badge className="bg-red-100 text-red-800">
                    <XCircle className="mr-1 h-3.5 w-3.5" /> Cancelled
                </Badge>
            );
        case 'completed':
            return (
                <Badge className="bg-blue-100 text-blue-800">
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Completed
                </Badge>
            );
        case 'pending':
            return (
                <Badge className="bg-amber-100 text-amber-800">
                    <Clock className="mr-1 h-3.5 w-3.5" /> Pending
                </Badge>
            );
        default:
            return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
};

export const RentalManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const { data, isLoading } = useQuery({
        queryKey: ['getAllSchedule'],
        queryFn: getAllSchedule,
        onSuccess: (res) => {
            console.log('All Schedules', res);
        },
        onError: (err) => {
            console.log('All Schedule Error', err?.response?.data?.error);
        }
    });

    const formatDateTime = (dateString) => {
        try {
            return format(new Date(dateString), "dd/MM/yyyy 'at' h:mm a");
        } catch (e) {
            console.log('Format date error', e);
            return 'Invalid date';
        }
    };

    const schedules = data?.data || [];

    const pendingSchedules = schedules.filter(
        (s) => s?.status?.toLowerCase() === 'pending'
    ).length;

    const confirmedSchedules = schedules.filter(
        (s) => s?.status?.toLowerCase() === 'confirmed'
    ).length;

    const completedSchedules = schedules.filter(
        (s) => s?.status?.toLowerCase() === 'completed'
    ).length;

    const cancelledSchedules = schedules.filter(
        (s) => s?.status?.toLowerCase() === 'cancelled'
    ).length;

    const filteredSchedules = schedules.filter((schedule) => {
        const matchesSearch =
            searchTerm === '' ||
            schedule.viewerName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            schedule.viewerPhone?.includes(searchTerm);

        const matchesStatus =
            statusFilter === 'all' ||
            schedule.status?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    if (isLoading)
        return (
            <div className="flex h-full items-center justify-center">
                <Spinner />
            </div>
        );

    return (
        <div className="h-full space-y-6 overflow-y-auto p-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Rental Management
                </h1>
                <p className="text-muted-foreground">
                    Manage property viewing schedules and track appointments.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending
                        </CardTitle>
                        <Clock className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {pendingSchedules}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Awaiting confirmation
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Confirmed
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {confirmedSchedules}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Ready for viewing
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Completed
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {completedSchedules}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Successfully viewed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Cancelled
                        </CardTitle>
                        <XCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {cancelledSchedules}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            No longer scheduled
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <div className="relative sm:w-72">
                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search by name or phone..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge
                        className={`cursor-pointer px-3 py-1 text-sm ${
                            statusFilter === 'all'
                                ? 'bg-gray-800 text-white hover:bg-gray-700'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                        onClick={() => setStatusFilter('all')}
                    >
                        All
                    </Badge>
                    <Badge
                        className={`cursor-pointer px-3 py-1 text-sm ${
                            statusFilter === 'pending'
                                ? 'bg-amber-500 text-white hover:bg-amber-400'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        onClick={() => setStatusFilter('pending')}
                    >
                        Pending
                    </Badge>
                    <Badge
                        className={`cursor-pointer px-3 py-1 text-sm ${
                            statusFilter === 'confirmed'
                                ? 'bg-green-500 text-white hover:bg-green-400'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                        onClick={() => setStatusFilter('confirmed')}
                    >
                        Confirmed
                    </Badge>
                    <Badge
                        className={`cursor-pointer px-3 py-1 text-sm ${
                            statusFilter === 'completed'
                                ? 'bg-blue-500 text-white hover:bg-blue-400'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        }`}
                        onClick={() => setStatusFilter('completed')}
                    >
                        Completed
                    </Badge>
                    <Badge
                        className={`cursor-pointer px-3 py-1 text-sm ${
                            statusFilter === 'cancelled'
                                ? 'bg-red-500 text-white hover:bg-red-400'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        onClick={() => setStatusFilter('cancelled')}
                    >
                        Cancelled
                    </Badge>
                </div>
            </div>

            {/* Schedules Table */}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Viewer</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Property ID</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredSchedules.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                <div className="mt-12 flex flex-col items-center justify-center text-gray-500">
                                    <AlertCircle className="mb-2 h-8 w-8" />
                                    <p>No schedules found</p>
                                    <p className="text-sm text-gray-400">
                                        {searchTerm || statusFilter !== 'all'
                                            ? 'Try changing your search filters'
                                            : 'No scheduled viewings available'}
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredSchedules.map((schedule) => (
                            <TableRow
                                key={schedule.id}
                                className="hover:bg-gray-50"
                            >
                                <TableCell className="font-medium">
                                    {schedule.viewerName}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-3 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-3 w-3 text-gray-500" />
                                            <span>{schedule.viewerPhone}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Mail className="h-3 w-3 text-gray-500" />
                                            <span className="cursor-pointer text-blue-600 hover:underline">
                                                {schedule.viewerEmail}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                    {schedule.propertyId}
                                </TableCell>
                                <TableCell>
                                    {formatDateTime(schedule.scheduledAt)}
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={schedule.status} />
                                </TableCell>
                                <TableCell>
                                    <p className="truncate text-sm">
                                        {schedule.viewNotes ||
                                            'No notes provided'}
                                    </p>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
