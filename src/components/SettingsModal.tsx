import React, { useState } from 'react';
import { Settings, X, RotateCcw, Save, Sliders, Globe, Volume2, VolumeX } from 'lucide-react';
import { GradeScaleItem, Language } from '../types';
import { DEFAULT_GRADE_SCALE } from '../utils/gradeCalculator';
import { triggerHaptic } from '../utils/haptics';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradeScale: GradeScaleItem[];
  onSaveScale: (scale: GradeScaleItem[]) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  gradeScale,
  onSaveScale,
  language,
  onLanguageChange,
}) => {
  const isAr = language === 'ar';
  const [scaleState, setScaleState] = useState<GradeScaleItem[]>(gradeScale);

  if (!isOpen) return null;

  const handleMinPercentChange = (index: number, val: number) => {
    const updated = [...scaleState];
    updated[index] = { ...updated[index], minPercent: Math.max(0, Math.min(100, val)) };
    setScaleState(updated);
  };

  const handleResetDefault = () => {
    triggerHaptic('medium');
    setScaleState(DEFAULT_GRADE_SCALE);
  };

  const handleSave = () => {
    triggerHaptic('success');
    onSaveScale(scaleState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] border border-[#2D2D38] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-scaleUp">
        {/* Header */}
        <div className="px-5 py-4 bg-[#16161C] border-b border-[#2D2D35] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#0DCAF0]" />
            <h2 className="text-base font-bold text-[#F8F9FA]">
              {isAr ? 'إعدادات سلم التقديرات' : 'Grading Scale & Cutoffs'}
            </h2>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-1.5 rounded-xl text-[#ADB5BD] hover:text-[#F8F9FA] hover:bg-[#2A2A32]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto no-scrollbar">
          {/* Language Preference Section */}
          <div className="bg-[#121216] border border-[#25252E] rounded-2xl p-3.5 space-y-2">
            <label className="text-xs font-semibold text-[#ADB5BD] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#0DCAF0]" />
              <span>{isAr ? 'لغة الواجهة (Language)' : 'Interface Language'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-[#198754] text-white shadow-md shadow-[#198754]/30'
                    : 'bg-[#26262E] text-[#ADB5BD] hover:text-[#F8F9FA]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('ar')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  language === 'ar'
                    ? 'bg-[#198754] text-white shadow-md shadow-[#198754]/30'
                    : 'bg-[#26262E] text-[#ADB5BD] hover:text-[#F8F9FA]'
                }`}
              >
                العربية
              </button>
            </div>
          </div>

          {/* Grade Cutoffs Customizer Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F8F9FA]">
                {isAr ? 'نسب الحدود الدنيا للتقديرات (%)' : 'Minimum Percentage Cutoffs (%)'}
              </span>
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-xs text-[#0DCAF0] hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'إعادة الافتراضي' : 'Reset Defaults'}</span>
              </button>
            </div>

            <div className="bg-[#121216] border border-[#25252E] rounded-2xl overflow-hidden divide-y divide-[#26262E]">
              {scaleState.map((item, idx) => (
                <div key={item.grade} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center border"
                      style={{
                        backgroundColor: `${item.color}22`,
                        color: item.color,
                        borderColor: `${item.color}44`,
                      }}
                    >
                      {item.grade}
                    </span>
                    <span className="text-xs text-[#ADB5BD] font-medium">
                      GPA: {item.gpa.toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#ADB5BD]">{isAr ? 'أقل نسبة:' : 'Min:'}</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.minPercent}
                      onChange={(e) => handleMinPercentChange(idx, parseFloat(e.target.value) || 0)}
                      className="w-16 bg-[#1E1E26] text-[#F8F9FA] text-xs font-bold px-2.5 py-1 rounded-xl border border-[#343A40] text-center focus:border-[#0DCAF0] outline-none"
                    />
                    <span className="text-xs text-[#ADB5BD]">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#16161C] border-t border-[#2D2D35] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#ADB5BD] hover:bg-[#2A2A32]"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#198754] hover:bg-[#146c43] text-white shadow-lg shadow-[#198754]/30 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{isAr ? 'حفظ التعديلات' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
