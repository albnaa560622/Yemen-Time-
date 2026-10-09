import React from 'react';
import { Settings, RotateCcw, Table2, History, Smartphone, Globe, Calculator, Download } from 'lucide-react';
import { Language } from '../types';
import { triggerHaptic, playClickSound } from '../utils/haptics';

interface TopAppBarProps {
  title?: string;
  subtitle?: string;
  activeTab: 'calculator' | 'table' | 'history';
  onTabChange: (tab: 'calculator' | 'table' | 'history') => void;
  onReset: () => void;
  onOpenSettings: () => void;
  onOpenApkModal: () => void;
  language: Language;
  onLanguageToggle: () => void;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
  historyCount: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title = 'معهد يمن تايم',
  subtitle = 'Precision Scoring Engine',
  activeTab,
  onTabChange,
  onReset,
  onOpenSettings,
  onOpenApkModal,
  language,
  onLanguageToggle,
  isFrameMode,
  onToggleFrameMode,
  historyCount,
}) => {
  const isAr = language === 'ar';

  return (
    <header className="bg-[#1E1E1E] border-b border-[#2D2D35] text-[#F8F9FA] sticky top-0 z-20 shadow-lg">
      {/* Android Top Status Bar Simulation */}
      <div className="flex justify-between items-center px-4 pt-1.5 pb-0.5 text-[11px] text-[#ADB5BD] font-medium tracking-wide border-b border-[#2A2A30]">
        <span>09:41</span>
        <div className="flex items-center space-[#1.5px] space-x-1.5 dir-ltr">
          <span className="text-[10px] bg-[#0F5132] text-[#20C997] px-1 rounded text-[9px]">5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#198754] to-[#0DCAF0] flex items-center justify-center text-white shadow-md shadow-[#198754]/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#F8F9FA] flex items-center gap-2">
              {isAr ? 'معهد يمن تايم' : title}
            </h1>
            <p className="text-xs text-[#0DCAF0] font-medium tracking-wide">
              {isAr ? 'محرك الحساب الدقيق للمُعلّمين والطلاب' : subtitle}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
          {/* Universal Mobile App Install Button (iPhone & Android) */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              playClickSound(650, 0.05);
              onOpenApkModal();
            }}
            title={isAr ? 'تثبيت التطبيق على الموبايل (Android / APK / iPhone)' : 'Install Mobile App (Android / APK / iPhone)'}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0DCAF0] to-[#0BA3C2] hover:from-[#1fe0ff] hover:to-[#0DCAF0] text-[#121212] active:scale-95 transition-all duration-150 flex items-center gap-1.5 shadow-md shadow-[#0DCAF0]/20 text-xs font-bold"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isAr ? 'تطبيق الموبايل / APK' : 'Mobile App / APK'}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => {
              triggerHaptic('light');
              playClickSound(500, 0.04);
              onLanguageToggle();
            }}
            title={isAr ? 'تغيير اللغة (English)' : 'Switch Language (العربية)'}
            className="p-2 rounded-xl text-[#ADB5BD] hover:text-[#F8F9FA] hover:bg-[#2A2A32] active:scale-95 transition-all duration-150 flex items-center gap-1 text-xs font-semibold"
          >
            <Globe className="w-4 h-4 text-[#0DCAF0]" />
            <span className="hidden sm:inline">{isAr ? 'EN' : 'عربي'}</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              playClickSound(350, 0.05);
              onReset();
            }}
            title={isAr ? 'إعادة ضبط البيانات' : 'Reset Fields'}
            className="p-2 rounded-xl text-[#ADB5BD] hover:text-[#F8F9FA] hover:bg-[#2A2A32] active:scale-95 transition-all duration-150"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              triggerHaptic('light');
              playClickSound(600, 0.04);
              onOpenSettings();
            }}
            title={isAr ? 'الإعدادات وسلم الدرجات' : 'Settings & Scale'}
            className="p-2 rounded-xl text-[#ADB5BD] hover:text-[#F8F9FA] hover:bg-[#2A2A32] active:scale-95 transition-all duration-150"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Frame Toggle */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onToggleFrameMode();
            }}
            title={isFrameMode ? (isAr ? 'عرض الشاشة الكاملة' : 'Full Screen View') : (isAr ? 'وضع الهاتف (iPhone & Android)' : 'Mobile Phone Frame')}
            className={`p-2 rounded-xl transition-all duration-150 ${
              isFrameMode
                ? 'text-[#0DCAF0] bg-[#0DCAF0]/10 border border-[#0DCAF0]/30'
                : 'text-[#ADB5BD] hover:text-[#F8F9FA] hover:bg-[#2A2A32]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Material 3 Segmented Bar - hidden on mobile, shown on tablet/desktop) */}
      <div className="hidden sm:flex px-4 pb-2 gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            triggerHaptic('light');
            onTabChange('calculator');
          }}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === 'calculator'
              ? 'bg-[#198754] text-white font-semibold shadow-md shadow-[#198754]/30'
              : 'bg-[#26262D] text-[#ADB5BD] hover:text-[#F8F9FA] hover:bg-[#2D2D35]'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{isAr ? 'الحاسبة' : 'Calculator'}</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            onTabChange('table');
          }}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === 'table'
              ? 'bg-[#198754] text-white font-semibold shadow-md shadow-[#198754]/30'
              : 'bg-[#26262D] text-[#ADB5BD] hover:text-[#F8F9FA] hover:bg-[#2D2D35]'
          }`}
        >
          <Table2 className="w-3.5 h-3.5 text-[#0DCAF0]" />
          <span>{isAr ? 'جدول الدرجات' : 'Grade Table'}</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            onTabChange('history');
          }}
          className={`relative flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === 'history'
              ? 'bg-[#198754] text-white font-semibold shadow-md shadow-[#198754]/30'
              : 'bg-[#26262D] text-[#ADB5BD] hover:text-[#F8F9FA] hover:bg-[#2D2D35]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>{isAr ? 'السجل' : 'History'}</span>
          {historyCount > 0 && (
            <span className="px-1.5 py-0.2 bg-[#0DCAF0] text-[#121212] font-bold text-[10px] rounded-full">
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
