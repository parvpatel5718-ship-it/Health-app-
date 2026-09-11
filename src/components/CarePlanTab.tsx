import { useState } from 'react';
import { RoutineSchedule, EmergencyHealthData } from '../types';

interface CarePlanTabProps {
  emergency: EmergencyHealthData;
  onUpdateEmergency: (updater: (prev: EmergencyHealthData) => EmergencyHealthData) => void;
  onOpenAddRoutine: () => void;
}

export default function CarePlanTab({
  emergency,
  onOpenAddRoutine
}: CarePlanTabProps) {
  const [routines, setRoutines] = useState<RoutineSchedule[]>([
    {
      id: 'r-1',
      title: 'Morning Anchor',
      time: '08:00 AM',
      frequency: 'Daily',
      habits: ['Lemon water', '15m Sun Salutation', 'Vit D3 (2000IU)', 'Omega-3 (1000mg)'],
      habitCount: 4,
      enabled: true,
      icon: 'wb_sunny',
      iconBgGradient: 'from-amber-400 to-orange-500'
    },
    {
      id: 'r-2',
      title: 'Midday Metabolic Boost',
      time: '01:30 PM',
      frequency: 'Mon - Fri',
      habits: ['20m Post-meal stroll', 'CoQ10 100mg with lunch'],
      habitCount: 2,
      enabled: true,
      icon: 'directions_walk',
      iconBgGradient: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'r-3',
      title: 'Evening Wind-down & BP',
      time: '08:30 PM',
      frequency: 'Daily',
      habits: ['Seated BP Check (Omron)', 'Magnesium Glycinate 300mg', '4-7-8 Breathwork'],
      habitCount: 3,
      enabled: true,
      icon: 'bedtime',
      iconBgGradient: 'from-purple-600 to-indigo-700'
    }
  ]);

  const [devices, setDevices] = useState([
    {
      id: 'd-1',
      name: 'OMRON Evolv BP Monitor',
      connection: 'Bluetooth LE',
      status: 'Synced 12m ago',
      battery: '94%',
      icon: 'speed',
      color: 'rose'
    },
    {
      id: 'd-2',
      name: 'Apple Watch Series 9',
      connection: 'Continuous SpO2 & HR',
      status: 'Live',
      battery: '82%',
      icon: 'watch',
      color: 'emerald'
    },
    {
      id: 'd-3',
      name: 'Withings Body+ Smart Scale',
      connection: 'Wi-Fi Auto-sync',
      status: 'Synced today at 8:10 AM',
      battery: 'Full',
      icon: 'scale',
      color: 'indigo'
    }
  ]);

  const [showQRModal, setShowQRModal] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [devicePairing, setDevicePairing] = useState(false);

  const toggleRoutine = (id: string) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText?.(emergency.contactPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handlePairNewDevice = () => {
    setDevicePairing(true);
    setTimeout(() => {
      setDevices((prev) => [
        ...prev,
        {
          id: `d-${Date.now()}`,
          name: 'Dexcom G7 CGM',
          connection: 'Bluetooth Continuous',
          status: 'Paired Just Now',
          battery: '100%',
          icon: 'sensors',
          color: 'teal'
        }
      ]);
      setDevicePairing(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full px-4 pb-8 space-y-4 max-w-lg mx-auto">
      {/* Screen Header */}
      <div className="flex items-start justify-between pt-2">
        <div>
          <h1 className="font-headline-md text-[24px] text-slate-900 tracking-tight font-extrabold bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-900 bg-clip-text text-transparent">
            Care Plan &amp; Health Hub
          </h1>
          <p className="text-xs text-slate-500 font-medium">Personalized Protocols &amp; Clinical Baseline</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
          <span className="material-symbols-outlined text-[15px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
          <span>Verified Care Plan</span>
        </div>
      </div>

      {/* Emergency Health Pass (Red-Rose Gradient Banner) */}
      <div className="relative overflow-hidden rounded-3xl p-4 bg-gradient-to-br from-rose-600 via-red-600 to-amber-600 text-white shadow-xl shadow-rose-600/25 border border-red-300/40 space-y-3">
        <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-amber-400/25 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-1 ring-white/40 shadow-inner">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                emergency
              </span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-200">
                Paramedic Health Pass
              </span>
              <h2 className="font-headline-sm text-lg font-extrabold text-white tracking-tight">
                Emergency Medical Card
              </h2>
            </div>
          </div>
          <button
            onClick={() => setShowQRModal(true)}
            className="px-3 py-1.5 rounded-full bg-white text-red-600 font-bold text-xs shadow-md hover:bg-red-50 active:scale-95 transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
            <span>Show QR</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 relative z-10">
          {/* Blood Group */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-2.5 border border-white/15">
            <span className="text-[10px] text-red-200 font-bold uppercase tracking-wider block">Blood Group</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-extrabold text-white font-headline-sm">
                {emergency.bloodGroup} {emergency.rhFactor}
              </span>
              <span className="text-[10px] text-red-200">Compatible</span>
            </div>
          </div>

          {/* Critical Allergy */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-2.5 border border-white/15">
            <span className="text-[10px] text-red-200 font-bold uppercase tracking-wider block">Critical Allergy</span>
            <div className="flex items-baseline gap-1 mt-0.5 truncate">
              <span className="text-base font-extrabold text-yellow-300 font-headline-sm truncate">
                {emergency.criticalAllergy}
              </span>
            </div>
            <span className="text-[9px] text-white/90 font-bold bg-red-700/80 px-1.5 py-0.2 rounded mt-0.5 inline-block">
              {emergency.allergyRisk}
            </span>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] text-red-200 font-bold uppercase tracking-wider block">
              Primary Physician Contact
            </span>
            <div className="font-bold text-white text-xs truncate mt-0.5">
              {emergency.emergencyContact} • {emergency.contactRelation}
            </div>
            <div className="text-[11px] text-white/80">{emergency.contactPhone}</div>
          </div>
          <button
            onClick={handleCopyPhone}
            className="px-3 py-1.5 rounded-xl bg-white/25 hover:bg-white/35 active:scale-95 text-white font-bold text-xs flex items-center gap-1 transition-all"
          >
            <span className="material-symbols-outlined text-[15px]">call</span>
            <span>{copiedPhone ? 'Copied!' : 'Call'}</span>
          </button>
        </div>
      </div>

      {/* Routine Schedules & Medication Protocols */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
              <span className="material-symbols-outlined text-[18px]">calendar_clock</span>
            </div>
            <h2 className="font-title-lg font-bold text-slate-900 text-base">Active Care Protocols</h2>
          </div>
          <button
            onClick={onOpenAddRoutine}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>New Routine</span>
          </button>
        </div>

        <div className="space-y-3">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className={`bg-white rounded-3xl p-4 shadow-sm border transition-all ${
                routine.enabled ? 'border-slate-200/80' : 'border-slate-100 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${routine.iconBgGradient} flex items-center justify-center text-white shadow-md`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{routine.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-title-md font-bold text-slate-900 text-[15px]">{routine.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-teal-700">{routine.time}</span>
                      <span>•</span>
                      <span>{routine.frequency}</span>
                    </div>
                  </div>
                </div>

                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={() => toggleRoutine(routine.id)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                    routine.enabled ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      routine.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              {/* Habits List Pill Tags */}
              <div className="flex flex-wrap gap-1.5 pt-3 mt-2 border-t border-slate-100">
                {routine.habits.map((habit, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                    {habit}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Devices & Sensor Integrations */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              <span className="material-symbols-outlined text-[18px]">devices_other</span>
            </div>
            <h2 className="font-title-lg font-bold text-slate-900 text-base">Paired Medical Devices</h2>
          </div>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            3 Connected
          </span>
        </div>

        <div className="space-y-2.5">
          {devices.map((device) => (
            <div
              key={device.id}
              className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <span className="material-symbols-outlined text-[20px]">{device.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{device.name}</h4>
                  <p className="text-[11px] text-slate-500">{device.connection}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {device.status}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Batt: {device.battery}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handlePairNewDevice}
          disabled={devicePairing}
          className="w-full py-3 rounded-2xl bg-white border border-dashed border-teal-300 hover:border-teal-500 text-teal-700 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">
            {devicePairing ? 'sync' : 'bluetooth_searching'}
          </span>
          <span>{devicePairing ? 'Scanning for Nearby Devices...' : '+ Pair New Medical Device'}</span>
        </button>
      </div>

      {/* Primary Care Team */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center text-pink-700 font-bold">
              <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
            </div>
            <h2 className="font-title-lg font-bold text-slate-900 text-base">Care Team &amp; Clinicians</h2>
          </div>
          <span className="text-xs text-purple-700 font-bold">Hospital Network</span>
        </div>

        <div className="bg-gradient-to-r from-white to-slate-50 rounded-3xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-indigo-500/20">
              RV
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Dr. Robert Vance, MD</h4>
                <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">FACC</span>
              </div>
              <p className="text-xs text-slate-500">Metropolitan Cardiology Institute</p>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">event</span>
                <span>Next Follow-up: Nov 12, 10:30 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HIPAA & Privacy Lock Card */}
      <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <span className="material-symbols-outlined text-slate-500 text-[18px] mt-0.5">lock</span>
        <div>
          <strong className="text-slate-800">End-to-End Encrypted Health Vault:</strong> Your vitals, symptom journals, and emergency data are protected under HIPAA-compliant 256-bit encryption. Data is shared exclusively with your paired clinician team.
        </div>
      </div>

      {/* Emergency QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-red-200 text-center">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">emergency</span> Paramedic QR Pass
              </span>
              <button onClick={() => setShowQRModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="my-5 p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 inline-block shadow-inner">
              {/* High Contrast Scalable QR Code Matrix */}
              <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100">
                {/* QR Background & Pattern */}
                <rect fill="#ffffff" height="100" width="100" x="0" y="0" />
                {/* Position detection corners */}
                <rect fill="#1e293b" height="20" width="20" x="5" y="5" />
                <rect fill="#ffffff" height="12" width="12" x="9" y="9" />
                <rect fill="#1e293b" height="6" width="6" x="12" y="12" />

                <rect fill="#1e293b" height="20" width="20" x="75" y="5" />
                <rect fill="#ffffff" height="12" width="12" x="79" y="9" />
                <rect fill="#1e293b" height="6" width="6" x="82" y="12" />

                <rect fill="#1e293b" height="20" width="20" x="5" y="75" />
                <rect fill="#ffffff" height="12" width="12" x="9" y="79" />
                <rect fill="#1e293b" height="6" width="6" x="12" y="82" />

                {/* Medical Cross Center */}
                <rect fill="#dc2626" height="16" width="6" x="47" y="42" rx="1" />
                <rect fill="#dc2626" height="6" width="16" x="42" y="47" rx="1" />

                {/* Randomized data dots */}
                <rect fill="#1e293b" height="4" width="4" x="30" y="10" />
                <rect fill="#1e293b" height="4" width="4" x="38" y="15" />
                <rect fill="#1e293b" height="4" width="4" x="55" y="10" />
                <rect fill="#1e293b" height="4" width="4" x="65" y="20" />
                <rect fill="#1e293b" height="4" width="4" x="10" y="35" />
                <rect fill="#1e293b" height="4" width="4" x="25" y="35" />
                <rect fill="#1e293b" height="4" width="4" x="70" y="40" />
                <rect fill="#1e293b" height="4" width="4" x="85" y="45" />
                <rect fill="#1e293b" height="4" width="4" x="35" y="65" />
                <rect fill="#1e293b" height="4" width="4" x="50" y="70" />
                <rect fill="#1e293b" height="4" width="4" x="65" y="80" />
                <rect fill="#1e293b" height="4" width="4" x="80" y="75" />
              </svg>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <p className="font-bold text-slate-900">Sarah Conner • Blood {emergency.bloodGroup} {emergency.rhFactor}</p>
              <p className="text-red-600 font-semibold">Allergy: {emergency.criticalAllergy}</p>
              <p className="text-[10px] text-slate-400">Emergency responders can scan without unlocking device</p>
            </div>

            <button
              onClick={() => setShowQRModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs active:scale-95 transition-transform"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
