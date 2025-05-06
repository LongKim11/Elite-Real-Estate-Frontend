import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
    Phone,
    Mail,
    FileText,
    Clock,
    CalendarHeart,
    Check,
    CheckCheck,
    Trash2,
    Loader2
} from 'lucide-react';
import {
    getPropertySchedule,
    updateScheduleStatus,
    deleteSchedule
} from '@/api/rentalService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const PropertySchedule = ({ propertyId }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['getPropertySchedule', propertyId],
        queryFn: () => getPropertySchedule(propertyId),
        onSuccess: (res) => {
            console.log('Property Schedule', res);
        },
        onError: (err) => {
            console.log('Property Schedule Error', err.response.data.error);
        },
        enabled: open && !!propertyId
    });

    const { mutate: mutateUpdateStatus, isLoading: isUpdating } = useMutation({
        mutationFn: ({ id, status }) => updateScheduleStatus(id, status),
        onSuccess: (res) => {
            console.log('Update Schedule Status', res);
            queryClient.invalidateQueries(['getPropertySchedule', propertyId]);
        },
        onError: (err) => {
            console.log(
                'Update Schedule Status Error',
                err.response.data.error
            );
        }
    });

    const { mutate: mutateDelete, isLoading: isDeleting } = useMutation({
        mutationFn: (id) => deleteSchedule(id),
        onSuccess: (res) => {
            console.log('Delete Schedule', res);
            queryClient.invalidateQueries(['getPropertySchedule', propertyId]);
        },
        onError: (err) => {
            console.log('Delete Schedule Error', err.response.data.error);
        }
    });

    const handleUpdateScheduleStatus = (id, status) => {
        mutateUpdateStatus({ id, status });
    };

    const handleDeleteSchedule = (id) => {
        mutateDelete(id);
    };

    const schedules = data?.data;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-red-500 transition hover:bg-red-100 hover:text-red-600">
                    <CalendarHeart className="h-5 w-5" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>House Visit Schedules</DialogTitle>
                    <DialogDescription>
                        View and manage all scheduled house visits.
                    </DialogDescription>
                </DialogHeader>

                {isLoading && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Loading Schedules...
                    </div>
                )}

                <div className="max-h-[60vh] overflow-y-auto pr-2">
                    {schedules?.map((schedule) => (
                        <div
                            key={schedule.id}
                            className="group my-7 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                            <div className="p-5">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {schedule.viewerName}
                                    </h3>
                                    <Badge
                                        className={`${getStatusColor(schedule.status.toLowerCase())} px-3 py-1`}
                                    >
                                        {schedule.status}
                                    </Badge>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                            <Phone className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <span className="text-gray-700">
                                            {schedule.viewerPhone}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-end gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                                            <Mail className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <span className="text-gray-700">
                                            {schedule.viewerEmail}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                                            <Clock className="h-4 w-4 text-amber-600" />
                                        </div>
                                        <span className="font-medium text-gray-700">
                                            {schedule.scheduledAt !== null &&
                                                format(
                                                    schedule.scheduledAt,
                                                    'PPP'
                                                )}{' '}
                                            at{' '}
                                            {schedule.scheduledAt !== null &&
                                                format(
                                                    schedule.scheduledAt,
                                                    'p'
                                                )}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 md:col-span-2">
                                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                            <FileText className="h-4 w-4 text-green-600" />
                                        </div>
                                        <p className="text-gray-600">
                                            {schedule.viewNotes}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-gray-200 pt-4">
                                    {schedule.status === 'PENDING' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={isUpdating}
                                            className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                                            onClick={() =>
                                                handleUpdateScheduleStatus(
                                                    schedule.id,
                                                    'confirm'
                                                )
                                            }
                                        >
                                            {isUpdating ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    Please wait...
                                                </div>
                                            ) : (
                                                <>
                                                    <Check className="mr-1 h-4 w-4" />
                                                    Confirm
                                                </>
                                            )}
                                        </Button>
                                    )}

                                    {schedule.status === 'CONFIRMED' && (
                                        <Button
                                            disabled={isUpdating}
                                            size="sm"
                                            variant="outline"
                                            className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                            onClick={() =>
                                                handleUpdateScheduleStatus(
                                                    schedule.id,
                                                    'complete'
                                                )
                                            }
                                        >
                                            {isUpdating ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    Please wait...
                                                </div>
                                            ) : (
                                                <>
                                                    <CheckCheck className="mr-1 h-4 w-4" />
                                                    Complete
                                                </>
                                            )}
                                        </Button>
                                    )}
                                    {schedule.status !== 'CANCELLED' &&
                                        schedule.status !== 'COMPLETED' && (
                                            <Button
                                                disabled={isDeleting}
                                                size="sm"
                                                variant="outline"
                                                className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                onClick={() =>
                                                    handleDeleteSchedule(
                                                        schedule.id
                                                    )
                                                }
                                            >
                                                {isDeleting ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        Please wait...
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Trash2 className="mr-1 h-4 w-4" />
                                                        Cancell
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {schedules?.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <CalendarHeart className="h-12 w-12 text-gray-300" />
                            <h3 className="mt-4 text-lg font-medium text-gray-700">
                                No scheduled visits
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                There are currently no scheduled property
                                visits.
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
