import React from 'react';
import { CircleDot, Briefcase, Award, PhoneCall } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export const AgentContact = () => {
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Phone number copied successfully!');
        });
    };

    return (
        <div className="mb-4 overflow-hidden rounded-lg border border-teal-100 bg-gradient-to-br from-white to-teal-50/30 shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">
                    Posted by Agent
                </h3>
            </div>
            <div className="p-4">
                <div className="flex items-center gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-200">
                        <img
                            src="/estate-agent.jpg"
                            alt="User Avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                            Nguyen Van A
                        </h4>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            {/* Active Status Badge */}
                            <Badge className="flex items-center gap-1.5 border-green-300 bg-gradient-to-r from-green-50 to-green-100 text-green-800 hover:from-green-100 hover:to-green-200">
                                <CircleDot className="h-3 w-3 text-green-500" />
                                Active Now
                            </Badge>

                            {/* Professional Badge */}
                            <Badge className="flex items-center gap-1.5 border-indigo-200 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 hover:from-indigo-100 hover:to-indigo-200">
                                <Briefcase className="h-3 w-3 text-indigo-600" />
                                Professional Estate Agent
                            </Badge>

                            {/* Licensed Badge */}
                            <Badge className="flex items-center gap-1.5 border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 hover:from-amber-100 hover:to-amber-200">
                                <Award className="h-3 w-3 text-amber-600" />
                                Licensed
                            </Badge>
                        </div>

                        <p className="mt-2.5 text-xs text-gray-600">
                            <span className="font-medium text-gray-700">
                                5+ years
                            </span>{' '}
                            experience in real estate consulting
                        </p>
                    </div>
                </div>

                {/* Contact Buttons */}
                <div className="mt-6 flex flex-col gap-4">
                    {/* Zalo Button */}
                    <a href="https://zalo.me/0915307659" className="w-full">
                        <Button className="text-back flex w-full items-center justify-center gap-2 border border-blue-300 bg-white hover:bg-blue-50">
                            <img
                                src="/zalo.png"
                                alt="Zalo"
                                className="h-5 w-5"
                            />
                            Contact on Zalo
                        </Button>
                    </a>

                    {/* Phone Call Button */}
                    <Button
                        className="flex items-center justify-center gap-2 bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-teal-700"
                        onClick={() => handleCopy('09135037659')}
                    >
                        <PhoneCall className="h-5 w-5" />
                        0915 307 659
                        <span className="text-xs text-teal-200">(Copy)</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
