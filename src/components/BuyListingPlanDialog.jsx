import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { AlertCircle, CheckCircle2, Wallet, CreditCard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { purchaseListingPlan } from '@/api/saleService';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

export const BuyListingPlanDialog = ({
    isOpen,
    onClose,
    plan,
    userBalance
}) => {
    const [isSuccess, setIsSuccess] = useState(false);

    const { mutate, isLoading: isPurchasing } = useMutation({
        mutationFn: purchaseListingPlan,
        onSuccess: (res) => {
            console.log('Buying Listing Plans', res);
            setIsSuccess(true);
        },
        onError: (err) => {
            console.log('Buying Listing Plan Error', err.response.data.error);
        }
    });

    const hasSufficientFunds = userBalance >= plan?.price * 1000;

    const handlePurchase = () => {
        mutate({
            packetName: plan.name,
            amount: plan.price * 1000
        });
    };

    console.log(plan);

    if (!plan) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Purchase {plan.name} Plan</DialogTitle>
                    <DialogDescription>
                        Review your purchase details before confirming.
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-6">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-5">
                            <div className="flex items-start gap-4">
                                {/* Success icon */}
                                <div className="flex-shrink-0">
                                    <div className="rounded-full bg-green-100 p-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    </div>
                                </div>

                                {/* Success content */}
                                <div className="flex-grow">
                                    <h3 className="mb-1.5 text-lg font-semibold text-green-800">
                                        Purchase Successful!
                                    </h3>
                                    <p className="mb-4 text-sm text-green-700">
                                        Your <strong>{plan.name}</strong> plan
                                        has been activated. You can now start
                                        creating listings.
                                    </p>

                                    {/* Plan details */}
                                    <div className="mb-4 rounded-md bg-white p-3 shadow-sm">
                                        <div className="grid grid-cols-3 gap-3 text-center">
                                            <div className="text-sm">
                                                <p className="text-gray-500">
                                                    VIP Gold
                                                </p>
                                                <p className="font-semibold text-amber-600">
                                                    {plan.vipGoldListings || 0}
                                                </p>
                                            </div>
                                            <div className="text-sm">
                                                <p className="text-gray-500">
                                                    VIP Silver
                                                </p>
                                                <p className="font-semibold text-gray-600">
                                                    {plan.vipSilverListings ||
                                                        0}
                                                </p>
                                            </div>
                                            <div className="text-sm">
                                                <p className="text-gray-500">
                                                    Regular
                                                </p>
                                                <p className="font-semibold text-blue-600">
                                                    {plan.regularListings || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link to="/profile">
                                            <Button className="bg-green-600 hover:bg-green-700">
                                                Return to Profile
                                            </Button>
                                        </Link>
                                        <Link to="/add-post">
                                            <Button
                                                variant="outline"
                                                className="border-green-500 text-green-600 hover:bg-green-50"
                                            >
                                                Create Listing
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Wallet className="text-muted-foreground h-5 w-5" />
                                    <span>Your Balance:</span>
                                </div>
                                <span className="text-lg font-bold">
                                    {userBalance}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-t border-b py-3">
                                <div>
                                    <h3 className="font-medium">
                                        {plan.name} Plan
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {plan.description}
                                    </p>
                                </div>
                                <span className="text-primary text-lg font-bold">
                                    {plan.price * 1000}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span>Remaining Balance After Purchase:</span>
                                <span
                                    className={`text-lg font-bold ${!hasSufficientFunds ? 'text-red-500' : ''}`}
                                >
                                    {userBalance - plan.price * 1000}
                                </span>
                            </div>

                            {!hasSufficientFunds && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Insufficient Funds</AlertTitle>
                                    <AlertDescription>
                                        You need to deposit more to purchase
                                        this plan.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <DialogFooter className="flex-col gap-3 sm:flex-row sm:justify-between">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>

                            {hasSufficientFunds ? (
                                <Button
                                    onClick={handlePurchase}
                                    disabled={isPurchasing}
                                >
                                    {isPurchasing ? 'Processing...' : 'Buy Now'}
                                </Button>
                            ) : (
                                <Link to={'/profile'}>
                                    <Button>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Deposit Funds
                                    </Button>
                                </Link>
                            )}
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};
