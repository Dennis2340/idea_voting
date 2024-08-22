"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

const Page = () => {
    const router = useRouter();
    const [error, setError] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const origin = searchParams.get('origin');

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const response = await fetch('/api/authCallback');
                const data = await response.json();

                if (data.success) {
                    router.push(origin ? `/${origin}` : "/dashboard");
                } else {
                    setError(true);
                }
            } catch (error) {
                setError(true);
            }
        };

        authenticateUser();
    }, [origin, router]);

    return (
        <div className='w-full mt-24 justify-center'>
            <div className="flex flex-col items-center gap-2">
                {error ? null : <Loader2 className='h-8 animate-spin text-zinc-800' />}
                <h3 className='font-semibold text-2xl text-center'>
                    {error ? "Session Expired" : "Setting up your Account..."}
                </h3>
                <p className='text-gray-600 text-center'>
                    {error ? "Your session has ended. Please sign in again." : "You will be redirected automatically."}
                </p>
                {error ? (
                    <Link href="/sign-in" className={buttonVariants({ size: "lg" })}>
                        Sign in <ArrowRight className=' ml-2 h-4 w-4' />
                    </Link>
                ) : null}
            </div>
        </div>
    );
};

export default Page;
