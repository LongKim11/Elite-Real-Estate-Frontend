import React, { useState } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard } from 'lucide-react';
import { createPayment } from '@/api/paymentService';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

export const AddFundDialog = () => {
    const [paymentMethod, setPaymentMethod] = useState('vnpay');
    const [addAmount, setAddAmount] = useState(50000);

    const { mutate: handleAddFunds, isLoading } = useMutation({
        mutationFn: () => createPayment(addAmount),
        onSuccess: (data) => {
            console.log(data);
            if (data?.data) {
                window.location.href = data.data;
            }
        },
        onError: (err) => {
            console.log('Payment Error', err.response.data.message);
        }
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Funds
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Funds to Your Account</DialogTitle>
                    <DialogDescription>
                        Add money to your account to pay for posts and services.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="flex items-center">
                            <span className="mr-2">VND</span>
                            <Input
                                id="amount"
                                type="number"
                                value={addAmount}
                                onChange={(e) => setAddAmount(e.target.value)}
                                min={1}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between gap-2">
                        {[10, 25, 50, 100, 200, 500].map((amount) => (
                            <Button
                                key={amount}
                                variant="outline"
                                size="sm"
                                onClick={() => setAddAmount(amount * 1000)}
                                className={
                                    addAmount === amount * 1000
                                        ? 'border-primary'
                                        : ''
                                }
                            >
                                {amount}K
                            </Button>
                        ))}
                    </div>

                    <div className="cursor-p grid gap-2 pt-2">
                        <Label>Payment Method</Label>
                        <RadioGroup
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                            className="grid gap-3"
                        >
                            <div
                                className={`flex items-center space-x-2 rounded-md border p-4 ${paymentMethod === 'vnpay' ? 'border border-blue-500 bg-blue-50' : ''}`}
                            >
                                <RadioGroupItem value="vnpay" id="vnpay" />
                                <Label
                                    htmlFor="vnpay"
                                    className="flex flex-1 items-center justify-between"
                                >
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src="/vnpay-logo.png"
                                            alt="VNPAY"
                                            className="h-5 w-7"
                                        ></img>
                                        <span>VNPay</span>
                                    </div>
                                </Label>
                            </div>
                            <div
                                className={`flex items-center space-x-2 rounded-md border p-4 ${paymentMethod === 'momo' ? 'border border-pink-500 bg-pink-50' : ''}`}
                            >
                                <RadioGroupItem value="momo" id="momo" />
                                <Label
                                    htmlFor="momo"
                                    className="flex flex-1 items-center justify-between"
                                >
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src="/momo-logo.png"
                                            alt="MOMO"
                                            className="h-7 w-7"
                                        ></img>
                                        <span>MoMo</span>
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => handleAddFunds()} className="w-full">
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Please wait...
                            </div>
                        ) : (
                            <>
                                {' '}
                                <CreditCard className="mr-2 h-4 w-4" /> Add{' '}
                                {addAmount}
                                VND with{' '}
                                {paymentMethod === 'vnpay' ? 'VNPay' : 'MoMo'}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
