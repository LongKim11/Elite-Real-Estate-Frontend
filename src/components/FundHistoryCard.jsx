import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { getPaymentHistory } from '@/api/paymentService';
import { format } from 'date-fns';

export const FundHistoryCard = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { data: paymentHistory, isLoading } = useQuery({
        queryKey: ['getPaymentHistory'],
        queryFn: getPaymentHistory,
        onSuccess: (res) => {
            console.log('Payment History', res);
        },
        onError: (err) => {
            console.log('Payment History Error', err.response.data.error);
        },
        enabled: isOpen
    });

    return (
        <>
            <div className="rounded-lg border p-6 transition-shadow hover:shadow-md">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <CreditCard className="text-blue-600" />
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-800">
                        Transaction History
                    </h2>
                    <p className="mb-4 text-gray-600">
                        Review your deposit and plan purchase activity
                    </p>
                    <Button
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        onClick={() => setIsOpen(true)}
                    >
                        View Details
                    </Button>
                </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-gray-800">
                            Payment History
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex gap-2">
                                <Select>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Types
                                        </SelectItem>
                                        <SelectItem value="deposit">
                                            Deposits
                                        </SelectItem>
                                        <SelectItem value="withdrawal">
                                            Withdrawals
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="All Time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Time
                                        </SelectItem>
                                        <SelectItem value="30days">
                                            Last 30 Days
                                        </SelectItem>
                                        <SelectItem value="90days">
                                            Last 90 Days
                                        </SelectItem>
                                        <SelectItem value="year">
                                            This Year
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-sm"
                            >
                                Export
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {isLoading && (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-10 w-10 animate-spin" />
                                    Retriving Payment History...
                                </div>
                            )}

                            {paymentHistory?.data?.map((payment) => (
                                <div
                                    key={payment.walletTopupsId}
                                    className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50"
                                >
                                    <div className="flex flex-col space-y-2">
                                        <span className="font-semibold text-green-700">
                                            Deposit
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Date:{' '}
                                            {format(
                                                new Date(payment.createdTime),
                                                'dd/MM/yyyy HH:mm'
                                            )}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Method: VN Pay
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-green-600">
                                            + ${payment.amount}
                                        </span>
                                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                                            {payment.status === true &&
                                                'Success'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button onClick={() => setIsOpen(false)}>Close</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
