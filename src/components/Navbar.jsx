import React, { useState } from 'react';

export const Navbar = () => {
    const [open, setOpen] = useState(false);

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
                    className="hidden font-semibold transition duration-200 hover:text-yellow-500 md:flex"
                >
                    Home
                </a>
                <a
                    href="/"
                    className="hidden font-semibold transition duration-200 hover:text-yellow-500 md:flex"
                >
                    About
                </a>
                <a
                    href="/"
                    className="hidden font-semibold transition duration-200 hover:text-yellow-500 md:flex"
                >
                    Contact
                </a>
                <a
                    href="/list"
                    className="hidden font-semibold transition duration-200 hover:text-yellow-500 md:flex"
                >
                    Property
                </a>
            </div>
            <div className="flex h-full flex-[2] items-center justify-end bg-transparent md:bg-[#fcf5f3]">
                <a
                    href="/"
                    className="m-5 hidden px-6 py-3 font-semibold transition-all duration-200 hover:scale-105 md:flex"
                >
                    Sign In
                </a>
                <a
                    href="/"
                    className="m-5 hidden rounded bg-[#fece51] px-6 py-3 font-semibold transition-all duration-200 hover:scale-105 md:flex"
                >
                    Sign Up
                </a>
                <div className="flex md:hidden">
                    <img
                        src="/menu.png"
                        className="z-50 h-9 w-9 cursor-pointer"
                        onClick={() => {
                            setOpen((prev) => !prev);
                        }}
                    ></img>
                </div>
                <div
                    className={`absolute top-0 flex h-screen w-1/3 flex-col items-center justify-center gap-10 bg-black text-2xl text-white transition-all duration-500 ease-in-out md:hidden ${
                        open ? 'right-0' : '-right-full'
                    }`}
                >
                    <a href="/">Home</a>
                    <a href="/">About</a>
                    <a href="/">Contact</a>
                    <a href="/list">Property</a>
                    <a href="/">Sign In</a>
                    <a href="/">Sign Up</a>
                </div>
            </div>
        </nav>
    );
};
