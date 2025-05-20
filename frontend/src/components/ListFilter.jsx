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

export const ListFilter = ({ filters, onChange, onFilter }) => {
    const handleChange = (name, value) => {
        onChange({ ...filters, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter();
    };

    return (
        <div className="w-full">
            <h2 className="mb-5 text-2xl font-semibold">Search results for</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="fullAddress">Full Address</Label>
                    <Input
                        id="fullAddress"
                        placeholder="e.g. 1600 Amphitheatre Parkway, Mountain View, CA"
                    />
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="province">Province</Label>
                        <Input
                            id="province"
                            placeholder="e.g. Ho Chi Minh"
                            value={filters.province}
                            onChange={(e) =>
                                handleChange('province', e.target.value)
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Input
                            id="district"
                            placeholder="e.g. Tan Phong"
                            value={filters.district}
                            onChange={(e) =>
                                handleChange('district', e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-4">
                    <div className="space-y-2">
                        <Label htmlFor="transactionType">
                            Transaction Type
                        </Label>
                        <Select
                            value={filters.transactionType}
                            onValueChange={(value) =>
                                handleChange('transactionType', value)
                            }
                        >
                            <SelectTrigger
                                id="transactionType"
                                className="w-full"
                            >
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">Any</SelectItem>
                                <SelectItem value="sale">For Sale</SelectItem>
                                <SelectItem value="rent">For Rent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="propertyType">Category</Label>
                        <Select
                            value={filters.propertyType}
                            onValueChange={(value) =>
                                handleChange('propertyType', value)
                            }
                        >
                            <SelectTrigger id="propertyType" className="w-full">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">Any</SelectItem>
                                <SelectItem value="house">House</SelectItem>
                                <SelectItem value="apartment">
                                    Apartment
                                </SelectItem>
                                <SelectItem value="land">Land</SelectItem>
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
