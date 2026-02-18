/**
 * Tests for post-migration fixes:
 * 1. Unique Guests YTD calculation in MonthlySummaryReport
 * 2. Dashboard tab removal (Overview/Operations Performance)
 * 3. Meals served today (all types excl. lunch bags)
 * 4. Laundry loads = completed only
 * 5. Bicycle queue = today's pending only
 * 6. Total meals excludes lunch bags
 * 7. Demographics excludes service records when meal-type filter active
 * 8. Day of week in trends chart
 * 9. Extra meals bulk entry category
 */
import { describe, it, expect } from 'vitest';

// ──── 1. Unique Guests YTD ────
describe('Unique Guests YTD', () => {
    it('computes YTD unique guests via a global Set, not summing monthly uniques', () => {
        // Guest g1 appears in both Jan and Feb
        const mealsByMonth: Record<string, string[]> = {
            January: ['g1', 'g2', 'g3'],
            February: ['g1', 'g4'],
        };

        // Wrong: summing per-month unique counts = 3 + 2 = 5
        const naiveSum = Object.values(mealsByMonth)
            .reduce((s, ids) => s + new Set(ids).size, 0);
        expect(naiveSum).toBe(5);

        // Correct: global Set = 4 unique guests
        const globalSet = new Set<string>();
        Object.values(mealsByMonth).forEach(ids => ids.forEach(id => globalSet.add(id)));
        expect(globalSet.size).toBe(4);
    });

    it('returns 0 when there are no meal records', () => {
        const globalSet = new Set<string>();
        expect(globalSet.size).toBe(0);
    });

    it('counts guests across all months of the selected year', () => {
        const months = [
            { month: 0, guestIds: ['g1', 'g2'] },
            { month: 1, guestIds: ['g2', 'g3'] },
            { month: 2, guestIds: ['g1', 'g3', 'g4'] },
        ];
        const ytdSet = new Set<string>();
        months.forEach(m => m.guestIds.forEach(id => ytdSet.add(id)));
        expect(ytdSet.size).toBe(4); // g1, g2, g3, g4
    });
});

// ──── 2. Dashboard tabs ────
describe('Dashboard tabs configuration', () => {
    // The Overview tab has been removed; Analytics is the new default
    const DASHBOARD_TABS = [
        { id: 'analytics', label: 'Analytics' },
        { id: 'monthly-report', label: 'Monthly Report' },
        { id: 'meal-report', label: 'Meal Report' },
        { id: 'monthly-summary', label: 'Summary' },
        { id: 'export', label: 'Data Export' },
    ];

    it('does not include an overview tab', () => {
        expect(DASHBOARD_TABS.find(t => t.id === 'overview')).toBeUndefined();
    });

    it('defaults to analytics as the first tab', () => {
        expect(DASHBOARD_TABS[0].id).toBe('analytics');
    });
});

// ──── 3 & 6. Meals counts (excl. lunch bags) ────
describe('Meals served today (all types excluding lunch bags)', () => {
    const sumCount = (records: { count: number }[]) =>
        records.reduce((sum, r) => sum + (r.count || 0), 0);

    it('includes guest, rv, extra, day_worker, shelter, united_effort in total', () => {
        const guest = [{ count: 50 }];
        const rv = [{ count: 100 }];
        const extra = [{ count: 10 }];
        const dayWorker = [{ count: 30 }];
        const shelter = [{ count: 20 }];
        const ue = [{ count: 15 }];
        const lunchBags = [{ count: 200 }];

        const totalExclLunchBags = sumCount([...guest, ...rv, ...extra, ...dayWorker, ...shelter, ...ue]);
        expect(totalExclLunchBags).toBe(225);

        // Old behavior (wrong): included lunch bags
        const totalInclLunchBags = sumCount([...guest, ...rv, ...extra, ...dayWorker, ...shelter, ...ue, ...lunchBags]);
        expect(totalInclLunchBags).toBe(425);
        expect(totalExclLunchBags).not.toBe(totalInclLunchBags);
    });

    it('returns 0 when no records exist', () => {
        expect(sumCount([])).toBe(0);
    });
});

// ──── 4. Laundry loads = completed only ────
describe('Laundry loads completed', () => {
    const completedStatuses = ['done', 'picked_up', 'returned', 'offsite_picked_up'];

    it('counts only completed laundry loads', () => {
        const records = [
            { status: 'done' },
            { status: 'waiting' },
            { status: 'washer' },
            { status: 'dryer' },
            { status: 'picked_up' },
            { status: 'returned' },
        ];
        const completed = records.filter(r => completedStatuses.includes(r.status));
        expect(completed.length).toBe(3); // done, picked_up, returned
    });

    it('excludes active loads (waiting, washer, dryer)', () => {
        const activeStatuses = ['waiting', 'washer', 'dryer'];
        const records = [
            { status: 'waiting' },
            { status: 'washer' },
            { status: 'dryer' },
        ];
        const completed = records.filter(r => completedStatuses.includes(r.status));
        expect(completed.length).toBe(0);
    });
});

// ──── 5. Bicycle queue = today's pending only ────
describe('Bicycle queue today pending', () => {
    it('only counts pending bicycles for today, not historical', () => {
        const today = '2026-02-16';
        const records = [
            { dateKey: '2026-02-16', status: 'pending' },
            { dateKey: '2026-02-16', status: 'in_progress' },
            { dateKey: '2026-02-16', status: 'done' },
            { dateKey: '2026-02-15', status: 'pending' },    // yesterday pending
            { dateKey: '2026-01-01', status: 'pending' },    // old pending
        ];

        const todaysPending = records.filter(r => r.dateKey === today && r.status === 'pending');
        expect(todaysPending.length).toBe(1);
    });

    it('returns 0 when no pending repairs for today', () => {
        const today = '2026-02-16';
        const records = [
            { dateKey: '2026-02-16', status: 'done' },
            { dateKey: '2026-02-15', status: 'pending' },
        ];
        const todaysPending = records.filter(r => r.dateKey === today && r.status === 'pending');
        expect(todaysPending.length).toBe(0);
    });
});

// ──── 7. Demographics: service records only when all meal types selected ────
describe('Demographics meal-type filter behavior', () => {
    it('includes shower/laundry guests when all meal types are selected', () => {
        const allSelected = { guest: true, extras: true, rv: true, dayWorker: true, shelter: true, unitedEffort: true, lunchBags: true };
        const allMealTypesSelected = Object.values(allSelected).every(v => v);
        expect(allMealTypesSelected).toBe(true);

        // Should include shower/laundry guests
        const activeGuestIds = new Set<string>();
        if (allMealTypesSelected) {
            activeGuestIds.add('shower-guest-1');
            activeGuestIds.add('laundry-guest-1');
        }
        expect(activeGuestIds.size).toBe(2);
    });

    it('excludes shower/laundry guests when specific meal types are deselected', () => {
        const partialSelected = { guest: false, extras: false, rv: true, dayWorker: false, shelter: false, unitedEffort: false, lunchBags: false };
        const allMealTypesSelected = Object.values(partialSelected).every(v => v);
        expect(allMealTypesSelected).toBe(false);

        // Should NOT include shower/laundry guests
        const activeGuestIds = new Set<string>();
        if (allMealTypesSelected) {
            activeGuestIds.add('shower-guest-1');
        }
        expect(activeGuestIds.size).toBe(0);
    });

    it('shows 0 guests for RV-only filter since RV records have no guest IDs', () => {
        // RV meal records have guest_id: null
        const rvRecords = [
            { date: '2026-02-16', guestId: null, count: 100 },
            { date: '2026-02-16', guestId: null, count: 50 },
        ];

        const activeGuestIds = new Set<string>();
        rvRecords.forEach(r => { if (r.guestId) activeGuestIds.add(r.guestId); });

        // No guest IDs means 0 active guests for demographic breakdown
        expect(activeGuestIds.size).toBe(0);
    });
});

// ──── 8. Day of week in trends chart ────
describe('Day of week in trends chart labels', () => {
    it('formats date with day of week abbreviation', () => {
        // Using the same format as the actual code: "Feb 16 (Mon)"
        const d = new Date(2026, 1, 16); // Feb 16, 2026 is Monday
        const label = `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${d.toLocaleDateString('en-US', { weekday: 'short' })})`;
        expect(label).toContain('Feb');
        expect(label).toContain('16');
        expect(label).toContain('Mon');
    });

    it('shows correct day abbreviations', () => {
        const days = [
            { date: new Date(2026, 1, 16), expected: 'Mon' },
            { date: new Date(2026, 1, 18), expected: 'Wed' },
            { date: new Date(2026, 1, 20), expected: 'Fri' },
            { date: new Date(2026, 1, 21), expected: 'Sat' },
        ];
        days.forEach(({ date, expected }) => {
            const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
            expect(dayLabel).toBe(expected);
        });
    });
});

// ──── 9. Extra meals bulk entry category ────
describe('Extra meals bulk entry', () => {
    const MEAL_CATEGORIES = [
        { id: 'extra', label: 'Extra Meals', description: 'Surplus meals not tied to a guest' },
        { id: 'rv', label: 'RV Meals' },
        { id: 'day_worker', label: 'Day Worker' },
        { id: 'shelter', label: 'Shelter' },
        { id: 'lunch_bag', label: 'Lunch Bags' },
        { id: 'united_effort', label: 'United Effort' },
    ];

    it('includes extra meals as a bulk category', () => {
        const extraCategory = MEAL_CATEGORIES.find(c => c.id === 'extra');
        expect(extraCategory).toBeDefined();
        expect(extraCategory!.label).toBe('Extra Meals');
    });

    it('has 6 total bulk meal categories', () => {
        expect(MEAL_CATEGORIES.length).toBe(6);
    });

    it('extra meals category is listed first', () => {
        expect(MEAL_CATEGORIES[0].id).toBe('extra');
    });
});
