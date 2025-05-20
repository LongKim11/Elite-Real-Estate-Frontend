import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
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
    const location = useLocation();

    const params = new URLSearchParams(location.search);

    const amount = params.get('amount');
    const transactionID = params.get('transactionId');
    // const status = params.get('status');
    const bankCode = params.get('bankCode');

    return (
        <div className="bg-background mt-8 flex justify-center p-6">
            <Card className="w-full max-w-lg rounded-xl shadow-xl">
                <CardHeader className="pb-4 text-center">
                    <div className="mb-6 flex justify-center">
                        <CheckCircle className="h-20 w-20 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-semibold text-gray-900">
                        Payment Successful!
                    </CardTitle>
                    <CardDescription className="mt-3 text-lg text-gray-600">
                        Thank you for your deposit
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="rounded-lg bg-gray-100 p-5">
                        <div className="mb-3 text-sm font-medium text-gray-600">
                            Transaction ID
                        </div>
                        <div className="font-medium text-gray-900">
                            {transactionID}
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <div className="mb-3 flex justify-between text-sm text-gray-600">
                            <span>Date</span>
                            <span className="font-medium text-gray-900">
                                {new Date().toLocaleDateString()}
                            </span>
                        </div>
                        <div className="mb-3 flex justify-between text-sm text-gray-600">
                            <span>Bank Code</span>
                            <span className="font-medium text-gray-900">
                                {bankCode}
                            </span>
                        </div>
                        <div className="mb-3 flex justify-between text-sm text-gray-600">
                            <span>Payment Method</span>
                            <span className="font-medium text-gray-900">
                                VN Pay
                            </span>
                        </div>
                        <div className="mb-3 flex justify-between text-sm text-gray-600">
                            <span>Deposit Amount</span>
                            <span className="font-medium text-gray-900">
                                {amount}
                            </span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Link to={'/profile'} className="w-full">
                        <Button className="w-full rounded-lg bg-green-600 text-white shadow-md transition duration-300 hover:bg-green-700">
                            Return to Profile
                        </Button>
                    </Link>
                    <Link to={'/add-post'} className="w-full">
                        <Button
                            variant="outline"
                            className="w-full rounded-lg border-gray-300 text-gray-900 transition duration-300 hover:bg-gray-100"
                        >
                            Add Post
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};
