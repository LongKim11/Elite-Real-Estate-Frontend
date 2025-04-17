import React from 'react';
import { HomeSearchBar } from '@/components/HomeSearchBar';

export const HomePage = () => {
    return (
        <div className="flex h-full">
            <div className="flex-[3]">
                <div className="mr-12">
                    <h1 className="mt-20 text-5xl leading-relaxed font-bold">
                        Unlock Your Dream Home & Start Your Journey Here
                    </h1>
                    <p className="my-8 text-justify leading-relaxed">
                        Whether you're searching for a cozy apartment, a family
                        home, or an investment property, we provide a wide range
                        of options to suit every need. Our team is dedicated to
                        helping you find the perfect place that not only meets
                        your requirements but also complements your lifestyle.
                        Let us guide you on this exciting journey to discovering
                        your dream home.
                    </p>
                    <HomeSearchBar />
                    <div className="mt-8 flex justify-between">
                        <div>
                            <h1 className="text-4xl font-bold">11+</h1>
                            <p className="text-lg">Years Of Experience</p>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">300</h1>
                            <p className="text-lg">Award Gained</p>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">1130+</h1>
                            <p className="text-lg">Property Ready</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative flex-[2] md:bg-[#fcf5f3]">
                <img src="/home-bg.png"></img>
            </div>
        </div>
    );
};
