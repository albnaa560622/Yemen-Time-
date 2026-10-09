import React from 'react';
import { Calculator, Table2, History, Settings } from 'lucide-react';
import { Language } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface BottomNavBarProps {
  activeTab: 'calculator' | 'table' | 'history';
  onTabChange: (tab: 'calculator' | 'table' | 'history') => void;
  onOpenSettings: () => void;
  language: Language;
  historyCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  onOpenSettings,
  language,
  historyCount,
}) => {
  const isAr = language === 'ar';

  return (
    <nav className="sticky bottom-0 z-40 bg-[#1A1A22]/95 backdrop-blur-lg border-t border-[#2A2A35] px-2 pt-2 pb-3 sm:py-2 flex items-center justify-around shadow-lg">
      {/* Calculator Tab */}
      <button
        onClick={() => {
          triggerHaptic('light');
          onTabChange('calculator');
        }}
        className={`flex-1 flex flex-col items-center justify-center py-2 min-h-[46px] rounded-2xl transition-all ${
          activeTab === 'calculator'
            ? 'text-[#0DCAF0] bg-[#0DCAF0]/10 font-bold'
            : 'text-[#ADB5BD] hover:text-[#F8F9FA]'
        }`}
      >
        <Calculator className={`w-5 h-5 mb-0.5 ${activeTab === 'calculator' ? 'scale-110 text-[#0DCAF0]' : ''}`} />
        <span className="text-[11px] font-medium">{isAr ? 'الحاسبة' : 'Calculator'}</span>
      </button>

      {/* Grade Table Tab */}
      <button
        onClick={() => {
          triggerHaptic('light');
          onTabChange('table');
        }}
        className={`flex-1 flex flex-col items-center justify-center py-2 min-h-[46px] rounded-2xl transition-all ${
          activeTab === 'table'
            ? 'text-[#0DCAF0] bg-[#0DCAF0]/10 font-bold'
            : 'text-[#ADB5BD] hover:text-[#F8F9FA]'
        }`}
      >
        <Table2 className={`w-5 h-5 mb-0.5 ${activeTab === 'table' ? 'scale-110 text-[#0DCAF0]' : ''}`} />
        <span className="text-[11px] font-medium">{isAr ? 'جدول الدرجات' : 'Grade Table'}</span>
      </button>

      {/* History Tab */}
      <button
        onClick={() => {
          triggerHaptic('light');
          onTabChange('history');
        }}
        className={`relative flex-1 flex flex-col items-center justify-center py-2 min-h-[46px] rounded-2xl transition-all ${
          activeTab === 'history'
            ? 'text-[#0DCAF0] bg-[#0DCAF0]/10 font-bold'
            : 'text-[#ADB5BD] hover:text-[#F8F9FA]'
        }`}
      >
        <div className="relative">
          <History className={`w-5 h-5 mb-0.5 ${activeTab === 'history' ? 'scale-110 text-[#0DCAF0]' : ''}`} />
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-[#0DCAF0] text-[#121212] font-bold text-[9px] rounded-full min-w-[14px] text-center">
              {historyCount}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium">{isAr ? 'السجل' : 'History'}</span>
      </button>

      {/* Settings Tab */}
      <button
        onClick={() => {
          triggerHaptic('light');
          onOpenSettings();
        }}
        className="flex-1 flex flex-col items-center justify-center py-2 min-h-[46px] rounded-2xl transition-all text-[#ADB5BD] hover:text-[#F8F9FA]"
      >
        <Settings className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-medium">{isAr ? 'الإعدادات' : 'Settings'}</span>
      </button>
    </nav>
  );
};
