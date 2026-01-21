import { pacificDateStringFrom } from "./date";
import { HOUSING_STATUSES } from "../constants/constants";

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const PACIFIC_TIME_ZONE = "America/Los_Angeles";
const GMT_OFFSET_REGEX = /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/;

const parseGmtOffsetMinutes = (value: string | null | undefined): number => {
  if (!value) return 0;
  const match = GMT_OFFSET_REGEX.exec(value.trim());
  if (!match) return 0;
  const sign = match[1] === "+" ? 1 : -1;
  const hours = Number(match[2] || 0);
  const minutes = Number(match[3] || 0);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
  return sign * (hours * 60 + minutes);
};

export const toTitleCase = (str: string | null | undefined): string => {
  if (!str || typeof str !== "string") return "";
  // Preserve single spaces between words (for middle names like "John Michael")
  // Only collapse multiple consecutive spaces into one
  return str
    .replace(/\s+/g, ' ') // Collapse multiple spaces to single space
    .split(' ')
    .map((word) => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ')
    .trim();
};

export const normalizePreferredName = (value: string | null | undefined): string => {
  if (!value || typeof value !== "string") return "";
  return toTitleCase(value.trim());
};

export const normalizeBicycleDescription = (value: string | null | undefined): string => {
  if (!value || typeof value !== "string") return "";
  return value.trim();
};

export const normalizeHousingStatus = (value: string | null | undefined): string => {
  const v = (value || "").toString().trim().toLowerCase();
  if (!v) return "Unhoused";
  if (HOUSING_STATUSES.map((s) => s.toLowerCase()).includes(v)) {
    return HOUSING_STATUSES.find((s) => s.toLowerCase() === v) || "Unhoused";
  }
  if (/(temp|temporary).*(shelter)/.test(v) || /shelter(ed)?/.test(v))
    return "Temp. shelter";
  if (/(rv|vehicle|car|van|truck)/.test(v)) return "RV or vehicle";
  if (/house(d)?|apartment|home/.test(v)) return "Housed";
  if (/unhouse(d)?|unshelter(ed)?|street|tent/.test(v)) return "Unhoused";
  return "Unhoused";
};

export const normalizeTimeComponent = (value: string | number | null | undefined): string | null => {
  if (value == null) return null;
  const [rawHours, rawMinutes] = value.toString().trim().split(":");
  if (rawHours == null || rawMinutes == null) return null;
  const hours = Number.parseInt(rawHours, 10);
  const minutes = Number.parseInt(rawMinutes, 10);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export const combineDateAndTimeISO = (dateStr: string | null | undefined, timeStr: string | number | null | undefined): string | null => {
  if (!dateStr) return null;
  const normalizedTime = normalizeTimeComponent(timeStr);
  if (!normalizedTime) return null;
  const candidate = new Date(`${dateStr}T${normalizedTime}:00`);
  if (Number.isNaN(candidate.getTime())) return null;
  return candidate.toISOString();
};

export const fallbackIsoFromDateOnly = (dateStr: string | null | undefined): string | null => {
  if (!dateStr) return null;
  const candidate = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(candidate.getTime())) return null;
  return candidate.toISOString();
};

export const createLocalId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

export const extractLaundrySlotStart = (slotLabel: string | null | undefined): string | null => {
  if (!slotLabel) return null;
  const [start] = slotLabel.split("-");
  return normalizeTimeComponent(start);
};

export const computeIsGuestBanned = (bannedUntil: string | null | undefined): boolean => {
  if (!bannedUntil) return false;
  const parsed = new Date(bannedUntil);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }
  return parsed.getTime() > Date.now();
};

export const normalizeDateInputToISO = (value: string | Date | null | undefined): string | null => {
  if (!value) return null;
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return value.toISOString();
  }

  const raw = String(value).trim();
  if (!raw) return null;

  if (DATE_ONLY_REGEX.test(raw)) {
    const [year, month, day] = raw.split("-").map(Number);
    if ([year, month, day].some(Number.isNaN)) return null;
    const now = new Date();
    const pacificTime = new Date(
      now.toLocaleString("en-US", { timeZone: PACIFIC_TIME_ZONE }),
    );
    const hours = pacificTime.getHours();
    const minutes = pacificTime.getMinutes();
    const seconds = pacificTime.getSeconds();
    const milliseconds = pacificTime.getMilliseconds();

    const offsetDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    if (Number.isNaN(offsetDate.getTime())) return null;

    const timezoneParts = new Intl.DateTimeFormat("en-US", {
      timeZone: PACIFIC_TIME_ZONE,
      timeZoneName: "shortOffset",
    }).formatToParts(offsetDate);
    const timezoneName = timezoneParts.find((part) => part.type === "timeZoneName")?.value;
    const timezoneOffsetMinutes = parseGmtOffsetMinutes(timezoneName);

    const utcTimestamp = Date.UTC(
      year,
      month - 1,
      day,
      hours,
      minutes,
      seconds,
      milliseconds,
    ) - timezoneOffsetMinutes * 60 * 1000;

    if (Number.isNaN(utcTimestamp)) return null;
    return new Date(utcTimestamp).toISOString();
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
};

// Types for donation date resolution
interface DonationDateParts {
  timestamp: string | null;
  dateKey: string | null;
}

// Type for donation record input (flexible - accepts various property names)
interface DonationRecordInput {
  date?: string | Date | null;
  donated_at?: string | Date | null;
  donatedAt?: string | Date | null;
  createdAt?: string | Date | null;
  created_at?: string | Date | null;
  trays?: number | string;
  weightLbs?: number | string;
  dateKey?: string | null;
  [key: string]: unknown;
}

export const resolveDonationDateParts = (value: string | Date | null | undefined, fallback: string | Date | null = null): DonationDateParts => {
  const normalized =
    normalizeDateInputToISO(value) ??
    (fallback ? normalizeDateInputToISO(fallback) : null);
  if (!normalized) {
    return { timestamp: null, dateKey: null };
  }
  const dateObj = new Date(normalized);
  if (Number.isNaN(dateObj.getTime())) {
    return { timestamp: normalized, dateKey: null };
  }
  return {
    timestamp: normalized,
    dateKey: pacificDateStringFrom(dateObj),
  };
};

export const ensureDonationRecordShape = (record: DonationRecordInput = {}) => {
  const base = record || {};
  const rawDate =
    base.date ??
    base.donated_at ??
    base.donatedAt ??
    base.createdAt ??
    base.created_at ??
    null;
  const { timestamp, dateKey } = resolveDonationDateParts(rawDate as string | Date | null);
  return {
    ...base,
    trays: Number(base.trays) || 0,
    weightLbs: Number(base.weightLbs) || 0,
    date: timestamp ?? base.date ?? null,
    dateKey: dateKey ?? base.dateKey ?? null,
  };
};
