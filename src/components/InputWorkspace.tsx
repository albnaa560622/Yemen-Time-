import React, { useState } from 'react';
import { HelpCircle, AlertCircle, Plus, Minus, CheckCircle, XCircle, FileSpreadsheet, Percent } from 'lucide-react';
import { InputMode, Language } from '../types';
import { triggerHaptic, playClickSound } from '../utils/haptics';

interface InputWorkspaceProps {
  totalItems: number;
  setTotalItems: (val: number) => void;
  errorsOrCorrect: number;
  setErrorsOrCorrect: (val: number) => void;
  maxGrade: number;
  setMaxGrade: (val: number) => void;
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  studentName: string;
  setStudentName: (name: string) => void;
  language: Language;
  errorMessage?: string;
  errorMessageAr?: string;
}

export const InputWorkspace: React.FC<InputWorkspaceProps> = ({
  totalItems,
  setTotalItems,
  errorsOrCorrect,
  setErrorsOrCorrect,
  maxGrade,
  setMaxGrade,
  inputMode,
  setInputMode,
  studentName,
  setStudentName,
  language,
  errorMessage,
  errorMessageAr,
}) => {
  const isAr = language === 'ar';

  // Focus tracking for floating label & border color animation
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isErrorsMode = inputMode === 'errors';
  const isInvalidErrors = isErrorsMode ? errorsOrCorrect > totalItems : errorsOrCorrect > totalItems;

  const handleStep = (field: 'total' | 'value' | 'max', delta: number) => {
    triggerHaptic('light');
    playClickSound(400 + delta * 50, 0.03);
    if (field === 'total') {
      setTotalItems(Math.max(1, totalItems + delta));
    } else if (field === 'value') {
      setErrorsOrCorrect(Math.max(0, errorsOrCorrect + delta));
    } else if (field === 'max') {
      setMaxGrade(Math.max(1, maxGrade + delta));
    }
  };

  return (
    <div className="space-y-4">
      {/* Optional Student / Exam Name Header Input */}
      <div className="bg-[#1E1E1E] border border-[#2D2D35] rounded-2xl p-3 shadow-md">
        <div className="relative">
          <input
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            onFocus={() => setFocusedField('studentName')}
            onBlur={() => setFocusedField(null)}
            placeholder=" "
            className={`w-full bg-[#121212] text-[#F8F9FA] px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-200 outline-none ${
              focusedField === 'studentName'
                ? 'border-[#0DCAF0] ring-1 ring-[#0DCAF0]/30 shadow-[0_0_12px_rgba(13,202,240,0.15)]'
                : 'border-[#343A40]'
            }`}
          />
          <label
            htmlFor="studentName"
            className={`absolute left-3.5 rtl:right-3.5 rtl:left-auto px-1 bg-[#121212] transition-all duration-200 pointer-events-none text-xs font-medium ${
              focusedField === 'studentName' || studentName
                ? '-top-2.5 text-[#0DCAF0]'
                : 'top-2.5 text-[#ADB5BD]'
            }`}
          >
            {isAr ? 'اسم الطالب / الاختبار (اختياري)' : 'Student / Exam Tag (Optional)'}
          </label>
        </div>
      </div>

      {/* Main Material 3 Surface Variant Cards Container */}
      <div className="bg-[#1E1E1E] border border-[#2D2D35] rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A2A32] pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#0DCAF0]" />
            <h2 className="text-base font-semibold text-[#F8F9FA]">
              {isAr ? 'معايير الحساب' : 'Scoring Parameters'}
            </h2>
          </div>

          {/* Mode Switcher: Enter Mistakes vs Enter Correct */}
          <div className="bg-[#121212] p-1 rounded-xl flex items-center border border-[#2D2D35]">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                playClickSound(520, 0.04);
                setInputMode('errors');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                isErrorsMode
                  ? 'bg-[#DC3545]/20 text-[#FF6B6B] border border-[#DC3545]/40 font-semibold'
                  : 'text-[#ADB5BD] hover:text-[#F8F9FA]'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'الأخطاء' : 'Errors'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                playClickSound(560, 0.04);
                setInputMode('correct');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                !isErrorsMode
                  ? 'bg-[#198754]/20 text-[#20C997] border border-[#198754]/40 font-semibold'
                  : 'text-[#ADB5BD] hover:text-[#F8F9FA]'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'الإجابات الصحيحة' : 'Correct'}</span>
            </button>
          </div>
        </div>

        {/* FIELD 1: Total Questions / Items */}
        <div className="space-y-1.5">
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  id="totalItems"
                  min="1"
                  max="500"
                  value={totalItems || ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setTotalItems(isNaN(val) ? 0 : val);
                  }}
                  onFocus={() => setFocusedField('totalItems')}
                  onBlur={() => setFocusedField(null)}
                  placeholder=" "
                  className={`w-full bg-[#121212] text-[#F8F9FA] text-lg font-bold px-4 pt-5 pb-2 rounded-2xl border transition-all duration-200 outline-none ${
                    totalItems <= 0
                      ? 'border-[#DC3545] ring-1 ring-[#DC3545]/30'
                      : focusedField === 'totalItems'
                      ? 'border-[#0DCAF0] ring-1 ring-[#0DCAF0]/40 shadow-[0_0_15px_rgba(13,202,240,0.18)]'
                      : 'border-[#343A40]'
                  }`}
                />
                <label
                  htmlFor="totalItems"
                  className={`absolute left-4 rtl:right-4 rtl:left-auto px-1 bg-[#121212] transition-all duration-200 pointer-events-none text-xs font-medium ${
                    focusedField === 'totalItems' || totalItems
                      ? 'top-1.5 text-[#0DCAF0]'
                      : 'top-4 text-[#ADB5BD] text-sm'
                  }`}
                >
                  {isAr ? '١. إجمالي الأسئلة / الفقرات' : '1. Total Questions / Items'}
                </label>
              </div>

              {/* Stepper controls */}
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStep('total', 1)}
                  className="p-2 min-w-[42px] min-h-[38px] flex items-center justify-center bg-[#26262D] hover:bg-[#343A40] active:scale-90 text-[#F8F9FA] rounded-xl border border-[#3A3A42] transition-all"
                  title="Increase Total"
                >
                  <Plus className="w-4 h-4 text-[#0DCAF0]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleStep('total', -1)}
                  className="p-2 min-w-[42px] min-h-[38px] flex items-center justify-center bg-[#26262D] hover:bg-[#343A40] active:scale-90 text-[#F8F9FA] rounded-xl border border-[#3A3A42] transition-all"
                  title="Decrease Total"
                >
                  <Minus className="w-4 h-4 text-[#ADB5BD]" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick preset chips for common test sizes */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
            <span className="text-[11px] text-[#ADB5BD] shrink-0 font-medium">
              {isAr ? 'شائع:' : 'Quick:'}
            </span>
            {[10, 20, 25, 30, 40, 50, 100].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  playClickSound(480, 0.03);
                  setTotalItems(num);
                }}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  totalItems === num
                    ? 'bg-[#0DCAF0] text-[#121212]'
                    : 'bg-[#26262E] text-[#ADB5BD] hover:text-[#F8F9FA] hover:bg-[#32323A]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* FIELD 2: Number of Errors / Mistakes OR Correct Answers */}
        <div className="space-y-1.5">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                id="errorsOrCorrect"
                min="0"
                max={totalItems || 500}
                value={errorsOrCorrect === 0 ? '0' : errorsOrCorrect || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setErrorsOrCorrect(isNaN(val) ? 0 : val);
                }}
                onFocus={() => setFocusedField('errorsOrCorrect')}
                onBlur={() => setFocusedField(null)}
                placeholder=" "
                className={`w-full bg-[#121212] text-[#F8F9FA] text-lg font-bold px-4 pt-5 pb-2 rounded-2xl border transition-all duration-200 outline-none ${
                  isInvalidErrors
                    ? 'border-[#DC3545] ring-1 ring-[#DC3545]/40 shadow-[0_0_12px_rgba(220,53,69,0.2)]'
                    : focusedField === 'errorsOrCorrect'
                    ? 'border-[#0DCAF0] ring-1 ring-[#0DCAF0]/40 shadow-[0_0_15px_rgba(13,202,240,0.18)]'
                    : 'border-[#343A40]'
                }`}
              />
              <label
                htmlFor="errorsOrCorrect"
                className={`absolute left-4 rtl:right-4 rtl:left-auto px-1 bg-[#121212] transition-all duration-200 pointer-events-none text-xs font-medium ${
                  focusedField === 'errorsOrCorrect' || errorsOrCorrect !== undefined
                    ? 'top-1.5 text-[#0DCAF0]'
                    : 'top-4 text-[#ADB5BD] text-sm'
                }`}
              >
                {isErrorsMode
                  ? isAr
                    ? '٢. عدد الأخطاء / الإجابات الخاطئة'
                    : '2. Number of Errors / Mistakes'
                  : isAr
                  ? '٢. عدد الإجابات الصحيحة'
                  : '2. Number of Correct Answers'}
              </label>
            </div>

            {/* Stepper buttons for errors */}
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleStep('value', 1)}
                className="p-2 min-w-[42px] min-h-[38px] flex items-center justify-center bg-[#26262D] hover:bg-[#343A40] active:scale-90 text-[#F8F9FA] rounded-xl border border-[#3A3A42] transition-all"
              >
                <Plus className="w-4 h-4 text-[#0DCAF0]" />
              </button>
              <button
                type="button"
                onClick={() => handleStep('value', -1)}
                className="p-2 min-w-[42px] min-h-[38px] flex items-center justify-center bg-[#26262D] hover:bg-[#343A40] active:scale-90 text-[#F8F9FA] rounded-xl border border-[#3A3A42] transition-all"
              >
                <Minus className="w-4 h-4 text-[#ADB5BD]" />
              </button>
            </div>
          </div>

          {/* Inline Slider for rapid adjustment */}
          {totalItems > 0 && (
            <div className="pt-1 flex items-center gap-3">
              <span className="text-[11px] text-[#ADB5BD]">0</span>
              <input
                type="range"
                min="0"
                max={totalItems}
                value={Math.min(errorsOrCorrect, totalItems)}
                onChange={(e) => {
                  triggerHaptic('light');
                  setErrorsOrCorrect(parseInt(e.target.value, 10));
                }}
                className="w-full h-1.5 bg-[#26262D] rounded-lg appearance-none cursor-pointer accent-[#0DCAF0]"
              />
              <span className="text-[11px] text-[#0DCAF0] font-bold">{totalItems}</span>
            </div>
          )}
        </div>

        {/* FIELD 3: Maximum Final Grade / Total Possible Score */}
        <div className="space-y-1.5 pt-1">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                id="maxGrade"
                min="1"
                max="1000"
                value={maxGrade || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setMaxGrade(isNaN(val) ? 0 : val);
                }}
                onFocus={() => setFocusedField('maxGrade')}
                onBlur={() => setFocusedField(null)}
                placeholder=" "
                className={`w-full bg-[#121212] text-[#F8F9FA] text-lg font-bold px-4 pt-5 pb-2 rounded-2xl border transition-all duration-200 outline-none ${
                  maxGrade <= 0
                    ? 'border-[#DC3545] ring-1 ring-[#DC3545]/30'
                    : focusedField === 'maxGrade'
                    ? 'border-[#0DCAF0] ring-1 ring-[#0DCAF0]/40 shadow-[0_0_15px_rgba(13,202,240,0.18)]'
                    : 'border-[#343A40]'
                }`}
              />
              <label
                htmlFor="maxGrade"
                className={`absolute left-4 rtl:right-4 rtl:left-auto px-1 bg-[#121212] transition-all duration-200 pointer-events-none text-xs font-medium ${
                  focusedField === 'maxGrade' || maxGrade
                    ? 'top-1.5 text-[#0DCAF0]'
                    : 'top-4 text-[#ADB5BD] text-sm'
                }`}
              >
                {isAr ? '٣. الدرجة النهائية الكلية' : '3. Maximum Final Grade / Score'}
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleStep('max', 5)}
                className="p-2 min-w-[42px] min-h-[38px] flex items-center justify-center bg-[#26262D] hover:bg-[#343A40] active:scale-90 text-[#F8F9FA] rounded-xl border border-[#3A3A42] transition-all"
              >
                <Plus className="w-4 h-4 text-[#0DCAF0]" />
              </button>
              <button
                type="button"
                onClick={() => handleStep('max', -5)}
                className="p-2 min-w-[42px] min-h-[38px] flex items-center justify-center bg-[#26262D] hover:bg-[#343A40] active:scale-90 text-[#F8F9FA] rounded-xl border border-[#3A3A42] transition-all"
              >
                <Minus className="w-4 h-4 text-[#ADB5BD]" />
              </button>
            </div>
          </div>

          {/* Quick preset chips for max grade */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
            <span className="text-[11px] text-[#ADB5BD] shrink-0 font-medium">
              {isAr ? 'المجموع:' : 'Max Scale:'}
            </span>
            {[100, 50, 20, 10, 5, 4.0].map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  playClickSound(500, 0.03);
                  setMaxGrade(grade);
                }}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  maxGrade === grade
                    ? 'bg-[#198754] text-white'
                    : 'bg-[#26262E] text-[#ADB5BD] hover:text-[#F8F9FA] hover:bg-[#32323A]'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Validation Error Banner if soft red state triggered */}
        {(errorMessage || isInvalidErrors) && (
          <div className="bg-[#DC3545]/15 border border-[#DC3545]/50 rounded-2xl p-3 flex items-start gap-2.5 text-[#FF6B6B] text-xs font-medium animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#DC3545]" />
            <div>
              <p className="font-semibold">{isAr ? 'تنبيه خطأ في البيانات' : 'Invalid Input Detected'}</p>
              <p className="text-[11px] opacity-90">
                {isAr
                  ? errorMessageAr || 'عدد الأخطاء أكبر من إجمالي الأسئلة المتاحة.'
                  : errorMessage || 'Errors cannot exceed total test items.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
