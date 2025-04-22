import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation } from '@tanstack/react-query';
import { Spinner } from '@/components/Spinner';
import { toast } from 'sonner';
import { login } from '@/api/authService';
import { useNavigate } from 'react-router-dom';

export const SignInPage = () => {
    const [formData, setFormData] = useState({
        phoneNumber: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const navigate = useNavigate();

    const { mutate: handleLogin, isPending } = useMutation({
        mutationFn: login,
        onSuccess: (res) => {
            console.log('Login Response', res);
            toast.success(res.message);
            if (res.role === 'User') {
                navigate('/');
            } else {
                navigate('/admin');
            }
        },
        onError: (err) => {
            console.error('Login Error:', err.response.data.error);
            toast.error(err.response.data.error);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(formData);
    };

    return (
        <div className="flex h-full">
            {isPending && <Spinner />}
            <div
                className="relative flex-[3] bg-cover bg-center md:bg-[#fcf5f3]"
                style={{ backgroundImage: "url('/left-bg.png')" }}
            ></div>
            <div className="flex-[3]">
                <div className="mx-auto mt-12 max-w-lg p-6 text-center">
                    <h1 className="mb-2 text-3xl font-bold">Sign In</h1>
                    <p className="mb-6 text-gray-600">
                        Welcome back! Enter your credentials to sign in.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mb-5 space-y-3">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="text"
                                placeholder="Enter your phone number"
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
