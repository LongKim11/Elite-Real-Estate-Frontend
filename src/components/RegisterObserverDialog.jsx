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
import { Bookmark } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { registerObserver } from '@/api/listingService';

export const RegisterObserverDialog = ({ id }) => {
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');

    const { mutate: handleRegisterObserver } = useMutation({
        mutationFn: registerObserver,
        onSuccess: (res) => {
            console.log('Register Observer: ', res);
            toast.success(res.message);
            setOpen(false);
            setError('');
        },
        onError: (err) => {
            console.log('Register Observer Error:', err.response.data.error);
            toast.success(err.response.data.error);
            setOpen(false);
            setError('');
        }
    });

    const handleRegisterInterest = () => {
        if (email.length > 0 && email.includes('@')) {
            handleRegisterObserver(id, email);
        } else {
            setError('Please enter a valid email address.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    <Bookmark className="mr-2" size={18} />
                    <span>Get Property Updates</span>
                </Button>
            </DialogTrigger>
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
                            id="email"
                            type="email"
                            placeholder="e,g. example@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <p className="text-sm text-red-500">{error}</p>
                </div>

                <DialogFooter>
                    <Button onClick={handleRegisterInterest}>Register</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
