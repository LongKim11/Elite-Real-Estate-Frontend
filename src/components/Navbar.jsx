import React from 'react';

export const Navbar = () => {
    return (
        <nav className="flex h-[100px] items-center justify-between">
            <div className="flex flex-[3] items-center gap-16">
                <a
                    href="/"
                    className="flex items-center gap-2.5 text-2xl font-bold"
                >
                    <img src="/logo.png" className="w-22"></img>
                    <span>Elite Estate</span>
                </a>
                <a
                    href="/"
                    className="font-semibold transition duration-200 hover:text-yellow-500"
                >
                    Home
                </a>
                <a
                    href="/"
                    className="font-semibold transition duration-200 hover:text-yellow-500"
                >
                    About
                </a>
                <a
                    href="/"
                    className="font-semibold transition duration-200 hover:text-yellow-500"
                >
                    Contact
                </a>
                <a
                    href="/"
                    className="font-semibold transition duration-200 hover:text-yellow-500"
                >
                    Agents
                </a>
            </div>
            <div className="flex h-full flex-[2] items-center justify-end bg-[#fcf5f3]">
                <a
                    href="/"
                    className="m-5 px-6 py-3 font-semibold transition-all duration-200 hover:scale-105"
                >
                    Sign In
                </a>
                <a
                    href="/"
                    className="m-5 rounded bg-[#fece51] px-6 py-3 font-semibold transition-all duration-200 hover:scale-105"
                >
                    Sign Up
                </a>
            </div>
        </nav>
    );
};
