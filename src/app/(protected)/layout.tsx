'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (!session) {
            router.replace('/login');
        } else {
            setIsChecking(false);
        }
    }, [session, status, router]);

    // Show loading state while checking auth
    if (status === 'loading' || isChecking) {
        return (
            <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render children if not authenticated
    if (!session) {
        return null;
    }

    return <MainLayout>{children}</MainLayout>;
}
