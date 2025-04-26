import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
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
import { useMutation } from '@tanstack/react-query';
import { createProperty } from '@/api/listingService';
import { Loader2 } from 'lucide-react';

export const PostPaymentPage = ({ propertyType, formDataToSend }) => {
    const [userBalance, setUserBalance] = useState(65.5);
    const [postCost, setPostCost] = useState(50.0);
    const [isSuccess, setIsSuccess] = useState(false);

    const hasSufficientFunds = userBalance >= postCost;

    const { mutate, isLoading } = useMutation({
        mutationFn: createProperty,
        onSuccess: (data) => {
            console.log('Create property successfully', data);
            setIsSuccess(true);
        },
        onError: (err) => {
            console.log('Create property failed', err.response.data.error);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        mutate({
            propertyType,
            formDataToSend
        });
    };

    if (isSuccess) {
        return (
            <div className="container mx-auto max-w-md py-10">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">
                            Add Listing Successful!
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
                            <Link to={'/list'}>Go to Dashboard</Link>
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
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Please wait...
                                </div>
                            ) : (
                                'Pay & Publish Post'
                            )}
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
