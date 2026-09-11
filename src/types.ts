export type TabType = 'today' | 'check-in' | 'trends' | 'care-plan';

export interface HabitItem {
  id: string;
  title: string;
  subtitle?: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
  completedAt?: string;
  icon: string;
  iconBgGradient: string;
  progress?: {
    current: number;
    target: number;
    unit: string;
  };
  isAction?: boolean;
  actionText?: string;
}

export interface RoutineSchedule {
  id: string;
  title: string;
  time: string;
  frequency: string;
  habitCount?: number;
  habits?: string[];
  enabled: boolean;
  icon: string;
  iconBgGradient: string;
  iconColor?: string;
  critical?: boolean;
  notes?: string;
  progress?: {
    label: string;
    percent: number;
  };
}

export interface VitalsState {
  systolic: number;
  diastolic: number;
  heartRate: number;
  oxygen: number;
  temperature: number;
  waterIntake: number;
  waterTarget: number;
  sleepHours: number;
  steps: number;
  mood: string;
  energyLevel: string; // e.g. "Balanced (7/10)"
  symptoms: string[];
  notes?: string;
  lastSynced?: string;
}

export interface EmergencyHealthData {
  bloodGroup: string;
  rhFactor: string;
  verified?: boolean;
  criticalAllergy: string;
  allergyRisk: string;
  emergencyContact: string;
  contactRelation: string;
  contactPhone: string;
}
