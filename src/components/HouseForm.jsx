'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Plus, X } from 'lucide-react';

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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export const HouseForm = ({ onFormSubmit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        projectName: '',
        price: '',
        ward: '',
        town: '',
        province: '',
        fullAddress: '',
        squareMeters: '',
        description: '',
        longitude: '',
        latitude: '',
        startTime: new Date(),
        expireTime: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        numBedrooms: '',
        numBathrooms: '',
        floor: '',
        buildingName: '',
        landArea: '',
        houseType: '',
        hasGarden: false,
        hasBalcony: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleDateChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
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

            // Create URLs for preview
            const newUrls = newFiles.map((file) => URL.createObjectURL(file));
            setImageUrls((prev) => [...prev, ...newUrls]);
        }
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(imageUrls[index]);
        setImages(images.filter((_, i) => i !== index));
        setImageUrls(imageUrls.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Here you would typically upload images and submit the form data
            console.log('Form data:', formData);
            console.log('Images:', images);
            onFormSubmit();
            // Simulate API call
           
            // Reset form if needed
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to create listing. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="mb-8 text-3xl font-bold">
                Provide Apartment Information
            </h1>

            <form onSubmit={handleSubmit} className="mb-10 space-y-8">
                <Tabs defaultValue="basic" className="w-full">
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
                                    <p className="text-muted-foreground text-sm">
                                        A catchy title for your listing
                                    </p>
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
                                    <p className="text-muted-foreground text-sm">
                                        The name of the development project
                                    </p>
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
                                    <p className="text-muted-foreground text-sm">
                                        The selling price in your local currency
                                    </p>
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
                                            value={formData.province}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="town">Town/City</Label>
                                        <Input
                                            id="town"
                                            name="town"
                                            placeholder="e.g., Toronto"
                                            value={formData.town}
                                            onChange={handleChange}
                                            required
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
                                            value={formData.ward}
                                            onChange={handleChange}
                                            required
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
                                    <p className="text-muted-foreground text-sm">
                                        Complete street address of the property
                                    </p>
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
                                        <p className="text-muted-foreground text-sm">
                                            Total area in square meters
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="buildingName">
                                            Building Name
                                        </Label>
                                        <Input
                                            id="buildingName"
                                            name="buildingName"
                                            placeholder="e.g., Sunset Residences"
                                            value={formData.buildingName}
                                            onChange={handleChange}
                                        />
                                        <p className="text-muted-foreground text-sm">
                                            Name of the building (if applicable)
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="numBedrooms">
                                            Bedrooms
                                        </Label>
                                        <Input
                                            id="numBedrooms"
                                            name="numBedrooms"
                                            type="number"
                                            min="0"
                                            value={formData.numBedrooms}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="numBathrooms">
                                            Bathrooms
                                        </Label>
                                        <Input
                                            id="numBathrooms"
                                            name="numBathrooms"
                                            type="number"
                                            min="0"
                                            value={formData.numBathrooms}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="floor">Floor</Label>
                                        <Input
                                            id="floor"
                                            name="floor"
                                            type="number"
                                            min="0"
                                            value={formData.floor}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="landArea">
                                            Land Area
                                        </Label>
                                        <Input
                                            id="landArea"
                                            name="landArea"
                                            type="number"
                                            min="0"
                                            placeholder="e.g., 250"
                                            value={formData.landArea}
                                            onChange={handleChange}
                                        />
                                        <p className="text-muted-foreground text-sm">
                                            Total area of the land in
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="houseType">
                                            House Type
                                        </Label>
                                        <Input
                                            id="houseType"
                                            name="houseType"
                                            type="text"
                                            placeholder="e.g,. Single-family House"
                                            value={formData.houseType}
                                            onChange={handleChange}
                                        />
                                        <p className="text-muted-foreground text-sm">
                                            Specify the type of home
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                                    <Checkbox
                                        id="hasGarden"
                                        checked={formData.hasGarden}
                                        onCheckedChange={(checked) =>
                                            handleCheckboxChange(
                                                'hasGarden',
                                                checked
                                            )
                                        }
                                    />
                                    <div className="space-y-1 leading-none">
                                        <Label htmlFor="hasGarden">
                                            Garden
                                        </Label>
                                        <p className="text-muted-foreground text-sm">
                                            Does the apartment have a balcony?
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                                    <Checkbox
                                        id="hasGargage"
                                        checked={formData.hasGargage}
                                        onCheckedChange={(checked) =>
                                            handleCheckboxChange(
                                                'hasGargage',
                                                checked
                                            )
                                        }
                                    />
                                    <div className="space-y-1 leading-none">
                                        <Label htmlFor="hasGargage">
                                            Balcony
                                        </Label>
                                        <p className="text-muted-foreground text-sm">
                                            Does the apartment have a balcony?
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
                                    <p className="text-muted-foreground text-sm">
                                        Provide a detailed description of your
                                        apartment, including amenities,
                                        features, and any other relevant
                                        information.
                                    </p>
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
                                            <PopoverContent className="w-auto p-0">
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
                                            <PopoverContent className="w-auto p-0">
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
                                                    disabled={(date) =>
                                                        date < new Date()
                                                    }
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
                    <Button type="button" variant="outline">
                        Reset
                    </Button>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create
                    </Button>
                </div>
            </form>
        </div>
    );
};
