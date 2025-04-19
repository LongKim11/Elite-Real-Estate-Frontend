import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
    const [open, setOpen] = useState(false);

    const user = true;

    return (
        <nav className="flex h-[100px] items-center justify-between px-8">
            <div className="flex flex-[3] items-center gap-16">
                <Link
                    to={'/'}
                    className="flex items-center gap-2.5 text-2xl font-bold"
                >
                    <img src="/logo.png" className="w-22"></img>
                    <span>Elite Estate</span>
                </Link>
                <Link
                    to={'/'}
                    className="hidden font-semibold transition duration-200 hover:text-yellow-500 md:flex"
                >
                    Home
                </Link>
                <Link
                    to={'/about'}
                    className="hidden font-semibold transition duration-200 hover:text-yellow-500 md:flex"
                >
                    About
                </Link>
                <Link
                    to={'/contact'}
                    className="hidden font-semibold transition duration-200 hover:text-yellow-500 md:flex"
                >
                    Contact
                </Link>
                <Link
                    to="/list"
                    className="hidden font-semibold transition duration-200 hover:text-yellow-500 md:flex"
                >
                    Property
                </Link>
            </div>
            <div className="flex h-full flex-[2] items-center justify-end bg-transparent">
                {user ? (
                    <div className="flex items-center font-bold">
                        <img
                            src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            className="mr-3 h-[40px] w-[40px] rounded-full object-cover"
                        ></img>
                        <span>John Doe</span>
                        <Link
                            to={'/profile'}
                            className="mx-5 bg-[#fece51] px-6 py-3 transition-all duration-200 hover:scale-105"
                        >
                            Profile
                        </Link>
                    </div>
                ) : (
                    <>
                        {' '}
                        <Link
                            to={'/sign-in'}
                            className="m-5 hidden px-6 py-3 font-semibold transition-all duration-200 hover:scale-105 md:flex"
                        >
                            Sign In
                        </Link>
                        <Link
                            to={'/sign-up'}
                            className="m-5 hidden rounded bg-[#fece51] px-6 py-3 font-semibold transition-all duration-200 hover:scale-105 md:flex"
                        >
                            Sign Up
                        </Link>
                    </>
                )}

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
                    <Link to={'/'}>Home</Link>
                    <Link to={'/about'}>About</Link>
                    <Link to={'/contact'}>Contact</Link>
                    <Link to={'/list'}>Property</Link>
                    <Link to={'/sign-in'}>Sign In</Link>
                    <Link to={'/sign-up'}>Sign Up</Link>
                </div>
            </div>
        </nav>
    );
};
