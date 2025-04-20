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

const paymentHistory = [
    {
        id: 1,
        date: '2023-05-15',
        amount: 50.0,
        type: 'Deposit',
        status: 'Completed',
        method: 'Credit Card'
    },
    {
        id: 2,
        date: '2023-05-10',
        amount: 25.0,
        type: 'Withdrawal',
        status: 'Completed',
        method: 'Bank Transfer'
    },
    {
        id: 3,
        date: '2023-04-28',
        amount: 100.0,
        type: 'Deposit',
        status: 'Completed',
        method: 'Credit Card'
    },
    {
        id: 4,
        date: '2023-04-15',
        amount: 35.0,
        type: 'Withdrawal',
        status: 'Pending',
        method: 'Bank Transfer'
    },
    {
        id: 5,
        date: '2023-04-05',
        amount: 75.0,
        type: 'Deposit',
        status: 'Completed',
        method: 'PayPal'
    },
    {
        id: 6,
        date: '2023-03-22',
        amount: 40.0,
        type: 'Withdrawal',
        status: 'Completed',
        method: 'Bank Transfer'
    }
];

export const FundHistoryCard = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="rounded-lg border p-6 transition-shadow hover:shadow-md">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <CreditCard className="text-blue-600" />
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-800">
                        Payment History
                    </h2>
                    <p className="mb-4 text-gray-600">
                        View your deposits and transaction history
                    </p>
                    <Button
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        onClick={() => setIsOpen(true)}
                    >
                        View Payment History
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
                            {paymentHistory.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800">
                                            {payment.type}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {payment.date}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Method: {payment.method}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span
                                            className={`font-semibold ${
                                                payment.type === 'Deposit'
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }`}
                                        >
                                            {payment.type === 'Deposit'
                                                ? '+'
                                                : '-'}
                                            ${payment.amount.toFixed(2)}
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs ${
                                                payment.status === 'Completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {payment.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
