import React, { useState, useEffect, useMemo } from 'react';
import { TopAppBar } from './components/TopAppBar';
import { InputWorkspace } from './components/InputWorkspace';
import { ResultDisplayCard } from './components/ResultDisplayCard';
import { ActionButton } from './components/ActionButton';
import { GradeTableView } from './components/GradeTableView';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SettingsModal } from './components/SettingsModal';
import { ApkModal } from './components/ApkModal';
import { AndroidFrame } from './components/AndroidFrame';
import { BottomNavBar } from './components/BottomNavBar';
import { calculateGrade, DEFAULT_GRADE_SCALE } from './utils/gradeCalculator';
import { CalculationResult, GradeScaleItem, HistoryEntry, InputMode, Language } from './types';
import { triggerHaptic } from './utils/haptics';

export default function App() {
  // State initialization
  const [totalItems, setTotalItems] = useState<number>(25);
  const [errorsOrCorrect, setErrorsOrCorrect] = useState<number>(2);
  const [maxGrade, setMaxGrade] = useState<number>(100);
  const [inputMode, setInputMode] = useState<InputMode>('errors');
  const [studentName, setStudentName] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'calculator' | 'table' | 'history'>('calculator');
  const [language, setLanguage] = useState<Language>('en');
  const [isFrameMode, setIsFrameMode] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);

  // Custom grade scale stored in localStorage
  const [gradeScale, setGradeScale] = useState<GradeScaleItem[]>(() => {
    try {
      const saved = localStorage.getItem('grade_calculator_scale');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_GRADE_SCALE;
  });

  // History entries stored in localStorage
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('grade_calculator_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Persist history and scale changes
  useEffect(() => {
    try {
      localStorage.setItem('grade_calculator_scale', JSON.stringify(gradeScale));
    } catch {}
  }, [gradeScale]);

  useEffect(() => {
    try {
      localStorage.setItem('grade_calculator_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  // Calculated Result Memoization
  const currentResult: CalculationResult = useMemo(() => {
    return calculateGrade(
      {
        totalItems,
        errorsOrCorrect,
        maxGrade,
        inputMode,
      },
      gradeScale
    );
  }, [totalItems, errorsOrCorrect, maxGrade, inputMode, gradeScale]);

  // Check if current calculation is saved
  const isCurrentSaved = useMemo(() => {
    if (!currentResult.isValid || history.length === 0) return false;
    const latest = history[0];
    return (
      latest.totalItems === currentResult.totalItems &&
      latest.errorsCount === currentResult.errorsCount &&
      latest.score === currentResult.score &&
      latest.maxGrade === currentResult.maxGrade
    );
  }, [currentResult, history]);

  // Handlers
  const handleCalculateTrigger = () => {
    triggerHaptic('medium');
    // Re-verify calculation and scroll to result smoothly
    const resultElement = document.getElementById('result-display-section');
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReset = () => {
    setTotalItems(25);
    setErrorsOrCorrect(0);
    setMaxGrade(100);
    setStudentName('');
    setInputMode('errors');
  };

  const handleSaveToHistory = () => {
    if (!currentResult.isValid) return;

    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      studentOrExamName: studentName.trim(),
      totalItems: currentResult.totalItems,
      errorsCount: currentResult.errorsCount,
      score: currentResult.score,
      maxGrade: currentResult.maxGrade,
      percentage: currentResult.percentage,
      letterGrade: currentResult.letterGrade,
    };

    setHistory((prev) => [newEntry, ...prev]);
  };

  const handleDeleteHistoryEntry = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const isAr = language === 'ar';

  return (
    <div className={isAr ? 'rtl' : 'ltr'} dir={isAr ? 'rtl' : 'ltr'}>
      <AndroidFrame isFrameMode={isFrameMode}>
        <div className="min-h-full bg-[#121212] text-[#F8F9FA] flex flex-col font-sans">
          {/* Custom Material 3 Top App Bar */}
          <TopAppBar
            title="معهد يمن تايم"
            subtitle="Precision Scoring Engine"
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onReset={handleReset}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenApkModal={() => setIsApkModalOpen(true)}
            language={language}
            onLanguageToggle={() => setLanguage((l) => (l === 'en' ? 'ar' : 'en'))}
            isFrameMode={isFrameMode}
            onToggleFrameMode={() => setIsFrameMode((prev) => !prev)}
            historyCount={history.length}
          />

          {/* Main Viewport Content Area */}
          <main className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-6 pb-24 sm:pb-6">
            {activeTab === 'calculator' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Inputs Workspace Card */}
                <InputWorkspace
                  totalItems={totalItems}
                  setTotalItems={setTotalItems}
                  errorsOrCorrect={errorsOrCorrect}
                  setErrorsOrCorrect={setErrorsOrCorrect}
                  maxGrade={maxGrade}
                  setMaxGrade={setMaxGrade}
                  inputMode={inputMode}
                  setInputMode={setInputMode}
                  studentName={studentName}
                  setStudentName={setStudentName}
                  language={language}
                  errorMessage={currentResult.errorMessage}
                  errorMessageAr={currentResult.errorMessageAr}
                />

                {/* Main Action Button ("موافق" / "Calculate") */}
                <ActionButton
                  onCalculate={handleCalculateTrigger}
                  onReset={handleReset}
                  language={language}
                  disabled={!currentResult.isValid}
                />

                {/* Dynamic Result Display Card */}
                <div id="result-display-section">
                  <ResultDisplayCard
                    result={currentResult}
                    language={language}
                    onSaveToHistory={handleSaveToHistory}
                    isSaved={isCurrentSaved}
                  />
                </div>
              </div>
            )}

            {activeTab === 'table' && (
              <div className="animate-fadeIn">
                <GradeTableView
                  totalItems={totalItems}
                  maxGrade={maxGrade}
                  gradeScale={gradeScale}
                  language={language}
                />
              </div>
            )}

            {activeTab === 'history' && (
              <div className="animate-fadeIn">
                <HistoryDrawer
                  history={history}
                  onClearHistory={handleClearHistory}
                  onDeleteEntry={handleDeleteHistoryEntry}
                  language={language}
                />
              </div>
            )}
          </main>

          {/* Mobile Bottom Navigation Bar (Visible on smaller mobile screens) */}
          <div className="sm:hidden mt-auto sticky bottom-0 z-30">
            <BottomNavBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onOpenSettings={() => setIsSettingsOpen(true)}
              language={language}
              historyCount={history.length}
            />
          </div>

          {/* Settings Modal */}
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            gradeScale={gradeScale}
            onSaveScale={setGradeScale}
            language={language}
            onLanguageChange={setLanguage}
          />

          {/* Android APK & PWA Install Modal */}
          <ApkModal
            isOpen={isApkModalOpen}
            onClose={() => setIsApkModalOpen(false)}
            language={language}
          />
        </div>
      </AndroidFrame>
    </div>
  );
}
