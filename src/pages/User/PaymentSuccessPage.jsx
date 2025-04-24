import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

export const PaymentSuccessPage = () => {
    return (
        <div className="bg-background mt-8 flex justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="pb-2 text-center">
                    <div className="mb-4 flex justify-center">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        Payment Successful!
                    </CardTitle>
                    <CardDescription className="mt-2 text-lg">
                        Thank you for your deposit
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted rounded-lg p-4">
                        <div className="text-muted-foreground mb-2 text-sm">
                            Transaction ID
                        </div>
                        <div className="font-medium">
                            #TRX-{Math.floor(100000 + Math.random() * 900000)}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="mb-2 flex justify-between">
                            <span className="text-muted-foreground">Date</span>
                            <span className="font-medium">
                                {new Date().toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Payment Method
                            </span>
                            <span className="font-medium">VN Pay</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Link to={'/profile'} className="w-full">
                        <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                            Return to Profile
                        </Button>
                    </Link>
                    <Link to={'/add-post'} className="w-full">
                        <Button variant="outline" className="w-full">
                            Add Post
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};
