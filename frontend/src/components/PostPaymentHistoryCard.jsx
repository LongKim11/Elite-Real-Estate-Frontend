import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck } from 'lucide-react';
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
import { getPostPaymentHistory } from '@/api/saleService';
import { useQuery } from '@tanstack/react-query';
import { FileX, Loader2 } from 'lucide-react';

export const PostPaymentHistoryCard = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: postPaymentHistory, isLoading } = useQuery({
        queryKey: ['postPayment'],
        queryFn: getPostPaymentHistory,
        onSuccess: (res) => {
            console.log('All Post Payment History', res);
        },
        onError: (err) => {
            console.log(
                'Get Post Payment History Error',
                err.response.data.error
            );
        },
        enabled: isDialogOpen
    });

    return (
        <>
            {/* Card */}
            <div className="rounded-lg border p-6 transition-shadow hover:shadow-md">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                        <FileCheck className="text-amber-600" />
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-800">
                        Listing Usage
                    </h2>
                    <p className="mb-4 text-gray-600">
                        View your posting activity using listing plans
                    </p>
                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="w-full bg-amber-300 text-black hover:bg-amber-400"
                    >
                        View Details
                    </Button>
                </div>
            </div>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-gray-800">
                            Post Payment History
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4">
                        {/* Summary */}
                        <div className="mb-6 grid grid-cols-3 gap-4">
                            <div className="rounded-lg bg-gray-50 p-3">
                                <p className="text-sm text-gray-500">
                                    Total Posts
                                </p>
                                <p className="text-xl font-bold text-gray-800">
                                    {postPaymentHistory?.data?.length || 0}
                                </p>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-3">
                                <p className="text-sm text-gray-500">
                                    Total Spent
                                </p>
                                <p className="text-xl font-bold text-gray-800">
                                    $
                                    {postPaymentHistory?.data
                                        ?.reduce(
                                            (sum, post) => sum + post.amount,
                                            0
                                        )
                                        ?.toLocaleString() || 0}
                                </p>
                            </div>
                            <div className="flex flex-col justify-between rounded-lg bg-gray-50 p-3">
                                <p className="text-sm text-gray-500">
                                    Payment Types
                                </p>
                                <div className="flex items-center gap-1">
                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                        {postPaymentHistory?.data?.filter(
                                            (post) =>
                                                post.paymentType === 'PACKAGE'
                                        ).length || 0}{' '}
                                        Package
                                    </span>
                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                                        {postPaymentHistory?.data?.filter(
                                            (post) =>
                                                post.paymentType === 'POST'
                                        ).length || 0}{' '}
                                        Direct
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Filter */}
                        <div className="mb-4">
                            <Select>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="All Posts" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Posts
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="expired">
                                        Expired
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* List */}
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2 py-10">
                                    <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                                    <span>Loading payment history...</span>
                                </div>
                            ) : postPaymentHistory?.data?.length > 0 ? (
                                postPaymentHistory.data.map((post) => (
                                    <div
                                        key={post.id}
                                        className="overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="px-4 py-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-medium text-gray-800">
                                                            Post ID:{' '}
                                                            {post.postId.substring(
                                                                0,
                                                                8
                                                            )}
                                                            ...
                                                        </h3>
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                post.postTier ===
                                                                'VIP_GOLD'
                                                                    ? 'bg-amber-100 text-amber-800'
                                                                    : post.postTier ===
                                                                        'VIP_SILVER'
                                                                      ? 'bg-gray-100 text-gray-800'
                                                                      : 'bg-blue-100 text-blue-800'
                                                            }`}
                                                        >
                                                            {post.postTier.replace(
                                                                '_',
                                                                ' '
                                                            )}
                                                        </span>
                                                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                                            {post.status}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                                        <span>
                                                            Created:{' '}
                                                            {new Date(
                                                                post.createdAt
                                                            ).toLocaleDateString()}{' '}
                                                            {new Date(
                                                                post.createdAt
                                                            ).toLocaleTimeString()}
                                                        </span>
                                                        <span className="inline-block h-1 w-1 rounded-full bg-gray-300"></span>
                                                        <span className="flex items-center gap-1">
                                                            <span
                                                                className={`h-2 w-2 rounded-full ${post.expiredAt ? 'bg-red-400' : 'bg-green-400'}`}
                                                            ></span>
                                                            {post.expiredAt
                                                                ? 'Expired'
                                                                : 'Active'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-center gap-1">
                                                        <span
                                                            className={`text-sm font-medium ${post.amount > 0 ? 'text-red-600' : 'text-blue-600'}`}
                                                        >
                                                            {post.amount > 0
                                                                ? `-$${post.amount.toLocaleString()}`
                                                                : 'Plan Slot Used'}
                                                        </span>
                                                    </div>
                                                    <span className="mt-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                                                        {post.paymentType}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 bg-gray-50 px-4 py-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-xs text-gray-600"
                                            >
                                                View Details
                                            </Button>
                                            <Link to={`/list/${post.postId}`}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 border-amber-300 px-2 text-xs text-amber-600 hover:bg-amber-50"
                                                >
                                                    View Post
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
                                    <FileX className="h-12 w-12 text-gray-300" />
                                    <h3 className="mt-2 text-base font-medium text-gray-600">
                                        No payment history
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        You haven't made any post payments yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Close
                        </Button>
                        <Link to="/add-post">
                            <Button className="bg-amber-300 text-black hover:bg-amber-400">
                                Create New Post
                            </Button>
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
