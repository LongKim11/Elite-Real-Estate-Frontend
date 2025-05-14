import React, { useState } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Bookmark, BellRing, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerObserver } from '@/api/listingService';
import { useForm } from 'react-hook-form';
import { observerSchema } from '@/schemas/observer.schema';
import { zodResolver } from '@hookform/resolvers/zod';

export const RegisterObserverDialog = ({ id, isFollowed }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(observerSchema),
        mode: 'onSubmit'
    });

    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const { mutate: handleRegisterObserver, isLoading } = useMutation({
        mutationFn: registerObserver,
        onSuccess: (res) => {
            console.log('Register Observer: ', res);
            toast.success(res.message);
            queryClient.invalidateQueries(['property-details', id]);
            setOpen(false);
        },
        onError: (err) => {
            console.log('Register Observer Error:', err.response.data.error);
            toast.success(err.response.data.error);
            setOpen(false);
        }
    });

    const onSubmit = (data) => {
        handleRegisterObserver({ id, email: data.email });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {isFollowed === '0' && (
                <DialogTrigger asChild>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                        <Bookmark className="mr-2" size={18} />
                        <span>Get Property Updates</span>
                    </Button>
                </DialogTrigger>
            )}

            {isFollowed === '1' && (
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    <BellRing className="mr-2" size={18} />
                    <span>Updates Are On</span>
                </Button>
            )}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Stay Updated</DialogTitle>
                    <DialogDescription>
                        Enter your email to receive notifications whenever this
                        property listing is updated.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            {...register('email')}
                            type="email"
                            placeholder="e,g. example@example.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Please wait...
                            </div>
                        ) : (
                            <>Register</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
