import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle2, XCircle, Percent, Sparkles, Share2, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CalculationResult, Language } from '../types';
import { triggerHaptic, playSuccessSound } from '../utils/haptics';

interface ResultDisplayCardProps {
  result: CalculationResult;
  language: Language;
  onSaveToHistory: () => void;
  isSaved?: boolean;
}

export const ResultDisplayCard: React.FC<ResultDisplayCardProps> = ({
  result,
  language,
  onSaveToHistory,
  isSaved = false,
}) => {
  const isAr = language === 'ar';
  const [copied, setCopied] = React.useState(false);

  // Trigger celebration confetti for 100% or A+ score
  useEffect(() => {
    if (result.isValid && result.percentage >= 97) {
      playSuccessSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#198754', '#20C997', '#0DCAF0', '#FFD166'],
      });
    }
  }, [result.score, result.totalItems, result.isValid, result.percentage]);

  const handleCopySummary = () => {
    if (!result.isValid) return;
    triggerHaptic('success');
    const summary = isAr
      ? `📊 نتيجة الاختبار:\nالدرجة: ${result.score} / ${result.maxGrade} (${result.percentage}%)\nالتقدير: ${result.letterGrade}\nالإجابات الصحيحة: ${result.correctItems} من ${result.totalItems}\nالأخطاء: ${result.errorsCount}`
      : `📊 Test Score Result:\nScore: ${result.score} / ${result.maxGrade} (${result.percentage}%)\nGrade: ${result.letterGrade}\nCorrect: ${result.correctItems} / ${result.totalItems}\nErrors: ${result.errorsCount}`;

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Calculate SVG Circle circumference
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.percentage / 100) * circumference;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${result.score}-${result.totalItems}-${result.errorsCount}`}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative overflow-hidden bg-gradient-to-b from-[#1E1E24] to-[#16161C] border border-[#2D2D38] rounded-3xl p-5 shadow-2xl space-y-5"
      >
        {/* Background glow orb */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: result.gradeColor }}
        />

        {/* Top Header Row of Card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: result.gradeColor }}
            />
            <h3 className="text-xs font-semibold text-[#ADB5BD] uppercase tracking-wider">
              {isAr ? 'نتيجة الحساب الحالية' : 'Calculated Result'}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopySummary}
              title={isAr ? 'نسخ ملخص النتيجة' : 'Copy Summary'}
              className="p-1.5 rounded-xl bg-[#26262E] text-[#ADB5BD] hover:text-[#F8F9FA] hover:bg-[#32323A] transition-all flex items-center gap-1 text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#20C997]" />
                  <span className="text-[11px] text-[#20C997] font-semibold">{isAr ? 'تم النسخ' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#0DCAF0]" />
                  <span className="hidden sm:inline text-[11px]">{isAr ? 'نسخ' : 'Copy'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                triggerHaptic('success');
                onSaveToHistory();
              }}
              disabled={!result.isValid || isSaved}
              className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                isSaved
                  ? 'bg-[#198754]/20 text-[#20C997] border border-[#198754]/40 cursor-default'
                  : 'bg-[#0DCAF0]/10 text-[#0DCAF0] hover:bg-[#0DCAF0]/20 border border-[#0DCAF0]/30 active:scale-95'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSaved ? (isAr ? 'محفوظ في السجل' : 'Saved') : isAr ? 'حفظ في السجل' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Score Typography & Circular Progress Section */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-[#121216] border border-[#25252E] rounded-2xl p-4">
          {/* Circular Progress Gauge */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#262630"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Dynamic Fill Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={result.gradeColor}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Center Letter Grade & Percentage */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span
                  className="text-3xl font-black tracking-tight drop-shadow-md"
                  style={{ color: result.gradeColor }}
                >
                  {result.letterGrade}
                </span>
                <span className="text-sm font-bold text-[#F8F9FA] mt-0.5">
                  {result.percentage}%
                </span>
                <span className="text-[10px] text-[#ADB5BD] font-medium">
                  GPA: {result.gpaEquivalent.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Main Display Score Info */}
          <div className="sm:col-span-7 flex flex-col justify-center space-y-3 border-t sm:border-t-0 sm:border-l rtl:sm:border-l-0 rtl:sm:border-r border-[#25252E] pt-3 sm:pt-0 sm:pl-4 rtl:sm:pr-4">
            <div>
              <span className="text-xs text-[#ADB5BD] font-medium block">
                {isAr ? 'الدرجة المحسوبة المستحقة' : 'Final Earned Score'}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#F8F9FA] tracking-tight">
                  {result.score}
                </span>
                <span className="text-lg text-[#ADB5BD] font-semibold">
                  / {result.maxGrade}
                </span>
              </div>
              {/* Linear percentage progress bar from theme specification */}
              <div className="mt-3 w-full h-2 bg-[#262630] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#198754] to-[#0DCAF0] transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(0, Math.min(100, result.percentage))}%` }}
                />
              </div>
            </div>

            {/* Performance Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E1E26] border border-[#2D2D38] text-xs font-semibold text-[#F8F9FA]">
              <Award className="w-4 h-4 shrink-0" style={{ color: result.gradeColor }} />
              <span>{isAr ? result.performanceLabelAr : result.performanceLabel}</span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Correct Count */}
          <div className="bg-[#121216] border border-[#25252E] rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#20C997] text-xs font-semibold mb-1">
              <span>{isAr ? 'الصحيح' : 'Correct'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-[#F8F9FA]">
              {result.correctItems} <span className="text-xs text-[#ADB5BD] font-normal">/ {result.totalItems}</span>
            </span>
          </div>

          {/* Errors Count */}
          <div className="bg-[#121216] border border-[#25252E] rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#FF6B6B] text-xs font-semibold mb-1">
              <span>{isAr ? 'الأخطاء' : 'Errors'}</span>
              <XCircle className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-[#F8F9FA]">
              {result.errorsCount} <span className="text-xs text-[#ADB5BD] font-normal">/ {result.totalItems}</span>
            </span>
          </div>

          {/* Point Deduction per Error */}
          <div className="bg-[#121216] border border-[#25252E] rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#0DCAF0] text-xs font-semibold mb-1">
              <span>{isAr ? 'خصم/خطأ' : 'Per Error'}</span>
              <Percent className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-[#F8F9FA]">
              -{result.pointsPerError}{' '}
              <span className="text-[10px] text-[#ADB5BD] font-normal">{isAr ? 'درجة' : 'pts'}</span>
            </span>
          </div>

          {/* Value per question */}
          <div className="bg-[#121216] border border-[#25252E] rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#FFC107] text-xs font-semibold mb-1">
              <span>{isAr ? 'قيمة السؤال' : 'Per Item'}</span>
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-[#F8F9FA]">
              {result.pointsPerItem}{' '}
              <span className="text-[10px] text-[#ADB5BD] font-normal">{isAr ? 'درجة' : 'pts'}</span>
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
