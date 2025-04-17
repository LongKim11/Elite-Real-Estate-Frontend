import React from 'react';
import { HomeSearchBar } from '@/components/HomeSearchBar';

export const HomePage = () => {
    return (
        <div
            className="relative h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-section2.png')" }}
        >
            <div className="flex items-center justify-center px-6 text-white">
                <div className="max-w-3xl text-center">
                    <h1 className="mt-20 mb-3 text-5xl leading-relaxed font-bold">
                        Unlock Your Dream Home.
                    </h1>
                    <h1 className="mb-8 text-5xl leading-relaxed font-bold">
                        And Start Your Journey Here.
                    </h1>
                    <h1 className="mb-8 text-5xl leading-relaxed font-bold"></h1>
                    <p className="my-8 leading-relaxed">
                        Our team is dedicated to helping you find the perfect
                        place that not only meets your requirements but also
                        complements your lifestyle.
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
    );
};
