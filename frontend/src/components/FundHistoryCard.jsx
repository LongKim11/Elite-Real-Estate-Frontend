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
import { getAllListingPlanByUser } from '@/api/saleService';
import { format } from 'date-fns';

export const FundHistoryCard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedType, setSelectedType] = useState('deposit');

    const { data: paymentHistory, isLoading: isLoadingPayment } = useQuery({
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

    const { data: purchaseHistory, isLoading: isLoadingPurchase } = useQuery({
        queryKey: ['getAllListingPlan'],
        queryFn: getAllListingPlanByUser,
        onSuccess: (res) => {
            console.log('Get All Listing Plan', res);
        },
        onError: (err) => {
            console.log('Get All Listing Plan Error', err.response.data.error);
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
                                <Select
                                    onValueChange={(value) =>
                                        setSelectedType(value)
                                    }
                                    value={selectedType}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="deposit">
                                            Deposits
                                        </SelectItem>
                                        <SelectItem value="purchase">
                                            Purchase
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
                            {isLoadingPayment || isLoadingPurchase ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="my-15 h-5 w-5 animate-spin" />
                                    Retrieving Payment History...
                                </div>
                            ) : (
                                <>
                                    {/* Deposits */}
                                    {selectedType === 'deposit' &&
                                        paymentHistory?.data?.map((payment) => (
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
                                                            new Date(
                                                                payment.createdTime
                                                            ),
                                                            'dd/MM/yyyy HH:mm'
                                                        )}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        Method: VN Pay
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-green-600">
                                                        + $
                                                        {payment.amount.toLocaleString()}
                                                    </span>
                                                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                                                        {payment.status ===
                                                            true && 'Success'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}

                                    {/* Purchases */}
                                    {selectedType === 'purchase' &&
                                        purchaseHistory?.data?.map(
                                            (purchase) => (
                                                <div
                                                    key={purchase.id}
                                                    className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50"
                                                >
                                                    <div className="flex flex-col space-y-2">
                                                        <span className="font-semibold text-blue-700">
                                                            Purchase
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            Date:{' '}
                                                            {format(
                                                                new Date(
                                                                    purchase.createdAt
                                                                ),
                                                                'dd/MM/yyyy HH:mm'
                                                            )}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            Plan:{' '}
                                                            {
                                                                purchase.packetName
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-blue-600">
                                                            - $
                                                            {purchase.amountPaid.toLocaleString()}
                                                        </span>
                                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                                            Success
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}

                                    {(paymentHistory?.data === null ||
                                        purchaseHistory?.data === null) && (
                                        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
                                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                                                <CreditCard className="h-8 w-8 text-blue-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-700">
                                                No Transactions Yet
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                You haven't made any purchases
                                                or payments yet.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
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
