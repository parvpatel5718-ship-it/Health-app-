/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TodayTab from './components/TodayTab';
import CheckInTab from './components/CheckInTab';
import TrendsTab from './components/TrendsTab';
import CarePlanTab from './components/CarePlanTab';
import {
  GroundingModal,
  BloodPressureModal,
  AddRoutineModal,
  ExportReportModal,
  RestorativeTipsModal
} from './components/Modals';
import { TabType, VitalsState, EmergencyHealthData, RoutineSchedule } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('today');

  // Shared Central Vitals State
  const [vitals, setVitals] = useState<VitalsState>({
    systolic: 118,
    diastolic: 76,
    heartRate: 68,
    oxygen: 98,
    temperature: 98.4,
    mood: 'Calm',
    energyLevel: 'Balanced (7/10)',
    symptoms: ['Good Digestion', 'Clear Mind'],
    waterIntake: 1.8,
    waterTarget: 2.5,
    sleepHours: 7.5,
    steps: 6420
  });

  // Emergency Medical Pass State
  const [emergency, setEmergency] = useState<EmergencyHealthData>({
    bloodGroup: 'A+',
    rhFactor: 'Positive',
    criticalAllergy: 'Penicillin',
    allergyRisk: 'Severe Anaphylaxis',
    emergencyContact: 'Dr. Robert Vance',
    contactRelation: 'Cardiologist',
    contactPhone: '+1 (555) 234-5678'
  });

  // Modals state
  const [isGroundingOpen, setIsGroundingOpen] = useState(false);
  const [isBloodPressureOpen, setIsBloodPressureOpen] = useState(false);
  const [isAddRoutineOpen, setIsAddRoutineOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isRestorativeTipsOpen, setIsRestorativeTipsOpen] = useState(false);

  // Scroll to top whenever tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleSaveBloodPressure = (sys: number, dia: number) => {
    setVitals((prev) => ({
      ...prev,
      systolic: sys,
      diastolic: dia
    }));
  };

  const handleAddRoutine = (routine: Partial<RoutineSchedule>) => {
    // If added routine, celebrate and navigate to care plan
    console.log('Added routine:', routine);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fd] text-slate-900 flex flex-col antialiased selection:bg-teal-200 selection:text-teal-900">
      {/* Fixed Sticky Header */}
      <Header activeTab={activeTab} onNavigateTab={setActiveTab} />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full pt-16 pb-20 overflow-x-hidden">
        {activeTab === 'today' && (
          <TodayTab
            vitals={vitals}
            onUpdateVitals={setVitals}
            onNavigateTab={setActiveTab}
            onOpenGrounding={() => setIsGroundingOpen(true)}
            onOpenRestorativeTips={() => setIsRestorativeTipsOpen(true)}
            onOpenBloodPressure={() => setIsBloodPressureOpen(true)}
          />
        )}

        {activeTab === 'check-in' && (
          <CheckInTab
            vitals={vitals}
            onUpdateVitals={setVitals}
            onOpenGrounding={() => setIsGroundingOpen(true)}
            onOpenBloodPressure={() => setIsBloodPressureOpen(true)}
          />
        )}

        {activeTab === 'trends' && (
          <TrendsTab
            vitals={vitals}
            emergency={emergency}
            onOpenExportModal={() => setIsExportOpen(true)}
          />
        )}

        {activeTab === 'care-plan' && (
          <CarePlanTab
            emergency={emergency}
            onUpdateEmergency={setEmergency}
            onOpenAddRoutine={() => setIsAddRoutineOpen(true)}
          />
        )}
      </main>

      {/* Floating Dock Bottom Navigation */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Global Interactive Modals */}
      <GroundingModal
        isOpen={isGroundingOpen}
        onClose={() => setIsGroundingOpen(false)}
      />

      <BloodPressureModal
        isOpen={isBloodPressureOpen}
        onClose={() => setIsBloodPressureOpen(false)}
        currentSystolic={vitals.systolic}
        currentDiastolic={vitals.diastolic}
        onSave={handleSaveBloodPressure}
      />

      <AddRoutineModal
        isOpen={isAddRoutineOpen}
        onClose={() => setIsAddRoutineOpen(false)}
        onAdd={handleAddRoutine}
      />

      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        vitals={vitals}
        emergency={emergency}
      />

      <RestorativeTipsModal
        isOpen={isRestorativeTipsOpen}
        onClose={() => setIsRestorativeTipsOpen(false)}
      />
    </div>
  );
}
