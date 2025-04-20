import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeDollarSign, Tag, ArrowLeft } from 'lucide-react';
import { ApartmentForm } from '@/components/ApartmentForm';
import { HouseForm } from '@/components/HouseForm';
import { LandForm } from '@/components/LandForm';
import { PostPaymentPage } from './PostPaymentPage';

export const AddPostPage = () => {
    const [step, setStep] = useState(1);
    const [typeTransaction, setTypeTransaction] = useState(null);
    const [category, setCategory] = useState('');

    const navigate = useNavigate();

    const handleNext = () => setStep(step + 1);
    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate(-1);
        }
    };

    const handleTransactionTypeSelect = (type) => {
        setTypeTransaction(type);
        handleNext();
    };

    const handleCategorySelect = (type) => {
        setCategory(type);
        handleNext();
    };

    return (
        <div className="relative h-full">
            <button
                onClick={handleBack}
                className="absolute top-4 right-12 p-3"
            >
                <div className="flex items-center justify-center gap-x-2 font-semibold">
                    <ArrowLeft className="h-5 w-5" /> Back
                </div>
            </button>
            {step === 1 && (
                <div className="flex h-full">
                    <div className="flex flex-[3]">
                        <img
                            src="step1-bg.png"
                            alt="Step-1 Background"
                            className="h-full w-full object-cover"
                        />{' '}
                    </div>
                    <div className="flex flex-[2] flex-col justify-center space-y-8 p-10">
                        <div className="space-y-2 text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                                Start Your Property Post
                            </h1>
                            <p className="text-lg leading-relaxed text-gray-700">
                                Are you interested in{' '}
                                <span className="font-semibold text-green-600">
                                    selling
                                </span>{' '}
                                your property, or would you like to offer it{' '}
                                <span className="font-semibold text-blue-600">
                                    for lease
                                </span>
                                ? Choose the option that best describes your
                                goal for this listing.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() =>
                                    handleTransactionTypeSelect('Sale')
                                }
                                className="relative rounded-md border border-gray-300 bg-white px-6 py-4 text-lg font-semibold text-green-700 shadow-sm transition-all duration-200 hover:border-green-500 hover:bg-green-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                            >
                                <div className="flex items-center justify-center gap-x-3">
                                    <BadgeDollarSign />
                                    For Sale
                                </div>
                            </button>
                            <button
                                onClick={() =>
                                    handleTransactionTypeSelect('Lease')
                                }
                                className="relative rounded-md border border-gray-300 bg-white px-6 py-4 text-lg font-semibold text-blue-700 shadow-sm transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                                <div className="flex items-center justify-center gap-x-3">
                                    <Tag />
                                    For Lease
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div className="flex h-full">
                    <div className="flex flex-[3] items-center justify-center">
                        <img src="step2-bg.png" alt="Select Category" />
                    </div>
                    <div className="flex flex-[2] flex-col items-start justify-center space-y-8 p-10">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                                Choose Property Category
                            </h1>
                            <p className="text-lg leading-relaxed text-gray-700">
                                To help us tailor the listing process, please
                                specify the type of property you wish to post.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {' '}
                            <button
                                onClick={() => handleCategorySelect('Land')}
                                className="relative rounded-md border border-gray-300 bg-white px-6 py-4 text-lg font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-amber-500 hover:bg-amber-50 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Land
                            </button>
                            <button
                                onClick={() =>
                                    handleCategorySelect('Apartment')
                                }
                                className="relative rounded-md border border-gray-300 bg-white px-6 py-4 text-lg font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-amber-500 hover:bg-amber-50 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Apartment
                            </button>
                            <button
                                onClick={() => handleCategorySelect('House')}
                                className="relative rounded-md border border-gray-300 bg-white px-6 py-4 text-lg font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-amber-500 hover:bg-amber-50 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none"
                            >
                                House
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {step === 3 && (
                <div className="h-full overflow-y-scroll">
                    {category === 'Apartment' && (
                        <ApartmentForm onFormSubmit={handleNext} />
                    )}
                    {category === 'House' && (
                        <HouseForm onFormSubmit={handleNext} />
                    )}
                    {category === 'Land' && (
                        <LandForm onFormSubmit={handleNext} />
                    )}
                </div>
            )}
            {step === 4 && (
                <div className="h-full overflow-y-scroll">
                    <PostPaymentPage />
                </div>
            )}
        </div>
    );
};
