/**
 * App version utilities
 * Centralizes version information and changelog data
 */

export const APP_VERSION = '0.1.0';

export interface ChangelogItem {
    type: 'feature' | 'fix' | 'performance' | 'improvement';
    title: string;
    description: string;
}

export interface ChangelogEntry {
    version: string;
    date: string;
    highlights: ChangelogItem[];
}

// Changelog entries - add new entries at the top
export const CHANGELOG: ChangelogEntry[] = [
    {
        version: '0.1.0',
        date: 'January 20, 2026',
        highlights: [
            {
                type: 'feature',
                title: 'Enhanced Guest Management',
                description: 'New guest edit, ban management, and warning modals with a streamlined interface for faster check-ins.',
            },
            {
                type: 'feature',
                title: 'Keyboard Shortcuts',
                description: 'Press ⌘K (or Ctrl+K) to quickly focus the search bar, and ⌘⌥G (or Ctrl+Alt+G) to open the new guest form.',
            },
        ],
    },
];

/**
 * Check if there are unseen updates
 */
export const hasUnseenUpdates = (): boolean => {
    if (typeof window === 'undefined') return false;
    const seenVersion = localStorage.getItem('hopes-corner-seen-version');
    return seenVersion !== APP_VERSION;
};

/**
 * Mark current version as seen
 */
export const markVersionAsSeen = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('hopes-corner-seen-version', APP_VERSION);
};

/**
 * Get the current app version
 */
export const getAppVersion = (): string => APP_VERSION;
