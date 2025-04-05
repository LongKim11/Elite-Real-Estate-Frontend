import React from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
    return (
        <div className="flex h-full">
            <div className="mt-25 flex-[3] flex-col items-center justify-center text-center">
                <div className="max-w-md space-y-6">
                    <h1 className="text-primary text-9xl font-extrabold tracking-tight">
                        404
                    </h1>
                    <h2 className="text-4xl font-bold tracking-tight">
                        Page not found
                    </h2>
                    <p className="text-muted-foreground">
                        Sorry, we couldn't find the page you're looking for. It
                        might have been moved or deleted.
                    </p>

                    <Button asChild size="lg">
                        <Link to={'/'} className="gap-2">
                            <Home size={20} />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="relative flex-[2] md:bg-[#fcf5f3]">
                <img src="/home-bg.png"></img>
            </div>
        </div>
    );
};
