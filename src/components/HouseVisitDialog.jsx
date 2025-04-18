import React from 'react';
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

export const HouseVisitDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full bg-green-500 hover:bg-green-600">
                    <MessageSquareMore />
                    Schedule house visit
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
                            name="name"
                            placeholder="e.g John Doe"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone Number
                        </Label>
                        <Input
                            id="phone"
                            className="col-span-3"
                            placeholder="Enter your contact number"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            className="col-span-3"
                            name="email"
                            placeholder="example@example.com"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Date & Time
                        </Label>
                        <DateTimePicker />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Schedule Now</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
