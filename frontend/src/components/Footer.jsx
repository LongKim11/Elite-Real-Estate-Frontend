import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Github,
    Mail,
    MapPin,
    Phone
} from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="border-t border-gray-800 bg-black text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">Elite Estate</h3>

                        <p className="text-sm text-gray-300">
                            We're dedicated to providing the best experience for
                            our customers with innovative solutions and
                            exceptional service.
                        </p>
                        <div className="flex space-x-4">
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-white"
                            >
                                <Facebook size={20} />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-white"
                            >
                                <Twitter size={20} />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-white"
                            >
                                <Instagram size={20} />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-white"
                            >
                                <Youtube size={20} />
                                <span className="sr-only">YouTube</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-white"
                            >
                                <Github size={20} />
                                <span className="sr-only">GitHub</span>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-300 hover:text-white"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-300 hover:text-white"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-300 hover:text-white"
                                >
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-300 hover:text-white"
                                >
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-300 hover:text-white"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-300 hover:text-white"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin
                                    size={18}
                                    className="mt-0.5 mr-2 text-gray-400"
                                />
                                <span className="text-sm text-gray-300">
                                    123 Business Street, Suite 100, San
                                    Francisco, CA 94103
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone
                                    size={18}
                                    className="mr-2 text-gray-400"
                                />
                                <span className="text-sm text-gray-300">
                                    +1 (555) 123-4567
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Mail
                                    size={18}
                                    className="mr-2 text-gray-400"
                                />
                                <span className="text-sm text-gray-300">
                                    info@elite-estate.com
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">
                            Subscribe to Our Newsletter
                        </h3>
                        <p className="text-sm text-gray-300">
                            Stay updated with our latest news and offers.
                        </p>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Input
                                type="email"
                                placeholder="Your email address"
                                className="rounded-md border-gray-700 bg-gray-800"
                            />
                            <Button type="submit" className="whitespace-nowrap">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 border-t border-gray-800 pt-6">
                    <div className="flex flex-col items-center justify-between md:flex-row">
                        <p className="text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} Company Name. All
                            rights reserved.
                        </p>
                        <div className="mt-4 flex space-x-6 md:mt-0">
                            <Link
                                href="#"
                                className="text-sm text-gray-400 hover:text-white"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="#"
                                className="text-sm text-gray-400 hover:text-white"
                            >
                                Terms of Service
                            </Link>
                            <Link
                                href="#"
                                className="text-sm text-gray-400 hover:text-white"
                            >
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
