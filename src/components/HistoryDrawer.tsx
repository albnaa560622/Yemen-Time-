import React from 'react';
import { History, Trash2, Download, Copy, Check, Calendar, FileText } from 'lucide-react';
import { HistoryEntry, Language } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface HistoryDrawerProps {
  history: HistoryEntry[];
  onClearHistory: () => void;
  onDeleteEntry: (id: string) => void;
  language: Language;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  onClearHistory,
  onDeleteEntry,
  language,
}) => {
  const isAr = language === 'ar';
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const [exported, setExported] = React.useState(false);

  const handleExportCSV = () => {
    if (history.length === 0) return;
    triggerHaptic('success');

    const headers = [
      isAr ? 'المعرّف' : 'ID',
      isAr ? 'اسم الطالب / الاختبار' : 'Student / Exam Name',
      isAr ? 'إجمالي الأسئلة' : 'Total Items',
      isAr ? 'عدد الأخطاء' : 'Errors',
      isAr ? 'الإجابات الصحيحة' : 'Correct Items',
      isAr ? 'الدرجة المستحقة' : 'Score',
      isAr ? 'الدرجة الكلية' : 'Max Grade',
      isAr ? 'النسبة المئوية' : 'Percentage (%)',
      isAr ? 'التقدير' : 'Letter Grade',
      isAr ? 'تاريخ الحفظ' : 'Saved Date & Time',
    ]
      .map((h) => `"${h}"`)
      .join(',');

    const rows = history
      .map((h) => {
        const nameEscaped = (h.studentOrExamName || (isAr ? 'بدون اسم' : 'Unnamed Assessment')).replace(/"/g, '""');
        const correctItems = h.totalItems - h.errorsCount;
        const formattedDate = new Date(h.timestamp).toLocaleString(isAr ? 'ar-SA' : 'en-US');
        return [
          `"${h.id}"`,
          `"${nameEscaped}"`,
          h.totalItems,
          h.errorsCount,
          correctItems,
          h.score,
          h.maxGrade,
          `"${h.percentage}%"`,
          `"${h.letterGrade}"`,
          `"${formattedDate}"`,
        ].join(',');
      })
      .join('\n');

    // UTF-8 BOM byte order mark ensures Excel renders Arabic & special characters correctly
    const bom = '\uFEFF';
    const blob = new Blob([bom + headers + '\n' + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grade_history_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleCopyEntry = (entry: HistoryEntry) => {
    triggerHaptic('light');
    const text = isAr
      ? `الطالب: ${entry.studentOrExamName || 'بدون اسم'}\nالدرجة: ${entry.score}/${entry.maxGrade} (${entry.percentage}%)\nالتقدير: ${entry.letterGrade}\nالأخطاء: ${entry.errorsCount} من ${entry.totalItems}`
      : `Student: ${entry.studentOrExamName || 'N/A'}\nScore: ${entry.score}/${entry.maxGrade} (${entry.percentage}%)\nGrade: ${entry.letterGrade}\nErrors: ${entry.errorsCount}/${entry.totalItems}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2D2D35] rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#2A2A32] pb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#0DCAF0]" />
          <div>
            <h2 className="text-base font-bold text-[#F8F9FA]">
              {isAr ? 'سجل العمليات المحفوظة' : 'Saved Scoring Logs'}
            </h2>
            <p className="text-xs text-[#ADB5BD]">
              {isAr ? `عدد السجلات المحفوظة: ${history.length}` : `${history.length} saved grade calculations`}
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
                exported
                  ? 'bg-[#198754]/25 text-[#20C997] border border-[#198754]/50 shadow-md'
                  : 'bg-[#0DCAF0]/10 text-[#0DCAF0] hover:bg-[#0DCAF0]/20 border border-[#0DCAF0]/30 active:scale-95'
              }`}
            >
              {exported ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#20C997]" />
                  <span>{isAr ? 'تم تصدير CSV!' : 'Exported CSV!'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#0DCAF0]" />
                  <span>{isAr ? 'تصدير CSV' : 'Export CSV'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                triggerHaptic('error');
                if (confirm(isAr ? 'هل أنت تأكد من مسح جميع السجلات؟' : 'Clear all history logs?')) {
                  onClearHistory();
                }
              }}
              className="px-2.5 py-1 rounded-xl bg-[#DC3545]/15 text-[#FF6B6B] hover:bg-[#DC3545]/25 border border-[#DC3545]/40 transition-all flex items-center gap-1 text-xs font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'مسح الكل' : 'Clear All'}</span>
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-12 text-center text-[#ADB5BD] space-y-2">
          <FileText className="w-10 h-10 mx-auto text-[#343A40]" />
          <p className="text-sm font-semibold text-[#F8F9FA]">
            {isAr ? 'لا يوجد سجلات مسبقة' : 'No saved calculations yet'}
          </p>
          <p className="text-xs max-w-xs mx-auto">
            {isAr
              ? 'احسب درجة أي اختبار واضغط زر "حفظ في السجل" لحفظ النتائج هنا.'
              : 'Calculate any grade and click "Save" to build your grading history log.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[440px] overflow-y-auto no-scrollbar pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-[#121216] border border-[#25252E] hover:border-[#3A3A48] rounded-2xl p-3.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#F8F9FA]">
                    {item.studentOrExamName || (isAr ? 'اختبار بدون اسم' : 'Unnamed Assessment')}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#198754]/20 text-[#20C997] font-bold text-xs">
                    {item.letterGrade}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#ADB5BD]">
                  <span>
                    {isAr ? 'الدرجة:' : 'Score:'}{' '}
                    <strong className="text-[#0DCAF0]">{item.score}</strong> / {item.maxGrade} ({item.percentage}%)
                  </span>
                  <span>•</span>
                  <span>
                    {isAr ? 'الأخطاء:' : 'Errors:'} {item.errorsCount} / {item.totalItems}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#6C757D]">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleCopyEntry(item)}
                  className="p-1.5 rounded-xl bg-[#26262E] text-[#ADB5BD] hover:text-[#F8F9FA] transition-all"
                  title="Copy log details"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-[#20C997]" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#0DCAF0]" />
                  )}
                </button>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    onDeleteEntry(item.id);
                  }}
                  className="p-1.5 rounded-xl bg-[#DC3545]/15 text-[#FF6B6B] hover:bg-[#DC3545]/30 transition-all"
                  title="Delete log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
