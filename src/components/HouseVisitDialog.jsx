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

export const HouseVisitDialog = ({ id }) => {
    const [openDialog, setOpenDialog] = useState(false);

    const [formData, setFormData] = useState({
        propertyId: id,
        viewerName: '',
        viewerPhone: '',
        viewerEmail: '',
        viewNotes: '',
        scheduledAt: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { mutate: handleSchduleViewing, isLoading } = useMutation({
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

    const handleBookingVisit = () => {
        console.log('Viewer info', formData);
        handleSchduleViewing(formData);
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
                            id="name"
                            className="col-span-3"
                            name="viewerName"
                            placeholder="e.g John Doe"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone Number
                        </Label>
                        <Input
                            id="phone"
                            name="viewerPhone"
                            className="col-span-3"
                            placeholder="Enter your contact number"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            className="col-span-3"
                            name="viewerEmail"
                            placeholder="example@example.com"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                            Notes
                        </Label>
                        <Input
                            id="notes"
                            className="col-span-3"
                            name="viewNotes"
                            placeholder="Add any special notes here..."
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date-time" className="text-right">
                            Date & Time
                        </Label>
                        <div className="col-span-3 flex w-full gap-4">
                            <DateTimePicker
                                className="w-full"
                                onChange={(value) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        scheduledAt: value
                                    }));
                                }}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleBookingVisit} disabled={isLoading}>
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
