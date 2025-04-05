import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Search } from 'lucide-react';

export const ListFilter = () => {
    const [filters, setFilters] = useState({
        location: '',
        type: '',
        property: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: ''
    });

    const handleChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Filters applied:', filters);
        // Here you would typically filter results or navigate to a filtered results page
    };

    return (
        <div className="mt-5 w-full">
            <h2 className="mb-5 text-2xl font-semibold">Search results for</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        placeholder="City, Location"
                        value={filters.location}
                        onChange={(e) =>
                            handleChange('location', e.target.value)
                        }
                    />
                </div>

                <div className="grid gap-5 xl:grid-cols-5">
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                            value={filters.type}
                            onValueChange={(value) =>
                                handleChange('type', value)
                            }
                        >
                            <SelectTrigger id="type" className="w-full">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="sale">For Sale</SelectItem>
                                <SelectItem value="rent">For Rent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="property">Property</Label>
                        <Select
                            value={filters.property}
                            onValueChange={(value) =>
                                handleChange('property', value)
                            }
                        >
                            <SelectTrigger id="property" className="w-full">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="house">House</SelectItem>
                                <SelectItem value="apartment">
                                    Apartment
                                </SelectItem>
                                <SelectItem value="condo">Condo</SelectItem>
                                <SelectItem value="townhouse">
                                    Townhouse
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="minPrice">Min Price</Label>
                        <Input
                            id="minPrice"
                            placeholder="Any"
                            value={filters.minPrice}
                            onChange={(e) =>
                                handleChange('minPrice', e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="maxPrice">Max Price</Label>
                        <Input
                            id="maxPrice"
                            placeholder="Any"
                            value={filters.maxPrice}
                            onChange={(e) =>
                                handleChange('maxPrice', e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                            id="bedrooms"
                            placeholder="Any"
                            value={filters.bedrooms}
                            onChange={(e) =>
                                handleChange('bedrooms', e.target.value)
                            }
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-amber-400 text-black hover:bg-amber-500"
                >
                    <Search className="mr-2 h-4 w-4" />
                    Search
                </Button>
            </form>
        </div>
    );
};
