import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { register } from '@/api/authService';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/Spinner';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/schemas/register.schema';

export const SignUpPage = () => {
    const {
        register: formRegister,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: zodResolver(registerSchema), mode: 'onSubmit' });

    const navigate = useNavigate();

    const { mutate: handleRegister, isLoading } = useMutation({
        mutationFn: register,
        onSuccess: (res) => {
            console.log('Register Response:', res);
            toast.success(res.message);
            navigate('/sign-in');
        },
        onError: (err) => {
            console.error('Register Error:', err.response.data.error);
            toast.error(err.response.data.error);
        }
    });

    const onSubmit = (data) => {
        handleRegister(data);
    };

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="flex h-full">
                    <div
                        className="relative flex-[3] bg-cover bg-center md:bg-[#fcf5f3]"
                        style={{ backgroundImage: "url('/left-bg.png')" }}
                    ></div>
                    <div className="flex-[3] text-center">
                        <div className="mx-auto max-w-lg">
                            <h1 className="mb-2 text-3xl font-bold">
                                Create an account
                            </h1>
                            <p className="mb-6 text-gray-600">
                                Let's get started. Fill in the details below to
                                create your account.
                            </p>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <div className="mb-3 space-y-3">
                                    <Label htmlFor="fullName">Name</Label>
                                    <Input
                                        {...formRegister('fullName')}
                                        type="text"
                                        placeholder="e.g. John Smith"
                                    />
                                    {errors.fullName && (
                                        <p className="text-left text-sm text-red-500">
                                            {errors.fullName.message}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-3 space-y-3">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        {...formRegister('phoneNumber')}
                                        type="text"
                                        placeholder="Enter your phone number"
                                    />
                                    {errors.phoneNumber && (
                                        <p className="text-left text-sm text-red-500">
                                            {errors.phoneNumber.message}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-3 space-y-3">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        {...formRegister('password')}
                                        type="password"
                                        placeholder="At least 8 characters"
                                    />
                                    {errors.password && (
                                        <p className="text-left text-sm text-red-500">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-3 space-y-3">
                                    <Label htmlFor="confirmPassword">
                                        Confirm your password
                                    </Label>
                                    <Input
                                        {...formRegister('confirmPassword')}
                                        type="password"
                                        placeholder="Re-enter to confirm your password"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-left text-sm text-red-500">
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="terms"
                                        name="agreeToTerms"
                                        required
                                        className="border-gray-300"
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm leading-none font-medium"
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

                            <p className="mt-3 text-center">
                                Already have account?{' '}
                                <Link
                                    to={'/sign-in'}
                                    className="text-black underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            )}{' '}
        </>
    );
};
