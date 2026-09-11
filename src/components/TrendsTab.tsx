import { useState } from 'react';
import { VitalsState, EmergencyHealthData } from '../types';

interface TrendsTabProps {
  vitals: VitalsState;
  emergency: EmergencyHealthData;
  onOpenExportModal: () => void;
}

export default function TrendsTab({
  vitals,
  emergency,
  onOpenExportModal
}: TrendsTabProps) {
  const [selectedDays, setSelectedDays] = useState<'7' | '30' | '90'>('7');
  const [showCorrelationModal, setShowCorrelationModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleExport = () => {
    onOpenExportModal();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3200);
  };

  return (
    <div className="flex flex-col w-full px-4 pb-8 space-y-4 max-w-lg mx-auto">
      {/* Screen Header & Timeframe Pills */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-md text-[24px] text-slate-900 tracking-tight font-extrabold bg-gradient-to-r from-slate-900 via-teal-800 to-purple-900 bg-clip-text text-transparent">
              Health &amp; Routine Trends
            </h1>
            <p className="text-xs text-slate-500 font-medium">Patterns, consistency, and restorative rhythms</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-primary flex items-center justify-center text-white shadow-lg shadow-teal-500/25 ring-2 ring-emerald-200">
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              insights
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-1" id="time-filter-group">
          {(['7', '30', '90'] as const).map((days) => (
            <button
              key={days}
              onClick={() => setSelectedDays(days)}
              type="button"
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                selectedDays === days
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/30 ring-1 ring-white/30'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Streak & Consistency Hero Card: Radiant Sunset Fiery Gradient */}
      <div className="relative overflow-hidden rounded-3xl p-4 shadow-xl shadow-orange-500/10 border border-amber-200/60 bg-gradient-to-br from-[#ff5e36] via-[#ff7e47] to-[#ffb03a] text-white flex flex-col gap-3">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-yellow-300/30 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-red-600/25 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-100 shadow-inner ring-1 ring-white/40">
              <span
                className="material-symbols-outlined text-[28px] text-yellow-200 drop-shadow-[0_2px_8px_rgba(255,200,0,0.8)]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-lg text-white font-extrabold tracking-tight drop-shadow-sm">
                  14-Day Streak
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-md text-white text-[10px] font-bold shadow-xs border border-white/30">
                  <span className="material-symbols-outlined text-[12px] text-emerald-200" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bolt
                  </span>{' '}
                  On Fire
                </span>
              </div>
              <p className="text-xs text-amber-50/90 font-medium">Calm, mindful momentum</p>
            </div>
          </div>

          <div className="text-right bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/25">
            <span className="font-title-lg text-base text-white font-extrabold tracking-tight drop-shadow-sm">92%</span>
            <p className="text-[10px] text-amber-100 font-semibold leading-none pt-0.5">Avg Rate</p>
          </div>
        </div>

        {/* Micro Streak Calendar: Glowing Badges */}
        <div className="relative z-10 pt-1 flex items-center justify-between px-2 bg-black/15 backdrop-blur-md rounded-2xl py-2.5 border border-white/15">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
            const isToday = idx === 6;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className={`text-[10px] font-bold ${isToday ? 'text-white underline' : 'text-amber-100/90'}`}>
                  {day}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md ${
                    idx === 5
                      ? 'bg-gradient-to-tr from-emerald-500 to-lime-300 text-emerald-950 ring-1 ring-lime-200'
                      : isToday
                      ? 'bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-200 text-emerald-950 ring-2 ring-white shadow-lg'
                      : 'bg-gradient-to-tr from-emerald-600 to-teal-300 text-white ring-1 ring-emerald-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px] font-black">check</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit Correlation Graph: Rich Dual-Axis Infographic */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-bl from-cyan-200/30 to-purple-200/30 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-start justify-between relative z-10">
          <div>
            <h2 className="font-title-md font-bold text-slate-900 text-[15px]">Sleep Duration vs. Energy</h2>
            <p className="text-xs text-slate-500">Noticeable vitality uplift on days with &gt;7.0h rest</p>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-[10px] font-bold shadow-sm shadow-emerald-500/25">
            <span className="material-symbols-outlined text-[13px]">trending_up</span> +28% Energy
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-600 relative z-10 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-gradient-to-t from-emerald-500 to-cyan-400"></span>
            <span className="font-medium text-[11px]">Sleep Hours</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-gradient-to-r from-[#ff5c39] via-pink-500 to-purple-600 rounded-full"></span>
            <span className="font-medium text-[11px]">Energy Score (1-10)</span>
          </div>
        </div>

        {/* SVG Correlation Chart */}
        <div className="w-full relative z-10">
          <div className="relative w-full h-44 bg-gradient-to-b from-slate-50/50 to-white rounded-2xl p-1">
            <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 320 150">
              <defs>
                <linearGradient id="sleepBarOptimal" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#00e5a3" />
                  <stop offset="50%" stopColor="#00a877" />
                  <stop offset="100%" stopColor="#006948" />
                </linearGradient>
                <linearGradient id="sleepBarLow" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6ee7b7" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="energySpline" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#ff5c39" />
                  <stop offset="40%" stopColor="#e0245e" />
                  <stop offset="75%" stopColor="#8a4cfc" />
                  <stop offset="100%" stopColor="#ff5c39" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line stroke="#e2e8f0" strokeWidth="1" x1="16" x2="310" y1="30" y2="30" />
              <line stroke="#e2e8f0" strokeWidth="1" x1="16" x2="310" y1="65" y2="65" />
              <line stroke="#e2e8f0" strokeWidth="1" x1="16" x2="310" y1="100" y2="100" />

              {/* 7.0h Goal Guideline with Pill */}
              <line stroke="#ff5c39" strokeDasharray="4 4" strokeWidth="1.5" x1="18" x2="260" y1="65" y2="65" />
              <rect fill="#ff5c39" height="15" rx="4" width="46" x="264" y="58" />
              <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="8" fontWeight="700" textAnchor="middle" x="287" y="69">
                7h Goal
              </text>

              {/* Sleep Duration Bars */}
              <rect fill="url(#sleepBarLow)" height="48" rx="5" width="18" x="24" y="82" />
              <rect fill="url(#sleepBarOptimal)" height="78" rx="5" width="18" x="67" y="52" />
              <rect fill="url(#sleepBarOptimal)" height="84" rx="5" width="18" x="110" y="46" />
              <rect fill="url(#sleepBarLow)" height="54" rx="5" width="18" x="153" y="76" />
              <rect fill="url(#sleepBarOptimal)" height="74" rx="5" width="18" x="196" y="56" />
              <rect fill="url(#sleepBarOptimal)" height="92" rx="5" width="18" x="239" y="38" />
              <rect fill="url(#sleepBarOptimal)" height="76" rx="5" width="18" x="282" y="54" />

              {/* Energy Glow Shade Area */}
              <path
                d="M 33 86 Q 52 46, 76 42 T 119 36 T 162 76 T 205 44 T 248 28 T 291 40 L 291 130 L 33 130 Z"
                fill="url(#energySpline)"
                opacity="0.10"
              />

              {/* Smooth Spline */}
              <path
                d="M 33 86 Q 52 46, 76 42 T 119 36 T 162 76 T 205 44 T 248 28 T 291 40"
                fill="none"
                stroke="url(#energySpline)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />

              {/* Energy Nodes */}
              <circle cx="33" cy="86" fill="#ffffff" r="4" stroke="#ff5c39" strokeWidth="2.5" />
              <circle cx="76" cy="42" fill="#ffffff" r="4" stroke="#e0245e" strokeWidth="2.5" />
              <circle cx="119" cy="36" fill="#ffffff" r="4" stroke="#8a4cfc" strokeWidth="2.5" />
              <circle cx="162" cy="76" fill="#ffffff" r="4" stroke="#ff5c39" strokeWidth="2.5" />
              <circle cx="205" cy="44" fill="#ffffff" r="4" stroke="#8a4cfc" strokeWidth="2.5" />

              {/* Tooltip callout at Saturday */}
              <g>
                <circle cx="248" cy="28" fill="#8a4cfc" r="5" stroke="#ffffff" strokeWidth="2" />
                <rect fill="#131b2e" height="16" rx="4" width="34" x="231" y="6" />
                <polygon fill="#131b2e" points="244,22 252,22 248,25" />
                <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="8.5" fontWeight="700" textAnchor="middle" x="248" y="17.5">
                  9.1⚡
                </text>
              </g>

              <circle cx="291" cy="40" fill="#ffffff" r="4" stroke="#ff5c39" strokeWidth="2.5" />

              {/* X Axis Day Labels */}
              <text fill="#475569" fontSize="10" fontWeight="600" textAnchor="middle" x="33" y="146">M</text>
              <text fill="#475569" fontSize="10" fontWeight="600" textAnchor="middle" x="76" y="146">T</text>
              <text fill="#475569" fontSize="10" fontWeight="600" textAnchor="middle" x="119" y="146">W</text>
              <text fill="#475569" fontSize="10" fontWeight="600" textAnchor="middle" x="162" y="146">T</text>
              <text fill="#475569" fontSize="10" fontWeight="600" textAnchor="middle" x="205" y="146">F</text>
              <text fill="#006948" fontSize="10" fontWeight="800" textAnchor="middle" x="248" y="146">S</text>
              <text fill="#475569" fontSize="10" fontWeight="600" textAnchor="middle" x="291" y="146">S</text>
            </svg>
          </div>
        </div>

        {/* Metric Summary Strip */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-100 rounded-2xl p-3 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="material-symbols-outlined text-[18px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            Avg Sleep: <strong className="text-emerald-900 font-bold">7.4 hrs</strong>
          </span>
          <span className="text-slate-700">
            Peak Energy: <strong className="text-purple-700 font-bold">Saturday (9.1)</strong>
          </span>
        </div>
      </div>

      {/* Weekly Routine Breakdown with Vibrant Gradient Bars */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-title-lg font-bold text-slate-900 text-base">Weekly Routine Breakdown</h2>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-teal-700 uppercase tracking-wider">
            Last 7 Days
          </span>
        </div>

        {/* Hydration Target */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-cyan-100 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/25">
                <span className="material-symbols-outlined text-[24px]">water_drop</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm">Hydration Target</span>
                  <span className="px-2 py-0.2 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold">Optimal</span>
                </div>
                <p className="text-xs text-slate-500">2,400 ml daily goal</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-blue-600 text-sm">6/7 days</span>
              <p className="text-[11px] text-cyan-700 font-semibold">86% completed</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-1 p-0.5">
            <div className="bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 h-full rounded-full" style={{ width: '86%' }}></div>
          </div>
        </div>

        {/* Meds & Supplements */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/25">
                <span className="material-symbols-outlined text-[24px]">pill</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm">Meds &amp; Supplements</span>
                  <span className="px-2 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">100% Perfect</span>
                </div>
                <p className="text-xs text-slate-500">Morning Vitamin D + Magnesium</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-purple-700 text-sm">7/7 days</span>
              <p className="text-[11px] text-purple-600 font-semibold">Unbroken</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-1 p-0.5">
            <div className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600 h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Vitals Logging */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
                <span className="material-symbols-outlined text-[24px]">favorite</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm">Vitals &amp; Mood Logging</span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span>
                </div>
                <p className="text-xs text-slate-500">Blood pressure &amp; resting state</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-700 text-sm">5/7 days</span>
              <p className="text-[11px] text-emerald-600 font-semibold">71% logged</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-1 p-0.5">
            <div className="bg-gradient-to-r from-lime-400 via-emerald-500 to-teal-600 h-full rounded-full" style={{ width: '71%' }}></div>
          </div>
        </div>
      </div>

      {/* Smart Serene Insight (Aurora Borealis / Emerald-Teal-Indigo Gradient) */}
      <div className="relative overflow-hidden rounded-3xl p-4 shadow-xl text-white bg-gradient-to-br from-[#005238] via-[#026873] to-[#252873] border border-teal-300/30 flex flex-col gap-2">
        <div className="absolute -right-6 -top-6 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute left-1/3 -bottom-8 w-44 h-44 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-emerald-300 shadow-inner ring-1 ring-white/30">
              <span className="material-symbols-outlined text-[19px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
            <span className="text-xs tracking-wider uppercase font-extrabold text-emerald-300">
              Smart Serene Insight
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-300 text-[10px] font-bold">
            AI Correlation
          </span>
        </div>

        <p className="text-xs text-slate-100 leading-relaxed relative z-10">
          Your resting heart rate averages <span className="font-bold text-emerald-300 underline decoration-emerald-300/50 underline-offset-2">4 bpm lower</span> on days you complete your evening breathwork routine. Consistency here supports sustained restorative REM cycles.
        </p>

        <div className="pt-2 flex items-center justify-between relative z-10 border-t border-white/10 mt-1">
          <span className="text-[11px] text-teal-200/90 font-medium">Based on paired Apple Health logs</span>
          <button
            onClick={() => setShowCorrelationModal(true)}
            className="inline-flex items-center gap-1 text-xs text-emerald-300 hover:text-white font-bold transition-colors"
            type="button"
          >
            <span>View Correlation</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Export Report / Doctor Summary Action */}
      <div className="pt-1">
        <div className="relative overflow-hidden bg-gradient-to-r from-white via-slate-50 to-indigo-50/50 rounded-3xl p-4 flex items-center justify-between shadow-sm border border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/25">
              <span className="material-symbols-outlined text-[22px]">description</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Clinical Health Summary</h3>
              <p className="text-xs text-slate-500">Formatted for your physician &amp; care team</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-700 hover:opacity-95 active:scale-[0.98] transition-all text-white rounded-full text-xs font-bold shadow-md shadow-emerald-600/30 ring-1 ring-white/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Export Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 inset-x-4 max-w-sm mx-auto bg-slate-900 text-white py-2.5 px-4 rounded-2xl shadow-2xl flex items-center justify-between z-50 border border-white/10 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <span className="text-xs font-semibold">Clinical PDF generated successfully</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-emerald-300 font-bold">Ready</span>
        </div>
      )}

      {/* View Correlation Modal */}
      {showCorrelationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-teal-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600 text-[22px]">insights</span>
                <h3 className="font-bold text-slate-900 text-base">Resting Heart Rate Correlation</h3>
              </div>
              <button onClick={() => setShowCorrelationModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs text-slate-600">
              <p>
                Analysis across 28 days showed that parasympathetic stimulation from 10-min evening breathwork resulted in:
              </p>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 font-medium">
                • 4.2 bpm lower nocturnal resting heart rate (64 bpm vs 68.2 bpm)
                <br />• 18% longer deep sleep phase duration
                <br />• 94% subjective morning alertness on subsequent days
              </div>
            </div>

            <button
              onClick={() => setShowCorrelationModal(false)}
              className="w-full py-2.5 rounded-xl bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-700/20 active:scale-95 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
