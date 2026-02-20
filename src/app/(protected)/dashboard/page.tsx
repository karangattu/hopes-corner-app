'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
    BarChart3,
    Download,
    Activity,
    Utensils,
    ClipboardList,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useMealsStore } from '@/stores/useMealsStore';
import { useServicesStore } from '@/stores/useServicesStore';
import { useGuestsStore } from '@/stores/useGuestsStore';
import { cn } from '@/lib/utils/cn';
import { useCallback, useRef } from 'react';

const TabSkeleton = () => <div className="h-80 w-full animate-pulse rounded-2xl bg-gray-100" />;
const AnalyticsSection = dynamic(() => import('@/components/admin/AnalyticsSection').then((m) => m.AnalyticsSection), { loading: TabSkeleton });
const DataExportSection = dynamic(() => import('@/components/admin/DataExportSection').then((m) => m.DataExportSection), { loading: TabSkeleton });
const MealReport = dynamic(() => import('@/components/admin/reports/MealReport').then((m) => m.MealReport), { loading: TabSkeleton });
const MonthlySummaryReport = dynamic(() => import('@/components/admin/reports/MonthlySummaryReport'), { loading: TabSkeleton });
const MonthlyReportGenerator = dynamic(() => import('@/components/admin/reports/MonthlyReportGenerator'), { loading: TabSkeleton });

const DASHBOARD_TABS = [
    { id: 'analytics', label: 'Analytics', icon: Activity, color: 'text-blue-600' },
    { id: 'monthly-report', label: 'Monthly Report', icon: FileText, color: 'text-purple-600' },
    { id: 'meal-report', label: 'Meal Report', icon: Utensils, color: 'text-orange-600' },
    { id: 'monthly-summary', label: 'Summary', icon: ClipboardList, color: 'text-emerald-600' },
    { id: 'export', label: 'Data Export', icon: Download, color: 'text-gray-600' },
];

const REPORT_TAB_IDS = new Set(['monthly-report', 'meal-report', 'monthly-summary', 'export']);
// Keep dashboard/report data accurate for 2025+ while avoiding expensive all-time fetches.
const REPORT_BASELINE_YEAR = 2025;

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('analytics');
    const currentYear = new Date().getFullYear();
    const [preloadYear, setPreloadYear] = useState(currentYear);
    const [loadedReportYears, setLoadedReportYears] = useState<Set<number>>(() => new Set());
    const [isPreparingReports, setIsPreparingReports] = useState(false);
    const firstTabSwitchMarkRef = useRef(false);
    const preloadingYearRef = useRef<number | null>(null);
    const prefersReducedMotion = useReducedMotion();
    const markPerf = useCallback((name: string) => {
        if (typeof performance === 'undefined') return;
        performance.mark(name);
    }, []);
    const { loadSettings } = useSettingsStore();
    const ensureMealsLoaded = useMealsStore((s) => s.ensureLoaded);
    const ensureServicesLoaded = useServicesStore((s) => s.ensureLoaded);
    const ensureGuestsLoaded = useGuestsStore((s) => s.ensureLoaded);
    const preloadYearOptions = useMemo(() => {
        const years = new Set<number>([currentYear, currentYear - 1, REPORT_BASELINE_YEAR]);
        return Array.from(years).filter((year) => year >= REPORT_BASELINE_YEAR).sort((a, b) => b - a);
    }, [currentYear]);

    const preloadReportsForYear = useCallback(async (year: number) => {
        if (loadedReportYears.has(year)) return;
        if (preloadingYearRef.current === year) return;

        preloadingYearRef.current = year;
        setIsPreparingReports(true);
        try {
            // Always include baseline year data to preserve 2025 and current-month accuracy.
            const sinceYear = Math.min(year, REPORT_BASELINE_YEAR);
            const since = `${sinceYear}-01-01T00:00:00.000Z`;
            await Promise.all([
                ensureMealsLoaded({ force: true, since }),
                ensureServicesLoaded({ force: true, since }),
            ]);
            setLoadedReportYears((prev) => {
                const next = new Set(prev);
                next.add(year);
                return next;
            });
        } finally {
            preloadingYearRef.current = null;
            setIsPreparingReports(false);
        }
    }, [ensureMealsLoaded, ensureServicesLoaded, loadedReportYears]);

    useEffect(() => {
        loadSettings();
        // Load operational window first for a fast dashboard open.
        ensureMealsLoaded();
        ensureServicesLoaded();
        ensureGuestsLoaded();
    }, [loadSettings, ensureMealsLoaded, ensureServicesLoaded, ensureGuestsLoaded]);

    useEffect(() => {
        // Warm selected year's report window in the background.
        preloadReportsForYear(preloadYear);
    }, [preloadYear, preloadReportsForYear]);

    useEffect(() => {
        if (!REPORT_TAB_IDS.has(activeTab)) return;
        // Ensure selected year's report data is ready when opening report tabs.
        preloadReportsForYear(preloadYear);
    }, [activeTab, preloadYear, preloadReportsForYear]);

    const handleTabChange = (tabId: string) => {
        if (!firstTabSwitchMarkRef.current) {
            firstTabSwitchMarkRef.current = true;
            markPerf('dashboard:first-tab-switch');
        }
        setActiveTab(tabId);
    };

    const renderContent = () => {
        if (REPORT_TAB_IDS.has(activeTab) && (isPreparingReports || !loadedReportYears.has(preloadYear))) {
            return (
                <div className="space-y-4">
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                        Preparing {preloadYear} report data. This can take a moment.
                    </div>
                    <TabSkeleton />
                </div>
            );
        }
        switch (activeTab) {
            case 'analytics': return <AnalyticsSection />;
            case 'monthly-report': return <MonthlyReportGenerator />;
            case 'meal-report': return <MealReport />;
            case 'monthly-summary': return <MonthlySummaryReport />;
            case 'export': return <DataExportSection />;
            default: return <AnalyticsSection />;
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <BarChart3 size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Administration Console</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Mission Intelligence</h1>
                    <p className="text-gray-500 font-medium mt-2 max-w-xl">
                        Strategic oversight for Hope&apos;s Corner. Monitor metrics, analyze community trends, and manage operational targets.
                    </p>
                </div>

                {/* Desktop Tab Switcher */}
                <div className="hidden lg:flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
                        <label htmlFor="report-preload-year" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Report Year
                        </label>
                        <select
                            id="report-preload-year"
                            value={preloadYear}
                            onChange={(e) => setPreloadYear(Number(e.target.value))}
                            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-700 outline-none focus:border-emerald-500"
                        >
                            {preloadYearOptions.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex p-1.5 bg-gray-100 rounded-2xl gap-1">
                    {DASHBOARD_TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={cn(
                                    "flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-black transition-all",
                                    isActive
                                        ? "bg-white shadow-xl shadow-gray-200/50 scale-105"
                                        : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
                                )}
                            >
                                <Icon size={18} className={isActive ? tab.color : "text-gray-300"} />
                                <span className={isActive ? "text-gray-900" : "text-gray-400"}>
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet Tab Switcher */}
            <div className="lg:hidden flex items-center gap-2 pb-2 -mx-4 px-4">
                <label htmlFor="report-preload-year-mobile" className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Report Year
                </label>
                <select
                    id="report-preload-year-mobile"
                    value={preloadYear}
                    onChange={(e) => setPreloadYear(Number(e.target.value))}
                    className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-700 outline-none focus:border-emerald-500"
                >
                    {preloadYearOptions.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4">
                {DASHBOARD_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={cn(
                                "flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all border",
                                isActive
                                    ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                                    : "bg-white text-gray-500 border-gray-100"
                            )}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Main Content Area */}
            <motion.div
                key={activeTab}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.19, 1, 0.22, 1] }}
            >
                {renderContent()}
            </motion.div>
        </div>
    );
}
