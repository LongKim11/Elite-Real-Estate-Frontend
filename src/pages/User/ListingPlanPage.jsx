import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Check, Star } from 'lucide-react';
import { BuyListingPlanDialog } from '@/components/BuyListingPlanDialog';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/api/authService';
import { Spinner } from '@/components/Spinner';

export const ListingPlanPage = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: userInfo, isLoading: isLoadingUserInfo } = useQuery({
        queryKey: ['getMe'],
        queryFn: getMe,
        onSuccess: (data) => {
            console.log('Get Me data:', data);
        },
        onError: (err) => {
            console.log('Get me error', err.response.data.error);
        }
    });

    const userBalance = userInfo?.data?.balance;

    const plans = [
        {
            name: 'BASIC',
            price: 50,
            description: 'Perfect for beginners',
            features: [
                '10 Regular Listings',
                '5 VIP Silver Listings',
                '3 VIP Gold Listings',
                '30 Days Validity',
                'Basic Support'
            ],
            regularListings: 10,
            vipSilverListings: 5,
            vipGoldListings: 3,
            highlighted: false
        },
        {
            name: 'STANDARD',
            price: 100,
            description: 'Most popular choice',
            features: [
                '12 Regular Listings',
                '7 VIP Silver Listings',
                '6 VIP Gold Listings',
                '60 Days Validity',
                'Priority Support'
            ],
            regularListings: 12,
            vipSilverListings: 7,
            vipGoldListings: 5,
            highlighted: true
        },
        {
            name: 'VIP',
            price: 200,
            description: 'For serious property dealers',
            features: [
                '15 Regular Listings',
                '15 VIP Silver Listings',
                '9 VIP Gold Listings',
                '90 Days Validity',
                '24/7 Premium Support'
            ],
            regularListings: 15,
            vipSilverListings: 15,
            vipGoldListings: 9,
            highlighted: false
        }
    ];

    const handleBuyClick = (plan) => {
        setSelectedPlan(plan);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedPlan(null);
    };

    return (
        <>
            {isLoadingUserInfo ? (
                <Spinner />
            ) : (
                <div className="container mx-auto px-4 py-12">
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            Choose Your Listing Plan
                        </h1>
                        <p className="text-muted-foreground mx-auto mt-4 max-w-4xl text-lg">
                            Select the perfect plan to showcase your properties.
                            More visibility means more potential buyers.
                        </p>
                    </div>

                    <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
                        {plans.map((plan) => (
                            <Card
                                key={plan.name}
                                className={`flex flex-col ${plan.highlighted ? 'border-primary shadow-lg' : ''}`}
                            >
                                <CardHeader>
                                    <CardTitle className="text-center text-2xl font-bold">
                                        <div className="flex items-center justify-center">
                                            <span>{plan.name}</span>
                                            {plan.highlighted && (
                                                <div className="bg-primary text-primary-foreground ml-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                                                    Popular
                                                </div>
                                            )}
                                        </div>
                                    </CardTitle>
                                    <CardDescription className="text-center">
                                        {plan.description}
                                    </CardDescription>
                                    <div className="mt-4 text-center">
                                        <span className="text-4xl font-bold">
                                            {plan.price}K
                                        </span>
                                        <span className="text-muted-foreground ml-1">
                                            /package
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            {plan.features.map((feature) => (
                                                <div
                                                    key={feature}
                                                    className="flex items-center"
                                                >
                                                    <Check className="mr-2 h-4 w-4 flex-shrink-0 text-green-600" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 border-t pt-6">
                                            <h4 className="mb-2 font-medium">
                                                Listing Allocation:
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>
                                                        Regular Listings:
                                                    </span>
                                                    <span className="font-medium">
                                                        {plan.regularListings}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <div className="flex items-center">
                                                        <span>
                                                            VIP Silver Listings:
                                                        </span>
                                                        <Star className="ml-1 h-3 w-3 fill-gray-400" />
                                                    </div>
                                                    <span className="font-medium">
                                                        {plan.vipSilverListings}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <div className="flex items-center">
                                                        <span>
                                                            VIP Gold Listings:
                                                        </span>
                                                        <Star className="ml-1 h-3 w-3 fill-yellow-400" />
                                                    </div>
                                                    <span className="font-medium">
                                                        {plan.vipGoldListings}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className={`w-full ${plan.highlighted ? 'bg-primary hover:bg-primary/90' : ''}`}
                                        size="lg"
                                        onClick={() => handleBuyClick(plan)}
                                    >
                                        Buy {plan.name} Plan
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="text-muted-foreground mt-12 text-center">
                        <p>
                            All plans include listing management and basic
                            analytics.
                        </p>
                        <p className="mt-2">
                            Need a custom plan?{' '}
                            <a href="#" className="text-primary underline">
                                Contact our sales team
                            </a>
                        </p>
                    </div>

                    {/* Purchase Dialog */}
                    <BuyListingPlanDialog
                        isOpen={isDialogOpen}
                        onClose={handleCloseDialog}
                        plan={selectedPlan}
                        userBalance={userBalance}
                    />
                </div>
            )}
        </>
    );
};
