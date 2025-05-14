import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquareMore } from 'lucide-react';
import { DateTimePicker } from './DateTimePicker';
import { useMutation } from '@tanstack/react-query';
import { scheduleViewing } from '@/api/rentalService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { scheduleSchema } from '@/schemas/schedule.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const HouseVisitDialog = ({ id }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm({ resolver: zodResolver(scheduleSchema), mode: 'onSubmit' });

    const [openDialog, setOpenDialog] = useState(false);

    const { mutate: handleScheduleViewing, isLoading } = useMutation({
        mutationFn: scheduleViewing,
        onSuccess: (res) => {
            console.log(res);
            setOpenDialog(false);
            toast.success(res.message);
        },
        onError: (err) => {
            console.log('Viewing Schedule Error', err.response.data.err);
            setOpenDialog(false);
            toast.error(err.response.data.err);
        }
    });

    const onSubmit = (data) => {
        const requestBody = { propertyId: id, ...data };
        handleScheduleViewing(requestBody);
    };

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button className="w-full bg-green-500 hover:bg-green-600">
                    <MessageSquareMore />
                    Schedule House Visit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Schedule your visit</DialogTitle>
                    <DialogDescription>
                        Please enter your details and select a date and time.
                        Our agent will contact you to confirm your visit.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            {...register('viewerName')}
                            className="col-span-3"
                            placeholder="e.g John Doe"
                        />
                    </div>
                    {errors.viewerName && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="col-span-1"></span>
                            <p className="col-span-3 text-xs text-red-500">
                                {errors.viewerName.message}
                            </p>
                        </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone Number
                        </Label>
                        <Input
                            {...register('viewerPhone')}
                            className="col-span-3"
                            placeholder="Enter your contact number"
                        />
                    </div>
                    {errors.viewerPhone && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="col-span-1"></span>
                            <p className="col-span-3 text-xs text-red-500">
                                {errors.viewerPhone.message}
                            </p>
                        </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            {...register('viewerEmail')}
                            className="col-span-3"
                            placeholder="example@example.com"
                        />
                    </div>
                    {errors.viewerEmail && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="col-span-1"></span>
                            <p className="col-span-3 text-xs text-red-500">
                                {errors.viewerEmail.message}
                            </p>
                        </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                            Notes
                        </Label>
                        <Input
                            {...register('viewerNotes')}
                            className="col-span-3"
                            placeholder="Add any special notes here..."
                        />
                    </div>
                    {errors.viewerNotes && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="col-span-1"></span>
                            <p className="col-span-3 text-xs text-red-500">
                                {errors.viewerNotes.message}
                            </p>
                        </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date-time" className="text-right">
                            Date & Time
                        </Label>
                        <div className="col-span-3 flex w-full gap-4">
                            <DateTimePicker
                                className="w-full"
                                onChange={(value) => {
                                    setValue('scheduledAt', value, {
                                        shouldValidate: true
                                    });
                                }}
                            />
                        </div>
                    </div>
                    {errors.scheduledAt && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="col-span-1"></span>
                            <p className="col-span-3 text-xs text-red-500">
                                {errors.scheduledAt.message}
                            </p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                    >
                        {' '}
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Please wait...
                            </div>
                        ) : (
                            <>Schedule Now</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
