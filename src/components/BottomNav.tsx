import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'today', label: 'Today', icon: 'wb_sunny' },
  { id: 'check-in', label: 'Check-in', icon: 'fact_check' },
  { id: 'trends', label: 'Trends', icon: 'bar_chart' },
  { id: 'care-plan', label: 'Care Plan', icon: 'health_and_safety' }
];

export default function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              type="button"
              className={`relative flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-teal-700 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-teal-50 rounded-2xl -z-10 scale-90 animate-in fade-in zoom-in-95"></div>
              )}
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[24px] transition-transform duration-200"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400",
                    transform: isActive ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {item.icon}
                </span>
                {item.id === 'check-in' && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                )}
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'font-extrabold text-teal-800' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
