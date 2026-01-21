/**
 * Utility to detect potential duplicate guests during creation
 * Helps prevent duplicate entries due to typos or nicknames
 */
import {
    similarityScore,
    soundsLike,
    areNicknameVariants,
    hasKeyboardTypo,
    hasTranspositionTypo
} from './fuzzyMatch';

interface DuplicateGuest {
    id: string;
    firstName?: string;
    lastName?: string;
    preferredName?: string;
}

interface PotentialDuplicate {
    guest: DuplicateGuest;
    reason: string;
    confidence: number;
}

/**
 * Check if a new guest might be a duplicate of an existing one
 * @param firstName - New guest first name
 * @param lastName - New guest last name
 * @param guests - Existing guest list
 * @returns List of potential duplicates with reason
 */
export const findPotentialDuplicates = (firstName: string, lastName: string, guests: DuplicateGuest[]): PotentialDuplicate[] => {
    if (!firstName || !lastName || !guests || guests.length === 0) return [];

    const newFirst = firstName.trim().toLowerCase();
    const newLast = lastName.trim().toLowerCase();
    const potentialDuplicates: PotentialDuplicate[] = [];

    for (const guest of guests) {
        const existingFirst = (guest.firstName || '').trim().toLowerCase();
        const existingLast = (guest.lastName || '').trim().toLowerCase();
        const existingPreferred = (guest.preferredName || '').trim().toLowerCase();

        // 1. Exact Match (Case insensitive)
        if (newFirst === existingFirst && newLast === existingLast) {
            potentialDuplicates.push({
                guest,
                reason: 'Exact name match',
                confidence: 1.0
            });
            continue;
        }

        // 2. Exact match with preferred name
        if (existingPreferred && newFirst === existingPreferred && newLast === existingLast) {
            potentialDuplicates.push({
                guest,
                reason: 'Matches preferred name',
                confidence: 0.95
            });
            continue;
        }

        // Check last name similarity first (must be very similar)
        const lastSim = similarityScore(newLast, existingLast);
        const lastIsTypo = hasKeyboardTypo(newLast, existingLast) || hasTranspositionTypo(newLast, existingLast);
        const lastPhonetic = soundsLike(newLast, existingLast);

        if (lastSim < 0.8 && !lastIsTypo && !lastPhonetic) continue;

        // Check first name relationship
        let firstReason = null;
        let firstConfidence = 0;

        // A. Nickname match
        if (areNicknameVariants(newFirst, existingFirst) || (existingPreferred && areNicknameVariants(newFirst, existingPreferred))) {
            firstReason = 'Nickname match';
            firstConfidence = 0.9;
        }
        // B. Typo match
        else if (hasKeyboardTypo(newFirst, existingFirst) || hasTranspositionTypo(newFirst, existingFirst)) {
            firstReason = 'Possible typo';
            firstConfidence = 0.85;
        }
        // C. Strong fuzzy match
        else if (similarityScore(newFirst, existingFirst) > 0.85) {
            firstReason = 'Similar name';
            firstConfidence = 0.8;
        }
        // D. Phonetic match
        else if (soundsLike(newFirst, existingFirst)) {
            firstReason = 'Sounds similar';
            firstConfidence = 0.75;
        }

        if (firstReason) {
            // If last name is only phonetically similar or a typo, reduce confidence slightly
            let totalConfidence = firstConfidence;
            let reasonDetail = firstReason;

            if (lastIsTypo) {
                reasonDetail += ' + Last name typo';
                totalConfidence *= 0.95;
            } else if (lastPhonetic && lastSim < 0.9) {
                reasonDetail += ' + Last name sounds similar';
                totalConfidence *= 0.9;
            }

            potentialDuplicates.push({
                guest,
                reason: reasonDetail,
                confidence: totalConfidence
            });
        }
    }

    return potentialDuplicates.sort((a, b) => b.confidence - a.confidence);
};
