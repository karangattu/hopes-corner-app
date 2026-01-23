import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import ProtectedLayout from '../(protected)/layout';
import BaseLayout from '../layout';

// Mock next/font/google
vi.mock('next/font/google', () => ({
    Inter: () => ({ variable: 'inter' }),
    Outfit: () => ({ variable: 'outfit' }),
}));

// Mock next/navigation
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn(), replace: mockReplace }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
}));

// Mock NextAuth
const mockUseSession = vi.fn();
vi.mock('next-auth/react', () => ({
    useSession: () => mockUseSession(),
    signOut: vi.fn(),
}));

vi.mock('@/components/providers/NextAuthProvider', () => ({
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock components used in layouts
vi.mock('@/components/layouts/MainLayout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('Layout Smoke Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('BaseLayout renders children correctly', () => {
        render(
            <BaseLayout>
                <div data-testid="child">Content</div>
            </BaseLayout>
        );
        expect(screen.getByTestId('child')).toBeDefined();
    });

    it('Protected layout renders with authenticated session', async () => {
        // Mock authenticated session
        mockUseSession.mockReturnValue({
            data: { user: { role: 'admin', name: 'Admin', email: 'admin@test.com' } },
            status: 'authenticated'
        });

        render(
            <ProtectedLayout>
                <div data-testid="protected-content">Protected</div>
            </ProtectedLayout>
        );

        await waitFor(() => {
            expect(screen.getByTestId('main-layout')).toBeDefined();
            expect(screen.getByTestId('protected-content')).toBeDefined();
        });
    });

    it('Protected layout shows loading state', () => {
        // Mock loading session
        mockUseSession.mockReturnValue({
            data: null,
            status: 'loading'
        });

        render(
            <ProtectedLayout>
                <div data-testid="protected-content">Protected</div>
            </ProtectedLayout>
        );

        expect(screen.getByText('Loading...')).toBeDefined();
    });

    it('Protected layout redirects when not authenticated', () => {
        // Mock unauthenticated session
        mockUseSession.mockReturnValue({
            data: null,
            status: 'unauthenticated'
        });

        render(
            <ProtectedLayout>
                <div data-testid="protected-content">Protected</div>
            </ProtectedLayout>
        );

        // Should call router.replace to redirect to login
        expect(mockReplace).toHaveBeenCalledWith('/login');
    });
});
