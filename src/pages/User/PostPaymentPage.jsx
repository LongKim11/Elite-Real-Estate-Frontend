import { useState } from 'react';
import {
    CheckCircle,
    Crown,
    Award,
    Tag,
    AlertCircle,
    Info,
    Loader2,
    Star,
    ShieldCheck,
    FileCheck,
    Eye,
    Bell,
    Settings,
    LayoutDashboard,
    Plus
} from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddFundDialog } from '@/components/AddFundDialog';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createProperty } from '@/api/listingService';
import { getValidListingPlanByUser } from '@/api/saleService';
import { postPayment } from '@/api/saleService';
import { Spinner } from '@/components/Spinner';

export const PostPaymentPage = ({ propertyType, formDataToSend }) => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedTier, setSelectedTier] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('existingPlan');
    const [createdPropertyID, setCreatedPropertyID] = useState('');

    const directPaymentPrices = {
        VIP_GOLD: 100,
        VIP_SILVER: 50,
        REGULAR: 20
    };

    const { mutate: createPropertyFunc, isLoading: isCreating } = useMutation({
        mutationFn: createProperty
    });

    const { mutate: postPaymentFunc, isLoading: isPaying } = useMutation({
        mutationFn: postPayment,
        onSuccess: (data) => {
            console.log('Post payment', data);
            setIsSuccess(true);
        },
        onError: (err) => {
            console.log('Post payment error', err.response?.data?.error);
        }
    });

    const { data: listingPlans, isLoading: isLoadingPlans } = useQuery({
        queryKey: ['getValidListingPlan'],
        queryFn: getValidListingPlanByUser,
        onSuccess: (res) => {
            console.log('Get Valid Listing Plans', res);
        },
        onError: (err) => {
            console.log(
                'Get Valid Listing Plans Error',
                err.response.data.error
            );
        }
    });

    const hasValidPlans = listingPlans?.data?.some(
        (plan) =>
            plan.vipGoldRemaining > 0 ||
            plan.vipSilverRemaining > 0 ||
            plan.regularRemaining > 0
    );

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);

        if (plan.vipGoldRemaining > 0) {
            setSelectedTier('VIP_GOLD');
        } else if (plan.vipSilverRemaining > 0) {
            setSelectedTier('VIP_SILVER');
        } else if (plan.regularRemaining > 0) {
            setSelectedTier('REGULAR');
        } else {
            setSelectedTier(null);
        }
    };

    const handleSubmit = async () => {
        try {
            const propertyData = await new Promise((resolve, reject) => {
                createPropertyFunc(
                    { propertyType, formDataToSend },
                    {
                        onSuccess: (data) => {
                            console.log('Create property successfully', data);
                            resolve(data);
                        },
                        onError: (err) => {
                            console.error(
                                'Create property failed',
                                err.response?.data?.error
                            );
                            reject(err);
                        }
                    }
                );
            });

            const propertyId = propertyData?.data?.data?.propertyId;
            setCreatedPropertyID(propertyId);

            if (paymentMethod === 'existingPlan' && selectedPlan) {
                postPaymentFunc({
                    postId: propertyId,
                    postTier: selectedTier,
                    paymentType: 'PACKAGE',
                    amount: 0.0,
                    quotaId: selectedPlan.id
                });
            } else if (paymentMethod === 'newPayment') {
                postPaymentFunc({
                    postId: propertyId,
                    postTier: selectedTier,
                    paymentType: 'POST',
                    amount: directPaymentPrices[selectedTier] * 1000
                });
            }
        } catch (err) {
            console.error(
                'Error during handleSubmit:',
                err.response?.data?.error || err
            );
        }
    };

    const isTierAvailable = (plan, tier) => {
        if (!plan) return false;

        switch (tier) {
            case 'VIP_GOLD':
                return plan.vipGoldRemaining > 0;
            case 'VIP_SILVER':
                return plan.vipSilverRemaining > 0;
            case 'REGULAR':
                return plan.regularRemaining > 0;
            default:
                return false;
        }
    };

    if (isSuccess) {
        return (
            <div className="container mx-auto max-w-xl py-10">
                <Card className="overflow-hidden border-2 border-green-200">
                    {/* Success banner */}
                    <div className="px-6 py-4">
                        <h2 className="text-xl font-bold text-green-800">
                            Listing Published Successfully!
                        </h2>
                    </div>

                    <CardContent className="space-y-6 p-6">
                        {/* Success animation */}
                        <div className="flex justify-center">
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
                                <CheckCircle className="h-18 w-18 text-green-500" />
                            </div>
                        </div>

                        {/* Property details */}
                        <div className="rounded-lg bg-gray-50 p-4">
                            <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-500 uppercase">
                                Listing Details
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-600">
                                        Property ID:
                                    </span>
                                    <span className="font-medium">
                                        {createdPropertyID || 'N/A'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-600">
                                        Post Tier:
                                    </span>
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            selectedTier === 'VIP_GOLD'
                                                ? 'bg-amber-100 text-amber-800'
                                                : selectedTier === 'VIP_SILVER'
                                                  ? 'bg-gray-100 text-gray-800'
                                                  : 'bg-blue-100 text-blue-800'
                                        }`}
                                    >
                                        {selectedTier || 'Regular'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-600">
                                        Listing Plan:
                                    </span>
                                    <span className="text-sm font-medium">
                                        {paymentMethod === 'existingPlan'
                                            ? `${selectedPlan?.packetName} `
                                            : 'Direct Payment'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-gray-600">
                                        Property Type:
                                    </span>
                                    <span className="text-sm font-medium">
                                        {propertyType.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Next steps */}
                        <div>
                            <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-500 uppercase">
                                Next Steps
                            </h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <div className="mt-0.5 rounded-full bg-blue-100 p-1">
                                        <Eye className="h-3 w-3 text-blue-600" />
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        View your property listing on the
                                        platform
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="mt-0.5 rounded-full bg-purple-100 p-1">
                                        <Bell className="h-3 w-3 text-purple-600" />
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        Receive notifications when users are
                                        interested
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="mt-0.5 rounded-full bg-amber-100 p-1">
                                        <Settings className="h-3 w-3 text-amber-600" />
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        Manage your listing from the dashboard
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3 border-t bg-gray-50 p-6 sm:flex-row">
                        <Button asChild variant="outline" className="flex-1">
                            <Link to={`/list/${createdPropertyID}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Listing
                            </Link>
                        </Button>
                        <Button
                            asChild
                            className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                            <Link to={'/list'}>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Go to Dashboard
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (isLoadingPlans) {
        return <Spinner />;
    }

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <Card className="border-2 border-blue-100">
                <CardHeader>
                    <CardTitle>Choose Your Listing Plan</CardTitle>
                    <CardDescription>
                        Select how you want to publish your property listing
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <Tabs
                        defaultValue={
                            hasValidPlans ? 'existingPlan' : 'newPayment'
                        }
                        onValueChange={(value) => setPaymentMethod(value)}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger
                                value="existingPlan"
                                disabled={!hasValidPlans}
                            >
                                Use Existing Plan
                            </TabsTrigger>
                            <TabsTrigger value="newPayment">
                                Pay Directly
                            </TabsTrigger>
                        </TabsList>

                        {/* Use Existing Plan Tab */}
                        <TabsContent
                            value="existingPlan"
                            className="space-y-4 pt-4"
                        >
                            {hasValidPlans ? (
                                <>
                                    <div className="mb-4">
                                        <h3 className="mb-2 text-lg font-medium">
                                            Your Available Plans
                                        </h3>
                                        <div className="space-y-3">
                                            {listingPlans?.data?.map((plan) => (
                                                <div
                                                    key={plan.id}
                                                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                                                        selectedPlan?.id ===
                                                        plan.id
                                                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                                                            : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                                    onClick={() =>
                                                        handlePlanSelect(plan)
                                                    }
                                                >
                                                    <div className="mb-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                                                    plan.packetName ===
                                                                    'VIP'
                                                                        ? 'bg-amber-100'
                                                                        : plan.packetName ===
                                                                            'STANDARD'
                                                                          ? 'bg-blue-100'
                                                                          : 'bg-gray-100'
                                                                }`}
                                                            >
                                                                {plan.packetName ===
                                                                'VIP' ? (
                                                                    <Star className="h-4 w-4 text-amber-600" />
                                                                ) : plan.packetName ===
                                                                  'STANDARD' ? (
                                                                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                                                                ) : (
                                                                    <FileCheck className="h-4 w-4 text-gray-600" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">
                                                                    {
                                                                        plan.packetName
                                                                    }{' '}
                                                                    Plan
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Purchased:{' '}
                                                                    {new Date(
                                                                        plan.createdAt
                                                                    ).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <div className="px-2 text-center">
                                                                <p className="text-xs text-gray-500">
                                                                    Gold
                                                                </p>
                                                                <p className="font-bold text-amber-600">
                                                                    {
                                                                        plan.vipGoldRemaining
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="px-2 text-center">
                                                                <p className="text-xs text-gray-500">
                                                                    Silver
                                                                </p>
                                                                <p className="font-bold text-gray-600">
                                                                    {
                                                                        plan.vipSilverRemaining
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="px-2 text-center">
                                                                <p className="text-xs text-gray-500">
                                                                    Regular
                                                                </p>
                                                                <p className="font-bold text-blue-600">
                                                                    {
                                                                        plan.regularRemaining
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedPlan && (
                                        <div className="mt-6">
                                            <h3 className="mb-3 text-lg font-medium">
                                                Select Listing Tier
                                            </h3>
                                            <div className="grid gap-4 md:grid-cols-3">
                                                <div
                                                    className={`rounded-lg border p-4 ${
                                                        isTierAvailable(
                                                            selectedPlan,
                                                            'VIP_GOLD'
                                                        )
                                                            ? 'cursor-pointer hover:border-amber-400'
                                                            : 'cursor-not-allowed opacity-50'
                                                    } ${selectedTier === 'VIP_GOLD' ? 'border-amber-500 bg-amber-50' : 'border-gray-200'}`}
                                                    onClick={() =>
                                                        isTierAvailable(
                                                            selectedPlan,
                                                            'VIP_GOLD'
                                                        ) &&
                                                        setSelectedTier(
                                                            'VIP_GOLD'
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="rounded-full bg-amber-100 p-2">
                                                            <Crown className="h-5 w-5 text-amber-600" />
                                                        </div>
                                                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                                                            {
                                                                selectedPlan.vipGoldRemaining
                                                            }{' '}
                                                            left
                                                        </span>
                                                    </div>
                                                    <h4 className="mt-2 font-semibold">
                                                        VIP Gold
                                                    </h4>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Premium visibility &
                                                        featured placement
                                                    </p>
                                                </div>

                                                <div
                                                    className={`rounded-lg border p-4 ${
                                                        isTierAvailable(
                                                            selectedPlan,
                                                            'VIP_SILVER'
                                                        )
                                                            ? 'cursor-pointer hover:border-gray-400'
                                                            : 'cursor-not-allowed opacity-50'
                                                    } ${selectedTier === 'VIP_SILVER' ? 'border-gray-500 bg-gray-50' : 'border-gray-200'}`}
                                                    onClick={() =>
                                                        isTierAvailable(
                                                            selectedPlan,
                                                            'VIP_SILVER'
                                                        ) &&
                                                        setSelectedTier(
                                                            'VIP_SILVER'
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="rounded-full bg-gray-100 p-2">
                                                            <Award className="h-5 w-5 text-gray-600" />
                                                        </div>
                                                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800">
                                                            {
                                                                selectedPlan.vipSilverRemaining
                                                            }{' '}
                                                            left
                                                        </span>
                                                    </div>
                                                    <h4 className="mt-2 font-semibold">
                                                        VIP Silver
                                                    </h4>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Enhanced visibility in
                                                        search results
                                                    </p>
                                                </div>

                                                <div
                                                    className={`rounded-lg border p-4 ${
                                                        isTierAvailable(
                                                            selectedPlan,
                                                            'REGULAR'
                                                        )
                                                            ? 'cursor-pointer hover:border-blue-400'
                                                            : 'cursor-not-allowed opacity-50'
                                                    } ${selectedTier === 'REGULAR' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                                    onClick={() =>
                                                        isTierAvailable(
                                                            selectedPlan,
                                                            'REGULAR'
                                                        ) &&
                                                        setSelectedTier(
                                                            'REGULAR'
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="rounded-full bg-blue-100 p-2">
                                                            <Tag className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                                                            {
                                                                selectedPlan.regularRemaining
                                                            }{' '}
                                                            left
                                                        </span>
                                                    </div>
                                                    <h4 className="mt-2 font-semibold">
                                                        Regular
                                                    </h4>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Standard listing
                                                        visibility
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!selectedPlan && (
                                        <Alert className="border-blue-200 bg-blue-50 text-blue-800">
                                            <Info className="h-4 w-4" />
                                            <AlertTitle>
                                                Select a plan
                                            </AlertTitle>
                                            <AlertDescription>
                                                Please select one of your
                                                listing plans above to continue.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </>
                            ) : (
                                <Alert className="border-amber-200 bg-amber-50 text-amber-800">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>No active plans</AlertTitle>
                                    <AlertDescription>
                                        You don't have any active listing plans
                                        with remaining slots. Please purchase a
                                        new plan or switch to direct payment.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </TabsContent>

                        {/* Pay Directly Tab */}
                        <TabsContent
                            value="newPayment"
                            className="space-y-4 pt-4"
                        >
                            <div>
                                <h3 className="mb-3 text-lg font-medium">
                                    Select Listing Tier
                                </h3>
                                <RadioGroup
                                    value={selectedTier}
                                    onValueChange={setSelectedTier}
                                    className="grid gap-4 md:grid-cols-3"
                                >
                                    <div className="flex">
                                        <RadioGroupItem
                                            value="VIP_GOLD"
                                            id="vip_gold"
                                            className="peer sr-only"
                                        />
                                        <Label
                                            htmlFor="vip_gold"
                                            className="flex flex-1 cursor-pointer flex-col rounded-lg border p-4 transition-all peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-50 hover:border-amber-300 hover:bg-amber-50/50"
                                        >
                                            <div className="flex items-center justify-between gap-x-2">
                                                <div className="rounded-full bg-amber-100 p-2">
                                                    <Crown className="h-5 w-5 text-amber-600" />
                                                </div>
                                                <span className="font-bold text-amber-700">
                                                    {
                                                        directPaymentPrices.VIP_GOLD
                                                    }
                                                    K
                                                </span>
                                            </div>
                                            <h4 className="mt-2 font-semibold">
                                                VIP Gold
                                            </h4>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Premium visibility & featured
                                                placement
                                            </p>
                                        </Label>
                                    </div>

                                    <div className="flex">
                                        <RadioGroupItem
                                            value="VIP_SILVER"
                                            id="vip_silver"
                                            className="peer sr-only"
                                        />
                                        <Label
                                            htmlFor="vip_silver"
                                            className="flex flex-1 cursor-pointer flex-col rounded-lg border p-4 transition-all peer-data-[state=checked]:border-gray-500 peer-data-[state=checked]:bg-gray-50 hover:border-gray-300 hover:bg-gray-50"
                                        >
                                            <div className="flex items-center justify-between gap-x-2">
                                                <div className="rounded-full bg-gray-100 p-2">
                                                    <Award className="h-5 w-5 text-gray-600" />
                                                </div>
                                                <span className="font-bold text-gray-700">
                                                    {
                                                        directPaymentPrices.VIP_SILVER
                                                    }
                                                    K
                                                </span>
                                            </div>
                                            <h4 className="mt-2 font-semibold">
                                                VIP Silver
                                            </h4>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Enhanced visibility in search
                                                results
                                            </p>
                                        </Label>
                                    </div>

                                    <div className="flex">
                                        <RadioGroupItem
                                            value="REGULAR"
                                            id="regular"
                                            className="peer sr-only"
                                        />
                                        <Label
                                            htmlFor="regular"
                                            className="flex flex-1 cursor-pointer flex-col rounded-lg border p-4 transition-all peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 hover:border-blue-300 hover:bg-blue-50/50"
                                        >
                                            <div className="flex items-center justify-between gap-x-2">
                                                <div className="rounded-full bg-blue-100 p-2">
                                                    <Tag className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <span className="font-bold text-blue-700">
                                                    {
                                                        directPaymentPrices.REGULAR
                                                    }
                                                    K
                                                </span>
                                            </div>
                                            <h4 className="mt-2 font-semibold">
                                                Regular
                                            </h4>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Standard listing visibility
                                            </p>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>

                <CardFooter className="flex flex-col justify-between gap-3 border-t p-6 sm:flex-row">
                    <Button variant="outline">Cancel</Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={
                            isCreating ||
                            isPaying ||
                            (paymentMethod === 'existingPlan' &&
                                (!selectedPlan || !selectedTier)) ||
                            (paymentMethod === 'newPayment' && !selectedTier)
                        }
                        onClick={handleSubmit}
                    >
                        {isCreating || isPaying ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Please wait...
                            </div>
                        ) : (
                            'Publish Property'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};
