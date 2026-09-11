import { useState } from 'react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  onNavigateTab: (tab: TabType) => void;
}

export default function Header({ activeTab, onNavigateTab }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const getSubtitle = () => {
    switch (activeTab) {
      case 'today':
        return 'Daily Balance';
      case 'check-in':
        return 'Daily Vitality';
      case 'trends':
        return 'Trends & Insights';
      case 'care-plan':
        return 'Care Plan & Health Hub';
      default:
        return 'Health Companion';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-100 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.06)]">
      <div className="h-16 px-4 max-w-lg mx-auto flex items-center justify-between">
        {/* Logo & Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[2px] shadow-md shadow-teal-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-0.5">
              <img
                alt="Serene Routine Logo"
                className="h-7 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WjVQ_MeptwV5FtorrIgablZvl9H6HsPD0iLhWwSX0sXOKZxN7LOxJi_B9oO6Doa_mjvx2AyLHv_fFwV0RZj_t_CO1zWhUjhRVPDRsMjjNrRfxgFXd2Dm82bqwQm1j6o4MtpNSWW62OaOawiDuk9ukPVtF7GBvSq_aTJGZ63454qRlvqxHOQBHD7VIELbajoQloQ8CUuoeeLTvl-GhQf4pWccEVklHpKJT7hFLC04ONtN4ztOIYJn15jA"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-800 via-emerald-700 to-indigo-800 tracking-tight leading-none text-[17px]">
              Serene Routine
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
                {getSubtitle()}
              </span>
            </div>
          </div>
        </div>

        {/* Actions (Notifications & Profile) */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 transition-colors shadow-sm relative active:scale-95"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[21px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          <button
            onClick={() => onNavigateTab('care-plan')}
            className="relative p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 shadow-md shadow-purple-500/25 active:scale-95 transition-transform"
            aria-label="Profile Care Plan"
          >
            <img
              alt="Sarah Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsdXL4G1Ew9fTsuI55y8_yZIys911qPjRyO76jS6qvnoB3bI2789Y2UXnl-1xRfMBJQyHr4vw2MmTVBHw5ePy8Lm4lv67_eQtgF1LyNgbd2uZ8vgOh0RBYYpi9obSHD6O0r2jnpBgZgdVGC8GRyFFAp3YLo03bXLPHutUxa3sVV8xBzmBqUFJxtJQnLF8aMA3W4ZrevG1toqewPG1AVH79cAI6O6qWTrGFxC5uJ7TQbyOtfkcgY1H2"
            />
          </button>

          {/* Notifications Dropdown Sheet */}
          {showNotifications && (
            <div className="absolute top-12 right-0 w-72 rounded-2xl bg-white shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Gentle Nudges</span>
                <span className="text-[10px] text-teal-600 font-semibold cursor-pointer hover:underline">
                  Mark read
                </span>
              </div>
              <div className="space-y-2 pt-2 text-xs">
                <div className="p-2 rounded-xl bg-teal-50/70 border border-teal-100">
                  <div className="font-semibold text-teal-900 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">water_drop</span>
                    Hydration Pacer
                  </div>
                  <p className="text-[11px] text-teal-800/80 mt-0.5">
                    Time for your mid-day electrolyte booster (Bottle #3).
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-100">
                  <div className="font-semibold text-purple-900 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                    Evening Vitals
                  </div>
                  <p className="text-[11px] text-purple-800/80 mt-0.5">
                    Scheduled blood pressure log &amp; wind-down at 8:00 PM.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
