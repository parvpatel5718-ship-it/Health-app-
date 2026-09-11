import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RoutineSchedule, VitalsState, EmergencyHealthData } from '../types';

// Web Audio synthesizer chime for peaceful grounding
function playChime(freq = 528) {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 2.6);
  } catch {
    // AudioContext blocked or not supported
  }
}

// 1. 30-Second Grounding Breathwork Modal
export function GroundingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
      setSecondsLeft(30);
      setPhase('Inhale');
      return;
    }
    setIsRunning(true);
    playChime(432);
  }, [isOpen]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) {
      if (secondsLeft === 0) {
        playChime(528);
        try {
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      }
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        const next = s - 1;
        const cycle = (30 - next) % 12;
        if (cycle < 4) setPhase('Inhale');
        else if (cycle < 8) setPhase('Hold');
        else setPhase('Exhale');
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#0e2a22] to-[#0a172c] border border-emerald-500/30 p-6 text-white text-center shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[14px]">spa</span>
          30-Second Grounding
        </div>

        <h3 className="text-xl font-headline-sm font-extrabold text-white mt-1">
          {secondsLeft > 0 ? phase : 'Session Complete'}
        </h3>
        <p className="text-xs text-teal-100/80 mt-1">
          {secondsLeft > 0 ? 'Follow the gentle rhythm to settle your heart rate.' : 'You are centered and ready to log.'}
        </p>

        {/* Breathing Ring Animation */}
        <div className="relative w-44 h-44 mx-auto my-6 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full border-4 border-emerald-400/40 transition-all duration-1000 ${
              phase === 'Inhale' ? 'scale-110 border-cyan-400' : phase === 'Hold' ? 'scale-105 border-emerald-400' : 'scale-90 border-teal-500'
            }`}
          ></div>
          <div
            className={`w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center shadow-xl shadow-teal-500/30 transition-transform duration-1000 ${
              phase === 'Inhale' ? 'scale-115' : phase === 'Hold' ? 'scale-105' : 'scale-85'
            }`}
          >
            <div className="text-center">
              <span className="text-3xl font-black text-slate-950 font-headline-sm">{secondsLeft}</span>
              <span className="block text-[10px] uppercase font-bold text-slate-900 tracking-wider">Seconds</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              playChime(639);
              setSecondsLeft(30);
              setIsRunning(true);
            }}
            className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs active:scale-95 transition-all"
          >
            Restart
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/25 active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Log Blood Pressure Modal
export function BloodPressureModal({
  isOpen,
  onClose,
  currentSystolic,
  currentDiastolic,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  currentSystolic: number;
  currentDiastolic: number;
  onSave: (sys: number, dia: number) => void;
}) {
  const [sys, setSys] = useState(currentSystolic);
  const [dia, setDia] = useState(currentDiastolic);

  useEffect(() => {
    setSys(currentSystolic);
    setDia(currentDiastolic);
  }, [currentSystolic, currentDiastolic]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-rose-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-rose-500/30">
              <span className="material-symbols-outlined text-[20px]">speed</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Log Blood Pressure</h3>
              <p className="text-xs text-slate-500">Seated and rested for 5 minutes</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 my-5">
          <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200/80">
            <label className="text-[11px] font-bold text-rose-900 uppercase tracking-wider block">Systolic</label>
            <div className="flex items-baseline gap-1 mt-1">
              <input
                type="number"
                value={sys}
                onChange={(e) => setSys(Number(e.target.value))}
                className="w-full text-2xl font-black text-rose-950 bg-transparent outline-none border-b border-rose-300 font-headline-sm"
              />
              <span className="text-xs font-semibold text-rose-700">mmHg</span>
            </div>
          </div>

          <div className="bg-orange-50/70 p-3.5 rounded-2xl border border-orange-200/80">
            <label className="text-[11px] font-bold text-orange-900 uppercase tracking-wider block">Diastolic</label>
            <div className="flex items-baseline gap-1 mt-1">
              <input
                type="number"
                value={dia}
                onChange={(e) => setDia(Number(e.target.value))}
                className="w-full text-2xl font-black text-orange-950 bg-transparent outline-none border-b border-orange-300 font-headline-sm"
              />
              <span className="text-xs font-semibold text-orange-700">mmHg</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
          <span>
            Status: <strong className="text-emerald-700">{sys < 120 && dia < 80 ? 'Optimal / Normal' : 'Prehypertension'}</strong>
          </span>
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(sys, dia);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-xs shadow-md shadow-rose-500/25 hover:brightness-105 active:scale-95 transition-all"
          >
            Save Reading
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. Add New Routine Modal
export function AddRoutineModal({
  isOpen,
  onClose,
  onAdd
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (routine: Partial<RoutineSchedule>) => void;
}) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00 AM');
  const [frequency, setFrequency] = useState('Daily');
  const [habit1, setHabit1] = useState('');
  const [habit2, setHabit2] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-teal-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <span className="material-symbols-outlined text-[20px]">add_task</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base">New Wellness Routine</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-3 my-4">
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Routine Name</label>
            <input
              type="text"
              placeholder="e.g. Afternoon Focus Anchor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Time</label>
              <input
                type="text"
                placeholder="2:30 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-teal-500 focus:outline-none bg-white"
              >
                <option>Daily</option>
                <option>Mon - Fri</option>
                <option>Weekends</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Habits Included</label>
            <input
              type="text"
              placeholder="Habit 1 (e.g. 10m Post-lunch walk)"
              value={habit1}
              onChange={(e) => setHabit1(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm mb-1.5 focus:border-teal-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Habit 2 (e.g. Electrolyte glass)"
              value={habit2}
              onChange={(e) => setHabit2(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50">
            Cancel
          </button>
          <button
            disabled={!title.trim()}
            onClick={() => {
              onAdd({
                title: title.trim(),
                time,
                frequency,
                habits: [habit1, habit2].filter(Boolean),
                habitCount: [habit1, habit2].filter(Boolean).length || 1,
                enabled: true,
                icon: 'spa',
                iconBgGradient: 'from-emerald-500 to-teal-500'
              });
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-teal-500/25 disabled:opacity-50 hover:brightness-105 active:scale-95 transition-all"
          >
            Create Routine
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. Clinical PDF Export Preview Modal
export function ExportReportModal({
  isOpen,
  onClose,
  vitals,
  emergency
}: {
  isOpen: boolean;
  onClose: () => void;
  vitals: VitalsState;
  emergency: EmergencyHealthData;
}) {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloaded(true);
    playChime(700);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    } catch {
      // ignore
    }
    setTimeout(() => {
      setDownloaded(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">medical_services</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Clinical Health Summary</h3>
              <p className="text-xs text-slate-500">Prepared for Primary Care Physician</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Paper style document preview */}
        <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-3 font-mono">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <div>
              <div className="font-bold text-sm text-slate-900">PATIENT: SARAH CONNER</div>
              <div>DOB: 10/24/1992 • Blood: {emergency.bloodGroup} {emergency.rhFactor}</div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">VERIFIED</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>• BP: <strong>{vitals.systolic}/{vitals.diastolic} mmHg</strong></div>
            <div>• Resting HR: <strong>{vitals.heartRate} bpm</strong></div>
            <div>• Oxygen SpO2: <strong>{vitals.oxygen}%</strong></div>
            <div>• Body Temp: <strong>{vitals.temperature}°F</strong></div>
            <div>• 14-Day Streak: <strong>Active (92%)</strong></div>
            <div>• Sleep Avg: <strong>7.4 hrs</strong></div>
          </div>

          <div className="bg-red-50 p-2 rounded border border-red-200 text-red-900 text-[10px]">
            <strong>CRITICAL ALLERGY:</strong> {emergency.criticalAllergy} ({emergency.allergyRisk})
          </div>

          <div className="text-[10px] text-slate-500 pt-1">
            Generated via Serene Routine Sync • Pair Hash: 98AF-2026
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50">
            Dismiss
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-teal-500/25 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">
              {downloaded ? 'check_circle' : 'file_download'}
            </span>
            <span>{downloaded ? 'Downloaded PDF' : 'Download Clinical PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 5. Restorative Tips Modal
export function RestorativeTipsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-teal-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-600 text-[22px]">lightbulb</span>
            <h3 className="font-bold text-slate-900 text-base">Restorative Tips</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="my-4 space-y-3 text-xs text-slate-600">
          <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-100">
            <h4 className="font-bold text-teal-900 text-sm mb-0.5">1. Habit Stacking</h4>
            <p>Attach new rituals (like lemon water or stretch) directly after established anchors (brushing teeth).</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
            <h4 className="font-bold text-amber-900 text-sm mb-0.5">2. Evening Wind-down</h4>
            <p>Dim overhead lights 45 minutes before sleep to allow endogenous melatonin synthesis.</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100">
            <h4 className="font-bold text-purple-900 text-sm mb-0.5">3. Steady Hydration</h4>
            <p>Sipping 200ml every 90 minutes provides superior cellular retention than chugging large amounts at once.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-700/20 active:scale-95 transition-all"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
