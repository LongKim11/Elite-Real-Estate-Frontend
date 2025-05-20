import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProperty } from '@/api/listingService';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

export const DeletePropertyDialog = ({ propertyId, title }) => {
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation({
        mutationFn: deleteProperty,
        onSuccess: (res) => {
            console.log('Delete Property Response', res);
            setOpen(false);
            toast.success('Property deleted successfully');
            queryClient.invalidateQueries(['getListingAdmin']);
        },
        onError: (err) => {
            console.log('Delete Property Error', err.response?.data?.error);
            toast.error('Failed to delete property');
        }
    });

    const handleDeleteProperty = () => {
        mutate(propertyId);
    };

    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogTrigger asChild>
                <div className="inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-600">
                    <Trash className="h-5 w-5" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-red-600">
                        Delete Property
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this property? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-gray-500">
                        You are about to delete:{' '}
                        <span className="font-medium text-gray-900">
                            {title || 'This property'}
                        </span>
                    </p>
                    <div className="mt-2 rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Trash
                                    className="h-5 w-5 text-red-400"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Warning
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>
                                        Deleting this property will remove all
                                        associated data and will not refund any
                                        subscription plans.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex sm:justify-between">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDeleteProperty}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Please wait...
                            </div>
                        ) : (
                            <>Delete Property</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
