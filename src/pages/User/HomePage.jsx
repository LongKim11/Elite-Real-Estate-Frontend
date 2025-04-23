import React from 'react';
import { HomeSearchBar } from '@/components/HomeSearchBar';
import { Home, Shield, FileText } from 'lucide-react';
import { listData } from '@/lib/dummydata';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';

export const HomePage = () => {
    const data = listData;

    return (
        <>
            {/* Hero Section */}
            <div
                className="relative h-screen bg-cover bg-center"
                style={{ backgroundImage: "url('/hero-section.png')" }}
            >
                <div className="flex items-center justify-center px-6 text-white">
                    <div className="max-w-3xl text-center">
                        <h1 className="mt-20 mb-8 text-5xl leading-relaxed font-bold">
                            Unlock Your Dream Home
                        </h1>
                        <h1 className="mb-8 text-5xl leading-relaxed font-bold">
                            And Start Your Journey Here.
                        </h1>
                        <h1 className="mb-8 text-5xl leading-relaxed font-bold"></h1>
                        <p className="my-8 leading-relaxed">
                            Our team is dedicated to helping you find the
                            perfect place that not only meets your requirements
                            but also complements your lifestyle.
                        </p>
                        <HomeSearchBar />
                        <div className="mt-8 flex justify-center space-x-12">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold">11+</h1>
                                <p className="text-lg">Years Of Experience</p>
                            </div>
                            <div className="text-center">
                                <h1 className="text-4xl font-bold">300</h1>
                                <p className="text-lg">Award Gained</p>
                            </div>
                            <div className="text-center">
                                <h1 className="text-4xl font-bold">1130+</h1>
                                <p className="text-lg">Property Ready</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Feature Section */}
            <section className="mt-12 bg-white py-16 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="mb-2 text-3xl font-bold">
                        Why You Should Work With Us
                    </h2>
                    <p className="mb-10 text-gray-500">
                        Your trusted partner for all your real estate needs.
                    </p>

                    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3">
                        <div className="flex flex-col items-center px-4 text-center">
                            <FileText className="mb-4 h-10 w-10" />
                            <h3 className="mb-2 text-lg font-semibold">
                                Wide Range of Properties
                            </h3>
                            <p className="text-gray-500">
                                We offer expert legal help for all related
                                property items in UK.
                            </p>
                        </div>
                        <div className="flex flex-col items-center px-4 text-center">
                            <Home className="mb-4 h-10 w-10" />
                            <h3 className="mb-2 text-lg font-semibold">
                                Buy or Rent Homes
                            </h3>
                            <p className="text-gray-500">
                                We sell your home at the best market price and
                                very quickly as well.
                            </p>
                        </div>
                        <div className="flex flex-col items-center px-4 text-center">
                            <Shield className="mb-4 h-10 w-10" />
                            <h3 className="mb-2 text-lg font-semibold">
                                Trusted by Thousands
                            </h3>
                            <p className="text-gray-500">
                                We offer you free consultancy to get a loan for
                                your new home.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Category Section */}
            <section className="mt-12 bg-white py-16 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="mb-2 text-3xl font-bold">
                        Feature Categories
                    </h2>
                    <p className="mb-10 text-gray-500">
                        Easily browse and discover the diverse types of real
                        estate we offer.
                    </p>
                    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3"></div>
                </div>
            </section>
            {/* Property Section */}
            <section className="mt-12 bg-white py-16 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="mb-2 text-3xl font-bold">
                        Discover Our Best Deals
                    </h2>
                    <p className="mb-10 text-gray-500">
                        Connecting you with exceptional homes and investment
                        opportunities.
                    </p>
                    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3"></div>
                </div>
            </section>
            {/* Hero Section 2 */}
            <section className="relative mt-12">
                <img
                    src="/hero-section2.png"
                    alt="Hero Background"
                    className="h-auto w-full"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-4 px-4 text-center">
                        <h2 className="text-2xl font-bold text-white md:text-4xl">
                            Experience a seamless and rewarding real estate
                            journey.
                        </h2>
                        <p className="text-base text-white md:text-lg">
                            Let us help you find the perfect place to live and
                            thrive.
                        </p>
                        <Link to={'/list'}>
                            <Button
                                className="bg-[#fece51] font-semibold text-black hover:bg-amber-400"
                                size="lg"
                            >
                                View Properties <ArrowRight className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
            {/* Hero Section 3 */}
            <section className="container mx-auto my-36 flex flex-col items-center gap-10 md:flex-row md:items-start">
                {/* Left Content */}
                <div className="space-y-6 pl-12 md:w-2/3">
                    <h2 className="text-3xl leading-snug font-bold text-gray-900 md:text-4xl">
                        We Use Real Estate to Show Our Appreciation of The World
                    </h2>

                    <p className="text-base text-gray-600">
                        Our mission is to connect people with spaces they truly
                        love. Whether you're looking to buy, sell, or invest, we
                        provide expert guidance, market insights, and
                        personalized service every step of the way.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                $18M
                            </p>
                            <p className="text-sm text-gray-600">
                                Owned From Properties Transactions
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                15K+
                            </p>
                            <p className="text-sm text-gray-600">
                                Properties For Sell
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                26K+
                            </p>
                            <p className="text-sm text-gray-600">
                                Properties For Buy
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                890
                            </p>
                            <p className="text-sm text-gray-600">
                                Daily Completed Transactions.
                            </p>
                        </div>
                    </div>

                    {/* Button */}
                    <Button
                        className="bg-[#fece51] font-semibold text-black hover:bg-amber-400"
                        size="lg"
                    >
                        Learn more <ArrowRight className="ml-2" />
                    </Button>
                </div>

                {/* Right Image */}
                <div className="md:w-1/3">
                    <img src="/hero-section3.png" alt="Modern House" />
                </div>
            </section>
            {/* Footer Section */}
            <Footer />
        </>
    );
};
