import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';

export const SignInPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

        // Add your form submission logic here
    };

    return (
        <div className="flex h-full">
            <div className="relative flex-[2] md:bg-[#fcf5f3]">
                <img src="/home-bg.png"></img>
            </div>
            <div className="flex-[3]">
                <div className="mx-auto max-w-xl p-6 text-center">
                    <h1 className="mb-2 text-3xl font-bold">Sign In</h1>
                    <p className="mb-6 text-gray-600">
                        Welcome back! Enter your credentials to sign in.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-5">
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

                        <div className="space-y-5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <p className="text-sm text-red-500">{error}</p>
                        <Button
                            type="submit"
                            className="w-full bg-black text-white hover:bg-gray-800"
                        >
                            Login
                        </Button>
                    </form>

                    <p className="mt-6 text-center">
                        Don't have an account?{' '}
                        <Link to={'/sign-up'} className="text-black underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
