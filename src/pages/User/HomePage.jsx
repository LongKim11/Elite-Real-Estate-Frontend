import React from 'react';
import { HomeSearchBar } from '@/components/HomeSearchBar';
import { Home, Shield, FileText, Bed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';

export const HomePage = () => {
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
            {/* Category Section with Modern Card Design */}
            <section className="my-24 bg-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="mb-2 text-3xl font-bold">
                        Feature Categories
                    </h2>
                    <p className="mb-12 text-gray-500">
                        Easily browse and discover the diverse types of real
                        estate we offer.
                    </p>

                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Apartment Category Card */}
                        <div className="group relative overflow-hidden rounded-xl shadow-lg">
                            {/* Image with Overlay */}
                            <div
                                className="h-[450px] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{
                                    backgroundImage: "url('apartment.jpg')"
                                }}
                            >
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70 opacity-80"></div>
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 w-full p-8 text-center">
                                <div className="mb-3 inline-flex rounded-full bg-white/20 px-4 py-1 backdrop-blur-sm">
                                    <span className="text-sm font-medium tracking-wider text-white">
                                        RESIDENTIAL
                                    </span>
                                </div>
                                <h3 className="mb-2 text-2xl font-bold text-white">
                                    Apartments
                                </h3>
                                <p className="text-lg font-medium text-white/90">
                                    11+ Properties Available
                                </p>

                                {/* Button that appears on hover */}
                                <div className="mt-4 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                    <button className="rounded-full bg-white px-6 py-2 font-semibold text-gray-900 transition-colors hover:bg-amber-400">
                                        Explore
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* House Category Card */}
                        <div className="group relative overflow-hidden rounded-xl shadow-lg">
                            {/* Image with Overlay */}
                            <div
                                className="h-[450px] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: "url('house.jpg')" }}
                            >
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70 opacity-80"></div>
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 w-full p-8 text-center">
                                <div className="mb-3 inline-flex rounded-full bg-white/20 px-4 py-1 backdrop-blur-sm">
                                    <span className="text-sm font-medium tracking-wider text-white">
                                        RESIDENTIAL
                                    </span>
                                </div>
                                <h3 className="mb-2 text-2xl font-bold text-white">
                                    Houses
                                </h3>
                                <p className="text-lg font-medium text-white/90">
                                    35+ Properties Available
                                </p>

                                {/* Button that appears on hover */}
                                <div className="mt-4 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                    <button className="rounded-full bg-white px-6 py-2 font-semibold text-gray-900 transition-colors hover:bg-amber-400">
                                        Explore
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Land Category Card */}
                        <div className="group relative overflow-hidden rounded-xl shadow-lg">
                            {/* Image with Overlay */}
                            <div
                                className="h-[450px] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: "url('land.jpg')" }}
                            >
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70 opacity-80"></div>
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 w-full p-8 text-center">
                                <div className="mb-3 inline-flex rounded-full bg-white/20 px-4 py-1 backdrop-blur-sm">
                                    <span className="text-sm font-medium tracking-wider text-white">
                                        INVESTMENT
                                    </span>
                                </div>
                                <h3 className="mb-2 text-2xl font-bold text-white">
                                    Land
                                </h3>
                                <p className="text-lg font-medium text-white/90">
                                    23+ Properties Available
                                </p>

                                {/* Button that appears on hover */}
                                <div className="mt-4 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                    <button className="rounded-full bg-white px-6 py-2 font-semibold text-gray-900 transition-colors hover:bg-amber-400">
                                        Explore
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="mt-30 bg-white text-center">
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

            {/* Featured Properties Section */}
            <section className="mt-30 bg-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="mb-2 text-3xl font-bold">
                        Discover Our Best Deals
                    </h2>
                    <p className="mb-12 text-gray-500">
                        Connecting you with exceptional homes and investment
                        opportunities.
                    </p>

                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Featured Property 1 */}
                        <div className="group overflow-hidden rounded-xl border border-gray-200 shadow-md transition-all duration-300 hover:shadow-xl">
                            <div className="relative">
                                {/* Featured Badge */}
                                <div className="absolute top-4 left-4 z-10 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white uppercase shadow-md">
                                    Featured
                                </div>

                                {/* Property Image */}
                                <div className="relative h-[250px] overflow-hidden">
                                    <img
                                        src="featured1.jpg"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        alt="Luxury Apartment"
                                    />
                                    {/* Price Tag */}
                                    <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-4 py-2 font-bold text-amber-600 shadow-md backdrop-blur-sm">
                                        $450,000
                                    </div>
                                </div>
                            </div>

                            {/* Property Details */}
                            <div className="p-5 text-left">
                                <h3 className="mb-2 text-xl font-bold text-gray-800">
                                    Luxury Downtown Apartment
                                </h3>

                                {/* Location */}
                                <div className="mb-3 flex items-center text-gray-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-2 h-5 w-5 text-amber-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <span className="text-sm">
                                        Central District, New York
                                    </span>
                                </div>

                                {/* Property Features */}
                                <div className="mb-4 flex justify-between border-b border-gray-100 pb-3">
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-4 w-4 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            3 Beds
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-4 w-4 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            2 Baths
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-4 w-4 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            1250 sq ft
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full rounded-lg bg-amber-500 py-2 font-semibold text-white transition-colors hover:bg-amber-600">
                                    View Details
                                </button>
                            </div>
                        </div>

                        {/* Featured Property 2 */}
                        <div className="group overflow-hidden rounded-xl border border-gray-200 shadow-md transition-all duration-300 hover:shadow-xl">
                            <div className="relative">
                                {/* Featured Badge */}
                                <div className="absolute top-4 left-4 z-10 rounded-full bg-blue-500 px-3 py-1.5 text-xs font-bold text-white uppercase shadow-md">
                                    Best Value
                                </div>

                                {/* Property Image */}
                                <div className="relative h-[250px] overflow-hidden">
                                    <img
                                        src="featured2.jpg"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        alt="Modern House"
                                    />
                                    {/* Price Tag */}
                                    <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-4 py-2 font-bold text-blue-600 shadow-md backdrop-blur-sm">
                                        $825,000
                                    </div>
                                </div>
                            </div>

                            {/* Property Details */}
                            <div className="p-5 text-left">
                                <h3 className="mb-2 text-xl font-bold text-gray-800">
                                    Family House with Garden
                                </h3>

                                {/* Location */}
                                <div className="mb-3 flex items-center text-gray-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-2 h-5 w-5 text-blue-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <span className="text-sm">
                                        Westside, Chicago
                                    </span>
                                </div>

                                {/* Property Features */}
                                <div className="mb-4 flex justify-between border-b border-gray-100 pb-3">
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-4 w-4 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            4 Beds
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-4 w-4 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            3 Baths
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-4 w-4 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            2100 sq ft
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full rounded-lg bg-blue-500 py-2 font-semibold text-white transition-colors hover:bg-blue-600">
                                    View Details
                                </button>
                            </div>
                        </div>

                        {/* Featured Property 3 */}
                        <div className="group overflow-hidden rounded-xl border border-gray-200 shadow-md transition-all duration-300 hover:shadow-xl">
                            <div className="relative">
                                {/* Featured Badge */}
                                <div className="absolute top-4 left-4 z-10 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white uppercase shadow-md">
                                    New
                                </div>

                                {/* Property Image */}
                                <div className="relative h-[250px] overflow-hidden">
                                    <img
                                        src="featured3.jpg"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        alt="Development Land"
                                    />
                                    {/* Price Tag */}
                                    <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-4 py-2 font-bold text-green-600 shadow-md backdrop-blur-sm">
                                        $350,000
                                    </div>
                                </div>
                            </div>

                            {/* Property Details */}
                            <div className="p-5 text-left">
                                <h3 className="mb-2 text-xl font-bold text-gray-800">
                                    Development Land Opportunity
                                </h3>

                                {/* Location */}
                                <div className="mb-3 flex items-center text-gray-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-2 h-5 w-5 text-green-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <span className="text-sm">
                                        Lakeside, Austin
                                    </span>
                                </div>

                                {/* Property Features */}
                                <div className="mb-4 flex justify-between border-b border-gray-100 pb-3">
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-4 w-4 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            Residential
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-4 w-4 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            5 Acres
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-4 w-4 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            Approved
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full rounded-lg bg-green-500 py-2 font-semibold text-white transition-colors hover:bg-green-600">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hero Section 2 */}
            <section className="relative mt-30">
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
            <section className="my-24 flex flex-col items-center gap-10 px-10 md:flex-row md:items-start">
                {/* Left Content */}
                <div className="space-y-6 pl-12 md:w-2/3">
                    <h2 className="text-3xl leading-snug font-bold text-gray-900">
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
