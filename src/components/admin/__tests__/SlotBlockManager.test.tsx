import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { SlotBlockManager } from '../SlotBlockManager';
import { generateShowerSlots, generateLaundrySlots, formatSlotLabel } from '@/lib/utils/serviceSlots';

// Mock stores
const mockFetchBlockedSlots = vi.fn(() => Promise.resolve());
const mockBlockSlot = vi.fn(() => Promise.resolve());
const mockUnblockSlot = vi.fn(() => Promise.resolve());
const mockIsSlotBlocked = vi.fn((..._args: unknown[]) => false);

vi.mock('@/stores/useBlockedSlotsStore', () => ({
    useBlockedSlotsStore: vi.fn(() => ({
        fetchBlockedSlots: mockFetchBlockedSlots,
        blockSlot: mockBlockSlot,
        unblockSlot: mockUnblockSlot,
        isSlotBlocked: mockIsSlotBlocked,
    })),
}));

vi.mock('@/stores/useServicesStore', () => ({
    useServicesStore: vi.fn(() => ({
        showerRecords: [],
        laundryRecords: [],
    })),
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

/** Render and flush the loading promise so slots appear */
async function renderLoaded(ui: React.ReactElement) {
    await act(async () => {
        render(ui);
    });
}

describe('SlotBlockManager — day-aware slot generation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders correct weekday shower slots when today is a weekday', async () => {
        vi.setSystemTime(new Date(2025, 0, 6, 9, 0));
        await renderLoaded(<SlotBlockManager serviceType="shower" />);

        expect(screen.getByText(formatSlotLabel('07:30'))).toBeDefined();
    });

    it('renders correct Saturday shower slots after navigating to Saturday', async () => {
        // Start on Friday
        vi.setSystemTime(new Date(2025, 0, 3, 9, 0));
        await renderLoaded(<SlotBlockManager serviceType="shower" />);

        // Navigate forward one day to Saturday
        const nextButton = screen.getAllByRole('button').find(b =>
            b.querySelector('svg') && b.className.includes('border-l')
        );
        fireEvent.click(nextButton!);

        // Saturday shower slots start at 08:30
        const saturdaySlots = generateShowerSlots(new Date(2025, 0, 4));
        expect(screen.getByText(formatSlotLabel(saturdaySlots[0]))).toBeDefined();
        expect(screen.getByText(formatSlotLabel('08:30'))).toBeDefined();
    });

    it('renders correct weekday laundry slots', async () => {
        vi.setSystemTime(new Date(2025, 0, 8, 9, 0));
        await renderLoaded(<SlotBlockManager serviceType="laundry" />);

        const weekdaySlots = generateLaundrySlots(new Date(2025, 0, 8));
        expect(weekdaySlots.length).toBe(5);
        expect(screen.getByText(formatSlotLabel(weekdaySlots[0]))).toBeDefined();
    });

    it('renders correct Saturday laundry slots after navigating to Saturday', async () => {
        vi.setSystemTime(new Date(2025, 0, 3, 9, 0));
        await renderLoaded(<SlotBlockManager serviceType="laundry" />);

        // Navigate forward one day to Saturday
        const nextButton = screen.getAllByRole('button').find(b =>
            b.querySelector('svg') && b.className.includes('border-l')
        );
        fireEvent.click(nextButton!);

        const saturdaySlots = generateLaundrySlots(new Date(2025, 0, 4));
        expect(screen.getByText(formatSlotLabel(saturdaySlots[0]))).toBeDefined();
    });

    it('Saturday shower slots differ from weekday shower slots', () => {
        const weekdaySlots = generateShowerSlots(new Date(2025, 0, 6)); // Monday
        const saturdaySlots = generateShowerSlots(new Date(2025, 0, 4)); // Saturday

        expect(weekdaySlots[0]).not.toBe(saturdaySlots[0]);
        expect(weekdaySlots[0]).toBe('07:30');
        expect(saturdaySlots[0]).toBe('08:30');
    });

    it('Saturday laundry slots differ from weekday laundry slots', () => {
        const weekdaySlots = generateLaundrySlots(new Date(2025, 0, 6)); // Monday
        const saturdaySlots = generateLaundrySlots(new Date(2025, 0, 4)); // Saturday

        expect(weekdaySlots[0]).not.toBe(saturdaySlots[0]);
    });

    it('shows correct header for shower service', async () => {
        vi.setSystemTime(new Date(2025, 0, 6, 9, 0));
        await renderLoaded(<SlotBlockManager serviceType="shower" />);
        expect(screen.getByText('Manage Shower Slots')).toBeDefined();
    });

    it('shows correct header for laundry service', async () => {
        vi.setSystemTime(new Date(2025, 0, 6, 9, 0));
        await renderLoaded(<SlotBlockManager serviceType="laundry" />);
        expect(screen.getByText('Manage Laundry Slots')).toBeDefined();
    });

    it('renders all slot buttons with Open status by default', async () => {
        vi.setSystemTime(new Date(2025, 0, 6, 9, 0));
        await renderLoaded(<SlotBlockManager serviceType="shower" />);

        const weekdaySlots = generateShowerSlots(new Date(2025, 0, 6));
        const openBadges = screen.getAllByText('Open');
        expect(openBadges.length).toBe(weekdaySlots.length);
    });

    it('shows Blocked status for blocked slots', async () => {
        vi.setSystemTime(new Date(2025, 0, 6, 9, 0));
        mockIsSlotBlocked.mockImplementation((...args: unknown[]) => (args[1] as string) === '08:00');

        await renderLoaded(<SlotBlockManager serviceType="shower" />);

        // Legend always shows "Blocked", so at least 2 elements expected when a slot is blocked
        const blockedElements = screen.getAllByText('Blocked');
        expect(blockedElements.length).toBeGreaterThanOrEqual(2);
    });

    it('displays date navigation correctly', async () => {
        vi.setSystemTime(new Date(2025, 0, 6, 9, 0));
        await renderLoaded(<SlotBlockManager serviceType="shower" />);

        expect(screen.getByText(/Monday/i)).toBeDefined();
        expect(screen.getByText(/January/i)).toBeDefined();
    });
});
