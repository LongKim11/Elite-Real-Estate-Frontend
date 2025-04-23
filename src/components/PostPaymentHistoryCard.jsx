import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BanknoteArrowUp } from 'lucide-react';
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

export const PostPaymentHistoryCard = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const postPaymentHistory = [
        {
            id: 1,
            date: '2023-05-12',
            amount: 15.0,
            postTitle: 'Premium Apartment Listing in Downtown',
            postId: 'POST12345',
            status: 'Active',
            duration: '30 days',
            expiresOn: '2023-06-11'
        },
        {
            id: 2,
            date: '2023-04-30',
            amount: 10.0,
            postTitle: 'Studio Apartment for Rent',
            postId: 'POST12346',
            status: 'Expired',
            duration: '15 days',
            expiresOn: '2023-05-15'
        },
        {
            id: 3,
            date: '2023-04-22',
            amount: 20.0,
            postTitle: 'Luxury Condo with Ocean View',
            postId: 'POST12347',
            status: 'Active',
            duration: '30 days',
            expiresOn: '2023-05-22'
        },
        {
            id: 4,
            date: '2023-04-10',
            amount: 15.0,
            postTitle: 'Cozy 2-Bedroom Apartment Near University',
            postId: 'POST12348',
            status: 'Active',
            duration: '30 days',
            expiresOn: '2023-05-10'
        },
        {
            id: 5,
            date: '2023-03-25',
            amount: 10.0,
            postTitle: 'Modern Studio in City Center',
            postId: 'POST12349',
            status: 'Expired',
            duration: '15 days',
            expiresOn: '2023-04-09'
        }
    ];

    return (
        <>
            {/* Card */}
            <div className="rounded-lg border p-6 transition-shadow hover:shadow-md">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                        <BanknoteArrowUp className="text-amber-600" />
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-800">
                        Post Payments
                    </h2>
                    <p className="mb-4 text-gray-600">
                        Manage your post payments
                    </p>
                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="w-full bg-amber-300 text-black hover:bg-amber-400"
                    >
                        View Post Payments
                    </Button>
                </div>
            </div>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[700px]">
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
                                    Total Spent
                                </p>
                                <p className="text-xl font-bold text-gray-800">
                                    $70.00
                                </p>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-3">
                                <p className="text-sm text-gray-500">
                                    Active Posts
                                </p>
                                <p className="text-xl font-bold text-gray-800">
                                    3
                                </p>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-3">
                                <p className="text-sm text-gray-500">
                                    Expired Posts
                                </p>
                                <p className="text-xl font-bold text-gray-800">
                                    2
                                </p>
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
                            {postPaymentHistory.map((post) => (
                                <div
                                    key={post.id}
                                    className="rounded-md border p-4 hover:bg-gray-50"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="line-clamp-1 font-medium text-gray-800">
                                                {post.postTitle}
                                            </h3>
                                            <div className="mt-1 flex gap-2">
                                                <span className="text-xs text-gray-500">
                                                    ID: {post.postId}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Posted: {post.date}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-red-600">
                                            -${post.amount.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs ${
                                                    post.status === 'Active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {post.status}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Duration: {post.duration}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Expires: {post.expiresOn}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-xs text-gray-600"
                                            >
                                                View Post
                                            </Button>
                                            {post.status === 'Active' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 border-amber-300 px-2 text-xs text-amber-600 hover:bg-amber-50"
                                                >
                                                    Extend
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
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
