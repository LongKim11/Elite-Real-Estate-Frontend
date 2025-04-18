import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

export function DateTimePicker({ className }) {
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const [open, setOpen] = useState(false);

    // Generate hours for the time picker
    const hours = Array.from({ length: 24 }, (_, i) => {
        return { value: i, label: i.toString().padStart(2, '0') };
    });

    // Generate minutes for the time picker
    const minutes = Array.from({ length: 60 }, (_, i) => {
        return { value: i, label: i.toString().padStart(2, '0') };
    });

    // Format the selected date and time for display
    const formatDateTime = () => {
        if (!date) return 'Pick a date and time';

        const formattedDate = format(date, 'PPP');

        if (!time) return formattedDate;

        return `${formattedDate} at ${time}`;
    };

    // Handle time selection
    const handleTimeChange = (value) => {
        setTime(value);
    };

    return (
        <div className={cn('grid w-full gap-2', className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDateTime()}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        classNames={{
                            months: 'flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1',
                            month: 'space-y-4 w-full flex flex-col',
                            table: 'w-full h-full border-collapse space-y-1',
                            head_row: '',
                            row: 'w-full mt-2'
                        }}
                        className="flex h-full w-full"
                    />
                    <div className="border-border border-t p-3">
                        <div className="flex items-center gap-2">
                            <Clock className="text-muted-foreground h-4 w-4" />
                            <div className="grid w-full grid-cols-2 gap-2">
                                <Select
                                    onValueChange={(value) => {
                                        const hour = value.padStart(2, '0');
                                        const minute = time
                                            ? time.split(':')[1]
                                            : '00';
                                        handleTimeChange(`${hour}:${minute}`);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Hour" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hours.map((hour) => (
                                            <SelectItem
                                                key={hour.value}
                                                value={hour.label}
                                                className="hover:bg-gray-100"
                                            >
                                                {hour.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    onValueChange={(value) => {
                                        const hour = time
                                            ? time.split(':')[0]
                                            : '00';
                                        const minute = value.padStart(2, '0');
                                        handleTimeChange(`${hour}:${minute}`);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Minute" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {minutes.map((minute) => (
                                            <SelectItem
                                                key={minute.value}
                                                value={minute.label}
                                                className="hover:bg-gray-100"
                                            >
                                                {minute.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button
                                size="sm"
                                onClick={() => {
                                    if (date) setOpen(false);
                                }}
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
