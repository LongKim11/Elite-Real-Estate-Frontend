import { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AddFundDialog } from '@/components/AddFundDialog';

export const PostPaymentPage = () => {
    // Mock data - in a real app, this would come from props or context
    const [userBalance, setUserBalance] = useState(25.5);
    const [postCost, setPostCost] = useState(50.0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const hasSufficientFunds = userBalance >= postCost;

    const handlePurchase = () => {
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setUserBalance((prevBalance) => prevBalance - postCost);
            setIsProcessing(false);
            setIsSuccess(true);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="container mx-auto max-w-md py-10">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">
                            Payment Successful!
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                        <p className="text-center">
                            Your post has been published successfully.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button asChild>
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-md py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Complete Your Purchase</CardTitle>
                    <CardDescription>
                        Review and pay for your post
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Post Summary</h3>
                        <p className="text-muted-foreground mb-1 text-sm">
                            Standard Post
                        </p>
                        <p className="text-2xl font-bold">
                            ${postCost.toFixed(2)}
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-b py-2">
                        <span>Your Balance</span>
                        <span className="font-semibold">
                            ${userBalance.toFixed(2)}
                        </span>
                    </div>

                    {!hasSufficientFunds && (
                        <Alert variant="destructive" className="bg-red-50">
                            <AlertTitle className="flex items-center">
                                Insufficient Funds
                            </AlertTitle>
                            <AlertDescription>
                                You need ${(postCost - userBalance).toFixed(2)}{' '}
                                more to publish this post.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-3">
                    {!hasSufficientFunds ? (
                        <AddFundDialog />
                    ) : (
                        <Button
                            className="w-full"
                            onClick={handlePurchase}
                            disabled={isProcessing}
                        >
                            {isProcessing
                                ? 'Processing...'
                                : 'Pay & Publish Post'}
                        </Button>
                    )}

                    <Button className="w-full" variant="outline" asChild>
                        <Link href="/create">Cancel</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};
