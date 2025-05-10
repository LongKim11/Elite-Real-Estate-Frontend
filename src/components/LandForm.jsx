import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { editProperty } from '@/api/listingService';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export const LandForm = ({
    typeTransaction,
    onFormSubmit,
    updateStatus = false,
    item = null
}) => {
    const [images, setImages] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);

    const [formData, setFormData] = useState({
        address: {
            ward: '',
            town: '',
            province: ''
        },
        price: '',
        category: 'Land',
        title: '',
        fullAddress: '',
        projectName: '',
        description: '',
        typeTransaction: typeTransaction,
        squareMeters: '',
        longitude: '',
        latitude: '',
        startTime: new Date(),
        expireTime: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        landUsageDuration: '',
        legalStatus: '',
        roadFrontage: '',
        landType: '',
        zoningType: '',
        canBuild: false
    });

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

            setFormData({
                ...filteredItem
            });

            if (item.images) {
                setImageUrls(item.images.map((img) => img.imageUrl));
            }
        }
    }, [item]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));
    };

    const handleDateChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: new Date(value).toISOString()
        });
    };

    const handleCheckboxChange = (name, checked) => {
        setFormData({
            ...formData,
            [name]: checked
        });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        const propertyRequest = { ...formData };

        formDataToSend.append(
            'propertyRequest',
            JSON.stringify(propertyRequest)
        );

        images.forEach((image) => formDataToSend.append('files', image));

        onFormSubmit(formDataToSend);
    };

    const navigate = useNavigate();

    const { mutate: updateProperty, isLoading } = useMutation({
        mutationFn: ({ propertyId, formDataToSend }) =>
            editProperty({ propertyId, formDataToSend }),
        onSuccess: (res) => {
            console.log('Update Property Data', res);
            toast.success('Update Property Successfully');
            navigate(`/list/${item.propertyId}`);
        },
        onError: (err) => {
            console.log('Update Property Error', err.response.data.error);
            toast.error('Error occured while updating property');
        }
    });

    const handleUpdate = () => {
        const formDataToSend = new FormData();

        const { address, startTime, expireTime, ...formUpdateData } = formData;

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
                Provide Land Information
            </h1>

            <form onSubmit={handleSubmit} className="mb-10 space-y-8">
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
                                        id="title"
                                        name="title"
                                        placeholder="e.g., Luxury 2BR Apartment with City View"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="projectName">
                                        Project Name
                                    </Label>
                                    <Input
                                        id="projectName"
                                        name="projectName"
                                        placeholder="e.g., Sunshine Towers"
                                        value={formData.projectName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        placeholder="e.g., 250000"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
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
                                            id="province"
                                            name="province"
                                            placeholder="e.g., Ontario"
                                            value={formData.address.province}
                                            onChange={handleAddressChange}
                                            required
                                            disabled={updateStatus}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="town">Town/City</Label>
                                        <Input
                                            id="town"
                                            name="town"
                                            placeholder="e.g., Toronto"
                                            value={formData.address.town}
                                            onChange={handleAddressChange}
                                            required
                                            disabled={updateStatus}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ward">
                                            Ward/District
                                        </Label>
                                        <Input
                                            id="ward"
                                            name="ward"
                                            placeholder="e.g., Downtown"
                                            value={formData.address.ward}
                                            onChange={handleAddressChange}
                                            required
                                            disabled={updateStatus}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fullAddress">
                                        Full Address
                                    </Label>
                                    <Input
                                        id="fullAddress"
                                        name="fullAddress"
                                        placeholder="e.g., 123 Main Street, Apt 4B"
                                        value={formData.fullAddress}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="longitude">
                                            Longitude
                                        </Label>
                                        <Input
                                            id="longitude"
                                            name="longitude"
                                            type="number"
                                            step="0.000001"
                                            placeholder="e.g., -79.347015"
                                            value={formData.longitude}
                                            onChange={handleChange}
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
                                            id="latitude"
                                            name="latitude"
                                            type="number"
                                            step="0.000001"
                                            placeholder="e.g., 43.651070"
                                            value={formData.latitude}
                                            onChange={handleChange}
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
                                            id="squareMeters"
                                            name="squareMeters"
                                            type="number"
                                            placeholder="e.g., 85"
                                            value={formData.squareMeters}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="roadFrontage">
                                            Road Frontage
                                        </Label>
                                        <Input
                                            id="roadFrontage"
                                            name="roadFrontage"
                                            type="number"
                                            min="0"
                                            placeholder="e.g., 10"
                                            value={formData.roadFrontage}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="zoningType">
                                            Zoning Type
                                        </Label>
                                        <Input
                                            id="zoningType"
                                            name="zoningType"
                                            type="text"
                                            placeholder="e.g., Residential"
                                            value={formData.zoningType}
                                            onChange={handleChange}
                                            required
                                        />
                                        <p className="text-muted-foreground text-sm">
                                            Specify the zoning classification of
                                            the property.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="landType">
                                            Land Type
                                        </Label>
                                        <Input
                                            id="landType"
                                            name="landType"
                                            placeholder="e.g., Agricultural Land"
                                            value={formData.landType}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="landUsageDuration">
                                            Land Usage Duration
                                        </Label>
                                        <Input
                                            id="landUsageDuration"
                                            name="landUsageDuration"
                                            type="text"
                                            value={formData.landUsageDuration}
                                            onChange={handleChange}
                                            placeholder="e.g., Long-term,"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="legalStatus">
                                            Legal Status
                                        </Label>
                                        <Input
                                            id="legalStatus"
                                            name="legalStatus"
                                            type="text"
                                            value={formData.legalStatus}
                                            onChange={handleChange}
                                            placeholder="e.g., Freehold"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                                    <Checkbox
                                        id="canBuild"
                                        checked={formData.canBuild}
                                        onCheckedChange={(checked) =>
                                            handleCheckboxChange(
                                                'canBuild',
                                                checked
                                            )
                                        }
                                    />
                                    <div className="space-y-1 leading-none">
                                        <Label htmlFor="canBuild">
                                            Can build
                                        </Label>
                                        <p className="text-muted-foreground text-sm">
                                            Is the apartment available to build?
                                        </p>
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
                                        id="description"
                                        name="description"
                                        placeholder="Describe your apartment in detail..."
                                        className="min-h-[150px]"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
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
                                                    {formData.startTime ? (
                                                        format(
                                                            formData.startTime,
                                                            'PPP'
                                                        )
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                side="top"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        formData.startTime
                                                    }
                                                    onSelect={(date) =>
                                                        handleDateChange(
                                                            'startTime',
                                                            date
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
                                                    {formData.expireTime ? (
                                                        format(
                                                            formData.expireTime,
                                                            'PPP'
                                                        )
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                side="top"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        formData.expireTime
                                                    }
                                                    onSelect={(date) =>
                                                        handleDateChange(
                                                            'expireTime',
                                                            date
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
                                    onClick={handleUpdate}
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
