import { useState } from 'react';
import confetti from 'canvas-confetti';
import HealthOrb3D from './HealthOrb3D';
import { HabitItem, VitalsState, TabType } from '../types';

interface TodayTabProps {
  vitals: VitalsState;
  onUpdateVitals: (updater: (prev: VitalsState) => VitalsState) => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenGrounding: () => void;
  onOpenRestorativeTips: () => void;
  onOpenBloodPressure: () => void;
}

export default function TodayTab({
  vitals,
  onUpdateVitals,
  onNavigateTab,
  onOpenGrounding,
  onOpenRestorativeTips,
  onOpenBloodPressure
}: TodayTabProps) {
  const [isPlayingRain, setIsPlayingRain] = useState(false);
  const [habits, setHabits] = useState<HabitItem[]>([
    {
      id: 'h-1',
      title: 'Drink 500ml warm lemon water',
      subtitle: 'Completed • 8:15 AM',
      timeSlot: 'morning',
      completed: true,
      completedAt: '8:15 AM',
      icon: 'local_cafe',
      iconBgGradient: 'from-amber-400 to-yellow-300'
    },
    {
      id: 'h-2',
      title: '15-min Sun Salutation Stretch',
      subtitle: 'Completed • 8:40 AM',
      timeSlot: 'morning',
      completed: true,
      completedAt: '8:40 AM',
      icon: 'self_improvement',
      iconBgGradient: 'from-emerald-500 to-teal-400'
    },
    {
      id: 'h-3',
      title: 'Morning Vitamins & Omega 3',
      subtitle: 'With balanced breakfast',
      timeSlot: 'morning',
      completed: false,
      icon: 'medication',
      iconBgGradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'h-4',
      title: 'Mindful 20-min Post-Lunch Walk',
      subtitle: 'Digestion & mental clarity',
      timeSlot: 'afternoon',
      completed: false,
      progress: {
        current: 12,
        target: 20,
        unit: 'mins'
      },
      icon: 'nature_people',
      iconBgGradient: 'from-orange-500 to-pink-500'
    },
    {
      id: 'h-5',
      title: 'Hydration Refill (Bottle #3)',
      subtitle: '750ml electrolyte boost',
      timeSlot: 'afternoon',
      completed: false,
      icon: 'opacity',
      iconBgGradient: 'from-cyan-400 to-teal-500'
    },
    {
      id: 'h-6',
      title: 'Evening Blood Pressure Log',
      subtitle: 'Due at 8:00 PM • Seated & rested',
      timeSlot: 'evening',
      completed: false,
      isAction: true,
      actionText: 'Log Now',
      icon: 'monitor_heart',
      iconBgGradient: 'from-purple-600 to-indigo-600'
    },
    {
      id: 'h-7',
      title: '10-min Wind-down Breathwork & Journal',
      subtitle: 'Scheduled for 9:30 PM',
      timeSlot: 'evening',
      completed: false,
      icon: 'auto_stories',
      iconBgGradient: 'from-indigo-500 to-pink-500'
    }
  ]);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextCompleted = !item.completed;
          if (nextCompleted) {
            try {
              confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
            } catch {
              // ignore
            }
          }
          return {
            ...item,
            completed: nextCompleted,
            subtitle: nextCompleted ? `Completed • Just now` : item.subtitle
          };
        }
        return item;
      })
    );
  };

  const handleQuickWater = () => {
    onUpdateVitals((prev) => {
      const nextWater = Math.min(Number((prev.waterIntake + 0.25).toFixed(2)), 3.5);
      return { ...prev, waterIntake: nextWater };
    });
    try {
      confetti({ particleCount: 15, spread: 35, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
  };

  const toggleRainSound = () => {
    setIsPlayingRain(!isPlayingRain);
  };

  const completedCount = habits.filter((h) => h.completed).length;

  return (
    <div className="flex flex-col w-full px-4 pt-3 pb-8 space-y-4 max-w-lg mx-auto">
      {/* 3D Interactive Health Core Holographic Orb */}
      <HealthOrb3D
        hydrationPercent={Math.round((vitals.waterIntake / vitals.waterTarget) * 100)}
        heartRate={vitals.heartRate}
        energyStatus={vitals.mood.includes('Calm') ? 'Optimal' : 'Active'}
      />

      {/* Greeting & Date Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/70 border border-emerald-200/60 text-emerald-800 text-xs font-bold w-fit">
            <span className="material-symbols-outlined text-[14px] text-emerald-600">calendar_today</span>
            <span>Thursday, Oct 24</span>
          </div>
          <h1 className="font-headline-md text-[26px] text-slate-900 mt-1.5 font-extrabold tracking-tight">
            Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">Sarah</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Your rhythm is steady and restorative today.</p>
        </div>
        <button
          onClick={() => onNavigateTab('care-plan')}
          className="w-11 h-11 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-700 hover:text-indigo-600 hover:border-indigo-200 active:scale-95 transition-all"
          title="Customize routines"
        >
          <span className="material-symbols-outlined text-[22px]">tune</span>
        </button>
      </div>

      {/* HERO CARD: Daily Health Pulse */}
      <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2f24] via-[#0d3b4c] to-[#24174d] p-5 shadow-xl shadow-teal-950/20 text-white border border-teal-500/20">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-teal-400/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-purple-500/25 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" viewBox="0 0 54 54">
                <defs>
                  <linearGradient id="pulseGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="50%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
                <circle cx="27" cy="27" fill="none" r="22" stroke="rgba(255,255,255,0.12)" strokeWidth="4.5" />
                <circle
                  className="transition-all duration-1000"
                  cx="27"
                  cy="27"
                  fill="none"
                  r="22"
                  stroke="url(#pulseGradient)"
                  strokeDasharray="138.2"
                  strokeDashoffset="16.5"
                  strokeLinecap="round"
                  strokeWidth="4.5"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-sm font-extrabold text-[18px] text-white tracking-tight">88%</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-title-lg font-bold text-white text-[17px] tracking-tight">Daily Health Pulse</span>
                <span className="material-symbols-outlined text-[18px] text-emerald-300 animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
                  spa
                </span>
              </div>
              <p className="text-xs text-teal-100/80 mt-0.5 flex items-center gap-1">
                <span>Optimal harmony</span>
                <span className="w-1 h-1 rounded-full bg-teal-300"></span>
                <span className="text-emerald-300 font-semibold">+4% from yesterday</span>
              </p>
            </div>
          </div>
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-900 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-lg shadow-emerald-400/25 tracking-wide uppercase">
            On Track
          </span>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-3.5 relative z-10">
          {/* Water */}
          <div
            onClick={handleQuickWater}
            className="bg-white/10 backdrop-blur-md border border-cyan-400/25 hover:border-cyan-300/60 rounded-2xl p-3 flex items-center gap-3 shadow-sm cursor-pointer transition-transform active:scale-95"
            title="Tap to add 250ml"
          >
            <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="none" r="14" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  fill="none"
                  r="14"
                  stroke="#22d3ee"
                  strokeDasharray="87.96"
                  strokeDashoffset={Math.max(0, 87.96 * (1 - vitals.waterIntake / vitals.waterTarget))}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="material-symbols-outlined absolute text-[18px] text-cyan-300" style={{ fontVariationSettings: "'FILL' 1" }}>
                water_drop
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-cyan-200 truncate">Water Intake</div>
              <div className="font-bold text-white text-[15px] leading-tight">
                {vitals.waterIntake} <span className="text-[11px] text-cyan-100/70 font-normal">/ {vitals.waterTarget}L</span>
              </div>
            </div>
          </div>

          {/* Sleep */}
          <div className="bg-white/10 backdrop-blur-md border border-purple-400/25 hover:border-purple-300/60 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
            <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="none" r="14" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                <circle cx="18" cy="18" fill="none" r="14" stroke="#c084fc" strokeDasharray="87.96" strokeDashoffset="8.8" strokeLinecap="round" strokeWidth="3.5" />
              </svg>
              <span className="material-symbols-outlined absolute text-[18px] text-purple-300" style={{ fontVariationSettings: "'FILL' 1" }}>
                bedtime
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-purple-200 truncate">Sleep Rest</div>
              <div className="font-bold text-white text-[15px] leading-tight">
                {vitals.sleepHours} <span className="text-[11px] text-purple-100/70 font-normal">hrs</span>
              </div>
            </div>
          </div>

          {/* Movement */}
          <div className="bg-white/10 backdrop-blur-md border border-orange-400/25 hover:border-orange-300/60 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
            <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_6px_rgba(249,115,22,0.6)]" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="none" r="14" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                <circle cx="18" cy="18" fill="none" r="14" stroke="#fb923c" strokeDasharray="87.96" strokeDashoffset="31.6" strokeLinecap="round" strokeWidth="3.5" />
              </svg>
              <span className="material-symbols-outlined absolute text-[18px] text-orange-300" style={{ fontVariationSettings: "'FILL' 1" }}>
                directions_walk
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-orange-200 truncate">Movement</div>
              <div className="font-bold text-white text-[15px] leading-tight">
                {vitals.steps.toLocaleString()} <span className="text-[11px] text-orange-100/70 font-normal">steps</span>
              </div>
            </div>
          </div>

          {/* Current Mood */}
          <div
            onClick={() => onNavigateTab('check-in')}
            className="bg-white/10 backdrop-blur-md border border-amber-400/25 hover:border-amber-300/60 rounded-2xl p-3 flex items-center gap-3 shadow-sm cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex-shrink-0 flex items-center justify-center text-amber-950 shadow-md shadow-amber-400/30">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                sentiment_calm
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-amber-200 truncate">Current Mood</div>
              <div className="font-bold text-white text-[14px] leading-tight truncate">{vitals.mood}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Health Check CTA Button */}
      <div className="w-full">
        <button
          onClick={() => onNavigateTab('check-in')}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-title-md font-bold text-[15px] flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 relative overflow-hidden group"
          id="quick-check-btn"
          type="button"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">add</span>
          </span>
          <span className="tracking-wide">Quick Health Check</span>
          <span className="material-symbols-outlined text-[18px] opacity-80 group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>

      {/* Quick Health Toolkit Carousel */}
      <div className="w-full space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="font-headline-sm font-extrabold text-[18px] text-slate-900 tracking-tight flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
              Quick Health Toolkit
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              Interactive
            </span>
          </div>
          <span onClick={() => onNavigateTab('care-plan')} className="text-[11px] font-bold text-teal-600 hover:underline cursor-pointer">
            View All
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          {/* Water Counter */}
          <div
            onClick={handleQuickWater}
            className="min-w-[155px] flex-1 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-3 text-white shadow-md shadow-cyan-500/20 relative overflow-hidden flex flex-col justify-between group cursor-pointer active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                  water_drop
                </span>
              </div>
              <button className="px-2 py-0.5 rounded-full bg-white text-cyan-700 font-extrabold text-[11px] shadow-sm hover:bg-cyan-50 active:scale-95 transition-transform flex items-center gap-0.5">
                +250ml
              </button>
            </div>
            <div className="mt-3">
              <div className="text-[11px] font-medium text-cyan-100/90">Water Counter</div>
              <div className="font-headline-sm font-extrabold text-[17px] leading-tight text-white mt-0.5">
                {(vitals.waterIntake * 1000).toLocaleString()}{' '}
                <span className="text-[11px] font-normal opacity-80">/ {(vitals.waterTarget * 1000).toLocaleString()}ml</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-1.5 mt-2 overflow-hidden p-[1px]">
                <div className="bg-white rounded-full h-full" style={{ width: `${Math.min(100, (vitals.waterIntake / vitals.waterTarget) * 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Breathing Calm */}
          <div
            onClick={onOpenGrounding}
            className="min-w-[155px] flex-1 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-3 text-white shadow-md shadow-purple-600/20 relative overflow-hidden flex flex-col justify-between group cursor-pointer active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px] text-white">air</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-purple-200/80 text-purple-900 font-extrabold text-[10px]">4-7-8</span>
            </div>
            <div className="mt-3">
              <div className="text-[11px] font-medium text-purple-100/90">Breathing Calm</div>
              <div className="font-headline-sm font-extrabold text-[15px] leading-tight text-white mt-0.5 flex items-center gap-1">
                Start 2-min <span className="material-symbols-outlined text-[15px]">play_circle</span>
              </div>
              <div className="text-[10px] text-purple-200/80 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-pulse"></span>Heart rate sync
              </div>
            </div>
          </div>

          {/* Pill Dispenser */}
          <div
            onClick={() => onNavigateTab('care-plan')}
            className="min-w-[155px] flex-1 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-3 text-white shadow-md shadow-orange-500/25 relative overflow-hidden flex flex-col justify-between group cursor-pointer active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px] text-white">medication</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/25 text-white font-extrabold text-[10px]">Next: 12 PM</span>
            </div>
            <div className="mt-3">
              <div className="text-[11px] font-medium text-orange-100/90">Pill Dispenser</div>
              <div className="font-headline-sm font-extrabold text-[15px] leading-tight text-white mt-0.5">Omega &amp; Vit D</div>
              <div className="text-[10px] text-orange-100/80 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">alarm</span>In 2h 45m
              </div>
            </div>
          </div>

          {/* Soundscapes */}
          <div
            onClick={toggleRainSound}
            className="min-w-[155px] flex-1 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-2xl p-3 text-amber-950 shadow-md shadow-amber-400/20 relative overflow-hidden flex flex-col justify-between group cursor-pointer active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-950/15 backdrop-blur-md flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px] text-amber-950">graphic_eq</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-950/15 text-amber-950 font-extrabold text-[10px]">
                {isPlayingRain ? 'Playing' : 'Forest'}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-[11px] font-semibold text-amber-900/80">Soundscapes</div>
              <div className="font-headline-sm font-extrabold text-[15px] leading-tight text-amber-950 mt-0.5 flex items-center gap-1">
                Gentle Rain <span className="material-symbols-outlined text-[15px]">{isPlayingRain ? 'pause_circle' : 'volume_up'}</span>
              </div>
              <div className="text-[10px] text-amber-900/70 mt-1">Focus &amp; Serenity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Flow Section */}
      <div className="w-full space-y-4 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="font-headline-sm font-extrabold text-[20px] text-slate-900 tracking-tight">Daily Flow</h2>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold">Today</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 font-semibold text-xs text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{completedCount} of {habits.length} Completed</span>
          </div>
        </div>

        {/* Morning Segment */}
        <div className="space-y-2 bg-gradient-to-b from-amber-50/60 to-transparent p-3 rounded-2xl border border-amber-100/70">
          <div className="flex items-center justify-between px-1 py-0.5">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-amber-700">
              <div className="w-5 h-5 rounded-lg bg-amber-200/80 flex items-center justify-center text-amber-800">
                <span className="material-symbols-outlined text-[14px]">light_mode</span>
              </div>
              <span>Morning Routine</span>
            </div>
            <span className="text-[11px] font-semibold text-amber-900/60">8:00 AM – 11:00 AM</span>
          </div>

          <div className="space-y-2">
            {habits
              .filter((h) => h.timeSlot === 'morning')
              .map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${habit.iconBgGradient} flex items-center justify-center text-white flex-shrink-0 shadow-md`}
                    >
                      <span className="material-symbols-outlined text-[22px]">{habit.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`font-title-md font-bold truncate text-[14px] ${
                          habit.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {habit.title}
                      </div>
                      <div className="text-[12px] font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
                        {habit.completed && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                        <span className={habit.completed ? 'text-emerald-600' : 'text-slate-500'}>{habit.subtitle}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      habit.completed
                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/30'
                        : 'border-2 border-slate-300 bg-slate-50 text-transparent hover:border-emerald-500'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[19px] font-bold">check</span>
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Afternoon Segment */}
        <div className="space-y-2 bg-gradient-to-b from-orange-50/60 to-transparent p-3 rounded-2xl border border-orange-100/70">
          <div className="flex items-center justify-between px-1 py-0.5">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-orange-700">
              <div className="w-5 h-5 rounded-lg bg-orange-200/80 flex items-center justify-center text-orange-800">
                <span className="material-symbols-outlined text-[14px]">wb_sunny</span>
              </div>
              <span>Afternoon Energy</span>
            </div>
            <span className="text-[11px] font-semibold text-orange-900/60">12:00 PM – 4:00 PM</span>
          </div>

          <div className="space-y-2">
            {habits
              .filter((h) => h.timeSlot === 'afternoon')
              .map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 space-y-3 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${habit.iconBgGradient} flex items-center justify-center text-white flex-shrink-0 shadow-md`}
                      >
                        <span className="material-symbols-outlined text-[22px]">{habit.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`font-title-md font-bold truncate text-[14px] ${
                            habit.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {habit.title}
                        </div>
                        <div className="text-[12px] font-medium text-slate-500">{habit.subtitle}</div>
                      </div>
                    </div>

                    {habit.progress ? (
                      <span className="bg-orange-100/80 text-orange-800 border border-orange-200/80 font-bold text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap">
                        {habit.progress.current} / {habit.progress.target} {habit.progress.unit}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          habit.completed
                            ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/30'
                            : 'border-2 border-slate-300 bg-slate-50 text-transparent hover:border-emerald-500'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[19px] font-bold">check</span>
                      </button>
                    )}
                  </div>

                  {habit.progress && (
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-[2px]">
                      <div
                        className="bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
                        style={{ width: `${(habit.progress.current / habit.progress.target) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Evening Segment */}
        <div className="space-y-2 bg-gradient-to-b from-purple-50/60 to-transparent p-3 rounded-2xl border border-purple-100/70">
          <div className="flex items-center justify-between px-1 py-0.5">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-purple-700">
              <div className="w-5 h-5 rounded-lg bg-purple-200/80 flex items-center justify-center text-purple-800">
                <span className="material-symbols-outlined text-[14px]">nights_stay</span>
              </div>
              <span>Evening Rest</span>
            </div>
            <span className="text-[11px] font-semibold text-purple-900/60">7:00 PM – 10:00 PM</span>
          </div>

          <div className="space-y-2">
            {habits
              .filter((h) => h.timeSlot === 'evening')
              .map((habit) => (
                <div
                  key={habit.id}
                  className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${habit.iconBgGradient} flex items-center justify-center text-white flex-shrink-0 shadow-md`}
                    >
                      <span className="material-symbols-outlined text-[22px]">{habit.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-title-md font-bold text-slate-900 truncate text-[14px]">{habit.title}</div>
                      <div className="text-[12px] font-medium text-slate-500">{habit.subtitle}</div>
                    </div>
                  </div>

                  {habit.isAction ? (
                    <button
                      onClick={onOpenBloodPressure}
                      className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[12px] active:scale-95 shadow-md shadow-purple-500/25 transition-all hover:brightness-110"
                      type="button"
                    >
                      {habit.actionText}
                    </button>
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                      <span className="material-symbols-outlined text-[20px]">schedule</span>
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Weekly Vitals Radar Card */}
      <div className="w-full bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3.5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
              <span className="material-symbols-outlined text-[20px]">query_stats</span>
            </div>
            <div>
              <h3 className="font-headline-sm font-extrabold text-[16px] text-slate-900 tracking-tight leading-none">
                Weekly Vitals Radar
              </h3>
              <p className="text-[11px] font-medium text-slate-500 mt-1">7-day consistency &amp; biological metrics</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100/70 border border-emerald-200/60 text-emerald-800 text-[11px] font-extrabold tracking-wide uppercase">
            Score 94
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-lg bg-cyan-100/80 text-cyan-700 flex items-center justify-center mb-1.5">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                water_drop
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Hydration</span>
            <span className="font-headline-sm font-extrabold text-[15px] text-slate-900 mt-0.5">96%</span>
            <div className="w-full bg-slate-200 rounded-full h-1 mt-1.5 overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: '96%' }}></div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-lg bg-purple-100/80 text-purple-700 flex items-center justify-center mb-1.5">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                bedtime
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Sleep Sync</span>
            <span className="font-headline-sm font-extrabold text-[15px] text-slate-900 mt-0.5">92%</span>
            <div className="w-full bg-slate-200 rounded-full h-1 mt-1.5 overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-1.5">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                vital_signs
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Recovery</span>
            <span className="font-headline-sm font-extrabold text-[15px] text-slate-900 mt-0.5">95%</span>
            <div className="w-full bg-slate-200 rounded-full h-1 mt-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95%' }}></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-[11px]">All metrics within target band</span>
          </div>
          <button
            onClick={() => onNavigateTab('trends')}
            className="text-teal-600 font-bold hover:underline flex items-center gap-0.5 text-[11px]"
          >
            Full report <span className="material-symbols-outlined text-[13px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Mindful Thought Card with Restorative Tips Trigger */}
      <div
        onClick={onOpenRestorativeTips}
        className="relative overflow-hidden bg-gradient-to-r from-white via-white to-teal-50/50 rounded-3xl p-4 shadow-sm border border-teal-100 flex items-center gap-3.5 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
      >
        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-teal-200/70 shadow-md">
          <img
            className="w-full h-full object-cover"
            alt="Warm golden evening herbal tea and journal"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpS2A7VxcCPArT9WAJrShmoXXWaapCyEaNhamIRZodOd7SiVcJiz7mKfyzmGnibt17Efb1QZPRk4H3u1bvxaxYV0SWaQfj6VRIPArBUNiWm7AJu1NbipXcROPMsXSc8qP3Oxg_fQLfcYJk5FckMKPOfhMbC2cS7npMx_6yPpdcGIffO53uvoeraN5KH4VAZTcFlHUBAv0T7rC15pwmOsA96JqUnOjNcG1S_bCN7Hs-o6v0WOQw3GnS"
          />
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-teal-600" style={{ fontVariationSettings: "'FILL' 1" }}>
              lightbulb
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-indigo-700">
              Mindful Thought
            </span>
          </div>
          <p className="text-[13px] font-medium text-slate-800 mt-0.5 italic truncate">
            "Small daily consistency builds deep inner serenity."
          </p>
          <span className="text-[11px] font-bold text-teal-600 mt-0.5 hover:underline flex items-center gap-1">
            Read restorative tips <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </span>
        </div>
      </div>
    </div>
  );
}
