import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';

export const SignInPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);

        if (formData.confirmPassword !== formData.password) {
            setError('Confirmation password does not match');
        }

        // Add your form submission logic here
    };

    return (
        <div className="flex h-full">
            <div className="flex-[3]">
                <div className="mx-auto max-w-md p-6">
                    <h1 className="mb-2 text-3xl font-bold">
                        Create an account
                    </h1>
                    <p className="mb-6 text-gray-600">
                        Let's get started. Fill in the details below to create
                        your account.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g. John Smith"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="example@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="text"
                                placeholder="Your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="At least 8 characters"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="confirmPassword">
                                Confirm your password
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Re-enter to confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <p className="text-sm text-red-500">{error}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" name="agreeToTerms" required />
                            <label
                                htmlFor="terms"
                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I agree to the{' '}
                                <Link
                                    href="/terms"
                                    className="text-black underline"
                                >
                                    Terms & Conditions
                                </Link>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-black text-white hover:bg-gray-800"
                        >
                            Sign up
                        </Button>
                    </form>

                    <p className="mt-6 text-center">
                        Already have account?{' '}
                        <Link href="/sign-in" className="text-black underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
            <div className="relative flex-[2] md:bg-[#fcf5f3]">
                <img src="/home-bg.png"></img>
            </div>
        </div>
    );
};
