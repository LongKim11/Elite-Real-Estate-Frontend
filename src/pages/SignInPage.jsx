import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';

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
            <div
                className="relative flex-[3] bg-cover bg-center md:bg-[#fcf5f3]"
                style={{ backgroundImage: "url('/left-bg.png')" }}
            ></div>
            <div className="flex-[3]">
                <div className="mx-auto mt-20 max-w-xl p-6 text-center">
                    <h1 className="mb-2 text-3xl font-bold">Sign In</h1>
                    <p className="mb-6 text-gray-600">
                        Welcome back! Enter your credentials to sign in.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mb-5 space-y-3">
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

                        <div className="mb-5 space-y-3">
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
                        <div className="mb-5 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="rememberMe"
                                    className="border-gray-300"
                                    required
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm leading-none font-medium text-gray-700"
                                >
                                    Remember me
                                </label>
                            </div>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-500 hover:underline focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                                Forgot password?
                            </Link>
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
