import { useState } from 'react';
import confetti from 'canvas-confetti';
import { VitalsState } from '../types';

interface CheckInTabProps {
  vitals: VitalsState;
  onUpdateVitals: (updater: (prev: VitalsState) => VitalsState) => void;
  onOpenGrounding: () => void;
  onOpenBloodPressure: () => void;
}

const MOOD_OPTIONS = [
  { id: 'energized', label: 'Energized', icon: '⚡', gradient: 'from-amber-400 to-orange-500' },
  { id: 'calm', label: 'Calm', icon: '🌿', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'neutral', label: 'Neutral', icon: '☁️', gradient: 'from-sky-400 to-blue-600' },
  { id: 'fatigued', label: 'Fatigued', icon: '🥱', gradient: 'from-purple-500 to-indigo-600' },
  { id: 'anxious', label: 'Anxious', icon: '🌀', gradient: 'from-rose-500 to-pink-600' }
];

const ENERGY_LEVELS = [
  { id: 'low', label: 'Low', score: '2/10', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'mod', label: 'Mod', score: '5/10', gradient: 'from-teal-500 to-emerald-500' },
  { id: 'balanced', label: 'Balanced', score: '7/10', gradient: 'from-amber-500 to-orange-500' },
  { id: 'high', label: 'High', score: '8/10', gradient: 'from-orange-500 to-rose-500' },
  { id: 'peak', label: 'Peak', score: '10/10', gradient: 'from-rose-500 to-purple-600' }
];

const SYMPTOM_OPTIONS = [
  { id: 'headache', label: 'Headache', icon: 'sentiment_neutral', color: 'indigo' },
  { id: 'tension', label: 'Muscle Tension', icon: 'fitness_center', color: 'amber' },
  { id: 'reflux', label: 'Acid Reflux', icon: 'local_fire_department', color: 'rose' },
  { id: 'digestion', label: 'Good Digestion', icon: 'task_alt', color: 'emerald' },
  { id: 'back', label: 'Back Stiffness', icon: 'accessibility_new', color: 'blue' },
  { id: 'clearmind', label: 'Clear Mind', icon: 'sparkles', color: 'purple' }
];

export default function CheckInTab({
  vitals,
  onUpdateVitals,
  onOpenGrounding,
  onOpenBloodPressure
}: CheckInTabProps) {
  const [reflection, setReflection] = useState(
    'Felt relaxed after morning walk, slight afternoon caffeine crash around 2pm.'
  );
  const [isDictating, setIsDictating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const selectedEnergyObj = ENERGY_LEVELS.find((e) => vitals.energyLevel.includes(e.label)) || ENERGY_LEVELS[2];

  const handleSelectMood = (moodLabel: string) => {
    onUpdateVitals((prev) => ({ ...prev, mood: moodLabel }));
  };

  const handleSelectEnergy = (energy: typeof ENERGY_LEVELS[0]) => {
    onUpdateVitals((prev) => ({ ...prev, energyLevel: `${energy.label} (${energy.score})` }));
  };

  const toggleSymptom = (label: string) => {
    onUpdateVitals((prev) => {
      const exists = prev.symptoms.includes(label);
      const nextSymptoms = exists
        ? prev.symptoms.filter((s) => s !== label)
        : [...prev.symptoms, label];
      return { ...prev, symptoms: nextSymptoms };
    });
  };

  const toggleVoiceDictation = () => {
    if (isDictating) {
      setIsDictating(false);
      return;
    }

    // Attempt browser SpeechRecognition if available
    const win = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        onstart: () => void;
        onresult: (e: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        onstart: () => void;
        onresult: (e: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      };
    };

    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.onstart = () => setIsDictating(true);
        recognition.onresult = (e) => {
          const text = e.results[0][0].transcript;
          setReflection((prev) => (prev ? `${prev} ${text}` : text));
          setIsDictating(false);
        };
        recognition.onerror = () => setIsDictating(false);
        recognition.onend = () => setIsDictating(false);
        recognition.start();
        return;
      } catch {
        // Fallback below
      }
    }

    // Simulated dictation helper if microphone permission is not granted
    setIsDictating(true);
    setTimeout(() => {
      setReflection((prev) => `${prev} Hydration was on point today, feeling refreshed.`);
      setIsDictating(false);
    }, 1800);
  };

  const handleSaveCheckIn = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 } });
      } catch {
        // ignore
      }
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2500);
    }, 800);
  };

  return (
    <div className="flex flex-col w-full px-4 space-y-4 pb-8 max-w-lg mx-auto">
      {/* Screen Header & Calm Greeting */}
      <div className="flex items-start justify-between pt-2">
        <div className="flex flex-col space-y-0.5">
          <h1 className="font-headline-sm text-headline-sm font-extrabold bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-900 bg-clip-text text-transparent tracking-tight">
            Daily Health Check-in
          </h1>
          <p className="font-body-md text-slate-500 text-xs">Log your vitals, symptoms &amp; inner flow</p>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-md shadow-emerald-500/25">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_fire_department
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase">Day 14 Streak</span>
        </div>
      </div>

      {/* 30-Sec Grounding Banner (Vibrant Sunset/Aurora Gradient) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 p-4 text-white shadow-lg shadow-pink-500/25 flex items-center justify-between">
        <div className="absolute -right-6 -bottom-10 w-36 h-36 rounded-full bg-amber-400/30 blur-2xl pointer-events-none"></div>
        <div className="absolute -left-6 -top-10 w-28 h-28 rounded-full bg-cyan-400/30 blur-xl pointer-events-none"></div>

        <div className="flex items-center space-x-3.5 z-10">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-inner border border-white/30 animate-breathe">
            <span className="material-symbols-outlined text-[22px]">air</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-title-md text-title-md text-white font-bold leading-tight">30-Sec Grounding</span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-white/25 text-white uppercase tracking-wider">
                Sound On
              </span>
            </div>
            <span className="text-xs text-white/90 font-medium">Breathe in sync before logging vitals</span>
          </div>
        </div>

        <button
          onClick={onOpenGrounding}
          className="z-10 px-4 py-2 rounded-full bg-white text-pink-600 font-bold text-xs shadow-md hover:bg-pink-50 transition-transform active:scale-95 flex items-center space-x-1"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            play_arrow
          </span>
          <span>Begin</span>
        </button>
      </div>

      {/* Vitals Entry Grid with Vivid Individual Card Theming */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              <span className="material-symbols-outlined text-[18px]">monitor_heart</span>
            </div>
            <h2 className="font-title-lg text-title-lg text-slate-800 font-bold">Vitals Overview</h2>
          </div>
          <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Synced 9:42 AM</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Blood Pressure Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50/70 to-pink-50/80 p-3.5 rounded-2xl border border-rose-200/80 shadow-[0_4px_16px_rgba(244,63,94,0.08)] flex flex-col justify-between space-y-3 transition-all hover:shadow-md active:scale-[0.98]">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/30">
                <span className="material-symbols-outlined text-[18px]">speed</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 border border-rose-300/60 text-[10px] font-bold tracking-wide">
                Optimal
              </span>
            </div>
            <div>
              <span className="text-xs text-rose-900/70 font-semibold block">Blood Pressure</span>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span className="text-xl text-rose-950 font-extrabold tracking-tight font-headline-sm">
                  {vitals.systolic}/{vitals.diastolic}
                </span>
                <span className="text-[11px] text-rose-600 font-semibold">mmHg</span>
              </div>
              {/* Pulse wave SVG */}
              <div className="mt-1 h-4 w-full flex items-center overflow-hidden opacity-75">
                <svg className="w-full h-full text-rose-400" fill="none" preserveAspectRatio="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 100 20">
                  <path d="M0 10 Q10 10 20 10 T30 4 T35 18 T40 10 T60 10 T70 3 T75 17 T80 10 T100 10" />
                </svg>
              </div>
            </div>
            <button
              onClick={onOpenBloodPressure}
              className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-sm shadow-rose-500/30 transition-all active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">add_circle</span>
              <span>Log New</span>
            </button>
          </div>

          {/* Resting Heart Rate Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-rose-50/60 to-pink-50 p-3.5 rounded-2xl border border-red-200/80 shadow-[0_4px_16px_rgba(239,68,68,0.08)] flex flex-col justify-between space-y-3 transition-all hover:shadow-md active:scale-[0.98]">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-red-500/30">
                <span className="material-symbols-outlined text-[19px] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
              </div>
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-300/50">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                <span className="text-[10px] font-bold text-red-700">Live</span>
              </span>
            </div>
            <div>
              <span className="text-xs text-red-900/70 font-semibold block">Heart Rate</span>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span className="text-xl text-red-950 font-extrabold tracking-tight font-headline-sm">{vitals.heartRate}</span>
                <span className="text-[11px] text-red-600 font-semibold">bpm</span>
              </div>
              {/* Heartbeat ECG line */}
              <div className="mt-1 h-4 w-full flex items-center overflow-hidden">
                <svg className="w-full h-full text-red-500" fill="none" preserveAspectRatio="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 100 20">
                  <path d="M0 10 L25 10 L30 2 L35 18 L40 7 L45 13 L50 10 L100 10" />
                </svg>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 py-1 px-2 rounded-xl bg-white/80 border border-red-200 text-red-700 shadow-xs">
              <span className="material-symbols-outlined text-[15px] text-emerald-600 font-bold">trending_flat</span>
              <span className="text-[11px] font-bold truncate">Calm &amp; Steady today</span>
            </div>
          </div>

          {/* Blood Oxygen Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-teal-50/60 to-emerald-50/70 p-3.5 rounded-2xl border border-cyan-200/80 shadow-[0_4px_16px_rgba(6,182,212,0.08)] flex flex-col justify-between space-y-3 transition-all hover:shadow-md active:scale-[0.98]">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/30">
                <span className="material-symbols-outlined text-[19px]">airwave</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-800 border border-cyan-300/60 text-[10px] font-bold">
                Optimal
              </span>
            </div>
            <div>
              <span className="text-xs text-teal-900/70 font-semibold block">Oxygen (SpO2)</span>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span className="text-xl text-teal-950 font-extrabold tracking-tight font-headline-sm">{vitals.oxygen}%</span>
                <span className="text-[11px] text-teal-600 font-semibold">saturation</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold text-teal-700 mb-1">
                <span>Normal 95-100</span>
                <span>Excellent</span>
              </div>
              <div className="w-full bg-cyan-100 rounded-full h-2 overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2 rounded-full shadow-sm" style={{ width: `${vitals.oxygen}%` }}></div>
              </div>
            </div>
          </div>

          {/* Temperature Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/70 to-yellow-50 p-3.5 rounded-2xl border border-amber-200/80 shadow-[0_4px_16px_rgba(245,158,11,0.08)] flex flex-col justify-between space-y-3 transition-all hover:shadow-md active:scale-[0.98]">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/30">
                <span className="material-symbols-outlined text-[19px]">device_thermostat</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 border border-amber-300/60 text-[10px] font-bold">
                Smart Sync
              </span>
            </div>
            <div>
              <span className="text-xs text-amber-900/70 font-semibold block">Body Temp</span>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span className="text-xl text-amber-950 font-extrabold tracking-tight font-headline-sm">{vitals.temperature}</span>
                <span className="text-[11px] text-amber-600 font-semibold">°F</span>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 py-1 px-2 rounded-xl bg-white/80 border border-amber-200 text-amber-800 shadow-xs">
              <span className="material-symbols-outlined text-[15px] text-amber-600 font-bold">verified</span>
              <span className="text-[11px] font-bold truncate">Baseline healthy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mood & Emotional State Selector */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
              <span className="material-symbols-outlined text-[18px]">psychology_alt</span>
            </div>
            <h2 className="font-title-lg text-title-lg text-slate-800 font-bold">Emotional State</h2>
          </div>
          <span className="text-xs font-bold text-indigo-600">How do you feel?</span>
        </div>

        <div className="flex space-x-2.5 overflow-x-auto pb-1.5 pt-0.5 -mx-4 px-4 no-scrollbar">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = vitals.mood.toLowerCase().includes(mood.label.toLowerCase());
            return (
              <button
                key={mood.id}
                onClick={() => handleSelectMood(mood.label)}
                type="button"
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all active:scale-95 font-semibold text-xs ${
                  isSelected
                    ? `bg-gradient-to-r ${mood.gradient} text-white shadow-lg ring-2 ring-emerald-300/50 font-bold`
                    : 'bg-white border border-slate-200 text-slate-700 shadow-sm hover:border-slate-300'
                }`}
              >
                <span className="text-base">{mood.icon}</span>
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Energy Level Segmented Bar */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <h2 className="font-title-lg text-title-lg text-slate-800 font-bold">Energy Level</h2>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm bg-gradient-to-r ${selectedEnergyObj.gradient}`}>
            {vitals.energyLevel}
          </span>
        </div>

        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center justify-between space-x-1 border border-slate-200/80 shadow-inner">
          {ENERGY_LEVELS.map((energy) => {
            const isSelected = vitals.energyLevel.includes(energy.label);
            return (
              <button
                key={energy.id}
                onClick={() => handleSelectEnergy(energy)}
                type="button"
                className={`flex-1 py-2 rounded-xl text-center text-xs font-bold transition-all active:scale-95 ${
                  isSelected
                    ? `bg-gradient-to-r ${energy.gradient} text-white shadow-md`
                    : 'text-slate-600 hover:bg-white'
                }`}
              >
                {energy.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Physical Signals & Symptoms Tag Cloud */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
              <span className="material-symbols-outlined text-[18px]">vital_signs</span>
            </div>
            <h2 className="font-title-lg text-title-lg text-slate-800 font-bold">Physical Signals &amp; Symptoms</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Tap to toggle</span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {SYMPTOM_OPTIONS.map((sym) => {
            const isActive = vitals.symptoms.includes(sym.label);
            return (
              <button
                key={sym.id}
                onClick={() => toggleSymptom(sym.label)}
                type="button"
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all active:scale-95 text-xs ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border border-emerald-600 shadow-md shadow-emerald-500/25 font-bold'
                    : 'bg-white border border-slate-200 text-slate-700 font-medium hover:border-indigo-300'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${isActive ? 'text-white' : 'text-slate-500'}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}
                >
                  {sym.icon}
                </span>
                <span>{sym.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes & Reflection Area */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
            </div>
            <h2 className="font-title-lg text-title-lg text-slate-800 font-bold">Daily Reflection</h2>
          </div>
          <span className="text-xs text-purple-600 font-semibold">Private Log</span>
        </div>

        <div className="relative bg-white rounded-2xl p-4 border border-indigo-100 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-transparent transition-all">
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="w-full bg-transparent resize-none outline-none text-sm text-slate-800 placeholder:text-slate-400 font-medium"
            placeholder="Jot down context, meals, or feelings..."
            rows={3}
          />
          <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-100">
            <button
              onClick={toggleVoiceDictation}
              className={`flex items-center space-x-1.5 text-xs font-semibold transition-colors ${
                isDictating ? 'text-rose-600 animate-pulse font-bold' : 'text-indigo-600 hover:text-indigo-800'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">{isDictating ? 'mic_active' : 'mic'}</span>
              <span>{isDictating ? 'Listening...' : 'Voice Dictate'}</span>
            </button>
            <span className="text-[11px] text-slate-400 font-medium">{reflection.length} chars</span>
          </div>
        </div>
      </div>

      {/* Warm Affirmation Card */}
      <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 text-white flex items-start space-x-3.5 shadow-lg shadow-indigo-500/20">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 text-white mt-0.5 border border-white/30">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
        </div>
        <div className="flex flex-col z-10">
          <span className="font-title-md text-title-md text-white font-bold">Consistency is gentle momentum</span>
          <p className="text-xs text-white/90 mt-0.5">Logging mindfully nurtures early prevention and vibrant body intuition.</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          onClick={handleSaveCheckIn}
          disabled={saveStatus !== 'idle'}
          className={`w-full h-14 rounded-full text-white font-bold text-sm shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center space-x-2.5 ${
            saveStatus === 'saved'
              ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 shadow-rose-500/40'
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-teal-500/35 hover:shadow-teal-500/50'
          }`}
          type="button"
        >
          {saveStatus === 'saving' ? (
            <>
              <span className="material-symbols-outlined text-[22px] animate-spin">refresh</span>
              <span>Saving to Vitality Log...</span>
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <span className="material-symbols-outlined text-[22px]">done_all</span>
              <span>Checked In Successfully!</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span>Save Daily Check-in</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
