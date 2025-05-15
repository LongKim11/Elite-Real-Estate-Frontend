import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { editProperty } from '@/api/listingService';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apartmentSchema } from '@/schemas/apartment.schema';

export const ApartmentForm = ({
    typeTransaction,
    onFormSubmit,
    updateStatus = false,
    item = null
}) => {
    const [images, setImages] = useState([]);

    const [imageUrls, setImageUrls] = useState([]);

    const { register, handleSubmit, setValue, watch, reset } = useForm({
        resolver: zodResolver(apartmentSchema),
        mode: 'onSubmit',
        defaultValues: {
            address: { ward: '', town: '', province: '' },
            price: '',
            category: 'Apartment',
            title: '',
            fullAddress: '',
            projectName: '',
            description: '',
            typeTransaction: typeTransaction,
            squareMeters: '',
            longitude: '',
            latitude: '',
            startTime: new Date().toISOString(),
            expireTime: new Date(
                new Date().setMonth(new Date().getMonth() + 1)
            ).toISOString(),
            numBedrooms: '',
            numBathrooms: '',
            floor: '',
            buildingName: '',
            hasBalcony: false,
            maintenanceFee: '',
            parkingAvailability: false
        }
    });

    const startTime = watch('startTime');
    const expireTime = watch('expireTime');
    const hasBalcony = watch('hasBalcony');
    const parkingAvailability = watch('parkingAvailability');

    const tabs = ['basic', 'location', 'details', 'additional'];
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        if (item) {
            const {
                propertyId,
                observers,
                images,
                propertyObservers,
                userId,
                category,
                ...filteredItem
            } = item;

            const fieldsToString = [
                'price',
                'squareMeters',
                'numBedrooms',
                'numBathrooms',
                'floor',
                'maintenanceFee'
            ];

            const fixedItem = { ...filteredItem };

            fieldsToString.forEach((field) => {
                fixedItem[field] = String(fixedItem[field]);
            });

            reset(fixedItem);

            if (item.images) {
                setImageUrls(item.images.map((img) => img.imageUrl));
            }
        }
    }, [item]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setImages((prev) => [...prev, ...newFiles]);

            const newUrls = newFiles.map((file) => URL.createObjectURL(file));
            setImageUrls((prev) => [...prev, ...newUrls]);
        }
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(imageUrls[index]);
        setImages(images.filter((_, i) => i !== index));
        setImageUrls(imageUrls.filter((_, i) => i !== index));
    };

    const handleTabChange = (value) => {
        setActiveTab(value);
    };

    const handleNextTab = () => {
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1]);
        }
    };

    const handlePreviousTab = () => {
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1]);
        }
    };

    const onSubmit = (data) => {
        const formDataToSend = new FormData();

        const propertyRequest = { ...data };

        formDataToSend.append(
            'propertyRequest',
            JSON.stringify(propertyRequest)
        );
        images.forEach((image) => formDataToSend.append('files', image));

        onFormSubmit(formDataToSend);
    };

    function extractErrorMessages(errorsObj) {
        const messages = [];

        function traverse(obj) {
            for (const key in obj) {
                const value = obj[key];

                if (value && typeof value === 'object') {
                    if (value.message) {
                        messages.push(value.message);
                    } else {
                        traverse(value);
                    }
                }
            }
        }

        traverse(errorsObj);
        return messages;
    }

    const onError = (formErrors) => {
        console.log('Form Errors', formErrors);

        const errorMsg = extractErrorMessages(formErrors);

        if (errorMsg?.length > 0) {
            toast.error(errorMsg[0]);
        }
    };

    const { mutate: updateProperty, isLoading } = useMutation({
        mutationFn: ({ propertyId, formDataToSend }) =>
            editProperty({ propertyId, formDataToSend }),
        onSuccess: (res) => {
            console.log('Update Property Data', res);
            toast.success('Update Property Successfully');
            window.location.href = `/list/${item.propertyId}`;
        },
        onError: (err) => {
            console.log('Update Property Error', err.response.data.error);
            toast.error('Error occured while updating property');
        }
    });

    const onUpdate = (data) => {
        const formDataToSend = new FormData();
        const { address, startTime, expireTime, ...formUpdateData } = data;
        const propertyRequest = { ...formUpdateData };
        formDataToSend.append(
            'propertyRequest',
            JSON.stringify(propertyRequest)
        );
        updateProperty({ propertyId: item.propertyId, formDataToSend });
    };

    return (
        <div className="container mx-auto max-w-7xl px-4 py-10">
            <h1 className="mb-8 text-3xl font-bold">
                Provide Apartment Information
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="mb-10 space-y-8"
            >
                <Tabs
                    value={activeTab}
                    className="w-full"
                    onValueChange={handleTabChange}
                >
                    <TabsList className="mb-6 grid grid-cols-4">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="location">Location</TabsTrigger>
                        <TabsTrigger value="details">
                            Property Details
                        </TabsTrigger>
                        <TabsTrigger value="additional">
                            Additional Info
                        </TabsTrigger>
                    </TabsList>

                    {/* Basic Information */}
                    <TabsContent value="basic">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Enter the basic details about your apartment
                                    listing.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        {...register('title')}
                                        name="title"
                                        placeholder="e.g., Luxury 2BR Apartment with City View"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="projectName">
                                        Project Name
                                    </Label>
                                    <Input
                                        {...register('projectName')}
                                        placeholder="e.g., Sunshine Towers"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        {...register('price')}
                                        placeholder="e.g., 250000"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Images
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6">
                                            <label
                                                htmlFor="image-upload"
                                                className="cursor-pointer"
                                            >
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Plus className="text-muted-foreground h-8 w-8" />
                                                    <span className="text-sm font-medium">
                                                        Add Images
                                                    </span>
                                                    <span className="text-muted-foreground text-xs">
                                                        Upload high-quality
                                                        photos of your apartment
                                                    </span>
                                                </div>
                                                <input
                                                    id="image-upload"
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                    disabled={updateStatus}
                                                />
                                            </label>
                                        </div>

                                        {imageUrls.length > 0 && (
                                            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                                {imageUrls.map((url, index) => (
                                                    <div
                                                        key={index}
                                                        className="group relative"
                                                    >
                                                        <img
                                                            src={
                                                                url ||
                                                                '/placeholder.svg'
                                                            }
                                                            alt={`Apartment image ${index + 1}`}
                                                            className="h-32 w-full rounded-md object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                updateStatus
                                                            }
                                                            onClick={() =>
                                                                removeImage(
                                                                    index
                                                                )
                                                            }
                                                            className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Location */}
                    <TabsContent value="location">
                        <Card>
                            <CardHeader>
                                <CardTitle>Location</CardTitle>
                                <CardDescription>
                                    Enter the location details of your
                                    apartment.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="province">
                                            Province
                                        </Label>
                                        <Input
                                            {...register('address.province')}
                                            placeholder="e.g., Ontario"
                                            disabled={updateStatus}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="town">Town/City</Label>
                                        <Input
                                            {...register('address.town')}
                                            placeholder="e.g., Toronto"
                                            disabled={updateStatus}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ward">
                                            Ward/District
                                        </Label>
                                        <Input
                                            {...register('address.ward')}
                                            placeholder="e.g., Downtown"
                                            disabled={updateStatus}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fullAddress">
                                        Full Address
                                    </Label>
                                    <Input
                                        {...register('fullAddress')}
                                        placeholder="e.g., 123 Main Street, Apt 4B"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="longitude">
                                            Longitude
                                        </Label>
                                        <Input
                                            {...register('longitude')}
                                            placeholder="e.g., -79.347015"
                                        />
                                        <p className="text-muted-foreground text-sm">
                                            Precise longitude coordinates
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="latitude">
                                            Latitude
                                        </Label>
                                        <Input
                                            {...register('latitude')}
                                            placeholder="e.g., 43.651070"
                                        />
                                        <p className="text-muted-foreground text-sm">
                                            Precise latitude coordinates
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Property Details */}
                    <TabsContent value="details">
                        <Card>
                            <CardHeader>
                                <CardTitle>Property Details</CardTitle>
                                <CardDescription>
                                    Enter the specific details about your
                                    apartment.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="squareMeters">
                                            Square Meters
                                        </Label>
                                        <Input
                                            {...register('squareMeters')}
                                            placeholder="e.g., 85"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="buildingName">
                                            Building Name
                                        </Label>
                                        <Input
                                            {...register('buildingName')}
                                            placeholder="e.g., Sunset Residences"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="maintenanceFee">
                                            Maintenance Fee
                                        </Label>
                                        <Input
                                            {...register('maintenanceFee')}
                                            placeholder="e.g., 250000"
                                        />
                                        <p className="text-muted-foreground text-sm">
                                            Monthly maintenance fee (if
                                            applicable)
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="numBedrooms">
                                            Bedrooms
                                        </Label>
                                        <Input
                                            {...register('numBedrooms')}
                                            placeholder="e.g., 4"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="numBathrooms">
                                            Bathrooms
                                        </Label>
                                        <Input
                                            {...register('numBathrooms')}
                                            placeholder="e.g., 3"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="floor">Floor</Label>
                                        <Input
                                            {...register('floor')}
                                            placeholder="e.g., 2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="flex items-start space-x-3 rounded-md border p-4">
                                        <Checkbox
                                            id="parkingAvailability"
                                            check={parkingAvailability}
                                            onCheckedChange={(checked) =>
                                                setValue(
                                                    'parkingAvailability',
                                                    checked === true
                                                )
                                            }
                                        />
                                        <div className="space-y-1 leading-none">
                                            <Label htmlFor="parkingAvailability">
                                                Parking Availability
                                            </Label>
                                            <p className="text-muted-foreground text-sm">
                                                Is parking available for this
                                                property?
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 rounded-md border p-4">
                                        <Checkbox
                                            id="hasBalcony"
                                            checked={hasBalcony}
                                            onCheckedChange={(checked) =>
                                                setValue(
                                                    'hasBalcony',
                                                    checked === true
                                                )
                                            }
                                        />
                                        <div className="space-y-1 leading-none">
                                            <Label htmlFor="hasBalcony">
                                                Balcony
                                            </Label>
                                            <p className="text-muted-foreground text-sm">
                                                Does the apartment have a
                                                balcony?
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Additional Information */}
                    <TabsContent value="additional">
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Information</CardTitle>
                                <CardDescription>
                                    Enter additional details and listing
                                    duration.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        {...register('description')}
                                        placeholder="Provide a detailed description of your apartment, including amenities, features, and any other relevant information."
                                        className="min-h-[150px]"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="startTime">
                                            Start Date
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {startTime ? (
                                                        format(startTime, 'PPP')
                                                    ) : (
                                                        <span className="text-gray-500">
                                                            Pick a date
                                                        </span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                side="top"
                                                className="w-auto p-0"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={startTime}
                                                    onSelect={(date) =>
                                                        setValue(
                                                            'startTime',
                                                            date.toISOString(),
                                                            {
                                                                shouldValidate: true
                                                            }
                                                        )
                                                    }
                                                    initialFocus
                                                    disabled={updateStatus}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <p className="text-muted-foreground text-sm">
                                            When should the listing become
                                            active?
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="expireTime">
                                            Expiration Date
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {expireTime ? (
                                                        format(
                                                            expireTime,
                                                            'PPP'
                                                        )
                                                    ) : (
                                                        <span className="text-gray-500">
                                                            Pick a date
                                                        </span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                side="top"
                                                className="w-auto p-0"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={expireTime}
                                                    onSelect={(date) =>
                                                        setValue(
                                                            'expireTime',
                                                            date.toISOString(),
                                                            {
                                                                shouldValidate: true
                                                            }
                                                        )
                                                    }
                                                    initialFocus
                                                    disabled={updateStatus}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <p className="text-muted-foreground text-sm">
                                            When should the listing expire?
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePreviousTab}
                    >
                        Previous
                    </Button>
                    {activeTab === 'additional' && (
                        <>
                            {!updateStatus && (
                                <Button type="submit">Create</Button>
                            )}
                            {updateStatus && (
                                <Button
                                    type="button"
                                    onClick={handleSubmit(onUpdate, onError)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Please wait...
                                        </div>
                                    ) : (
                                        <>Update Property</>
                                    )}
                                </Button>
                            )}
                        </>
                    )}
                    {activeTab !== 'additional' && (
                        <Button type="button" onClick={handleNextTab}>
                            Next
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};
