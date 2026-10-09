import React, { useState } from 'react';
import { Table2, Search, Printer, Copy, Check, Filter } from 'lucide-react';
import { generateGradeTable } from '../utils/gradeCalculator';
import { GradeScaleItem, Language } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface GradeTableViewProps {
  totalItems: number;
  maxGrade: number;
  gradeScale: GradeScaleItem[];
  language: Language;
}

export const GradeTableView: React.FC<GradeTableViewProps> = ({
  totalItems,
  maxGrade,
  gradeScale,
  language,
}) => {
  const isAr = language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const tableData = generateGradeTable(totalItems, maxGrade, gradeScale);

  const filteredData = tableData.filter(
    (row) =>
      row.mistakes.toString().includes(searchTerm) ||
      row.correct.toString().includes(searchTerm) ||
      row.letterGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.score.toString().includes(searchTerm)
  );

  const handleCopyTable = () => {
    triggerHaptic('success');
    const header = isAr
      ? `جدول درجات للاختبار (إجمالي الأسئلة: ${totalItems}، النهاية الكبرى: ${maxGrade})\nالأخطاء\tالصحيح\tالدرجة\tالنسبة\tالتقدير\n`
      : `Grade Table (Total Items: ${totalItems}, Max Score: ${maxGrade})\nErrors\tCorrect\tScore\t%\tGrade\n`;

    const body = tableData
      .map((r) => `${r.mistakes}\t${r.correct}\t${r.score}\t${r.percentage}%\t${r.letterGrade}`)
      .join('\n');

    navigator.clipboard.writeText(header + body).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    triggerHaptic('medium');
    window.print();
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2D2D35] rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2A32] pb-3">
        <div className="flex items-center gap-2">
          <Table2 className="w-5 h-5 text-[#0DCAF0]" />
          <div>
            <h2 className="text-base font-bold text-[#F8F9FA]">
              {isAr ? 'جدول الدرجات السريع (EZ-Grader)' : 'Quick Score Lookup Matrix'}
            </h2>
            <p className="text-xs text-[#ADB5BD]">
              {isAr
                ? `مصفوفة حساب جميع الدرجات لاختبار من ${totalItems} سؤالاً`
                : `Complete grade breakdown for ${totalItems} total items (${maxGrade} max pts)`}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyTable}
            className="px-3 py-1.5 rounded-xl bg-[#26262E] text-[#ADB5BD] hover:text-[#F8F9FA] hover:bg-[#32323A] border border-[#343A40] transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#20C997]" />
                <span className="text-[#20C997]">{isAr ? 'تم نسخ الجدول' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#0DCAF0]" />
                <span>{isAr ? 'نسخ الجدول' : 'Copy Table'}</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl bg-[#198754]/20 text-[#20C997] hover:bg-[#198754]/30 border border-[#198754]/40 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isAr ? 'طباعة' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#ADB5BD] absolute left-3.5 rtl:right-3.5 rtl:left-auto top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={isAr ? 'بحث بشرط عدد الأخطاء أو التقدير (مثال: A+ أو 3)...' : 'Search by errors or grade letter (e.g. A+ or 3)...'}
          className="w-full bg-[#121212] text-[#F8F9FA] pl-10 rtl:pr-10 pr-4 py-2 rounded-xl border border-[#343A40] text-xs focus:border-[#0DCAF0] focus:outline-none"
        />
      </div>

      {/* Grade Table */}
      <div className="overflow-x-auto max-h-[420px] overflow-y-auto rounded-xl border border-[#2D2D35] no-scrollbar">
        <table className="w-full text-left rtl:text-right text-xs">
          <thead className="bg-[#121216] text-[#ADB5BD] font-semibold sticky top-0 border-b border-[#2D2D35]">
            <tr>
              <th className="py-2.5 px-3">{isAr ? 'عدد الأخطاء' : 'Errors'}</th>
              <th className="py-2.5 px-3">{isAr ? 'الإجابات الصحيحة' : 'Correct'}</th>
              <th className="py-2.5 px-3">{isAr ? 'الدرجة المستحقة' : 'Score'}</th>
              <th className="py-2.5 px-3">{isAr ? 'النسبة %' : 'Percentage'}</th>
              <th className="py-2.5 px-3">{isAr ? 'التقدير' : 'Letter Grade'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#26262E]">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-[#ADB5BD]">
                  {isAr ? 'لا توجد نتائج تطابق البحث' : 'No matching scores found'}
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr
                  key={row.mistakes}
                  className="hover:bg-[#262630] transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-[#FF6B6B]">
                    {row.mistakes}
                  </td>
                  <td className="py-2.5 px-3 text-[#20C997] font-medium">
                    {row.correct} / {totalItems}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#F8F9FA]">
                    {row.score} <span className="text-[10px] text-[#ADB5BD] font-normal">/ {maxGrade}</span>
                  </td>
                  <td className="py-2.5 px-3 text-[#0DCAF0] font-medium">
                    {row.percentage}%
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className="px-2 py-0.5 rounded-md font-bold text-[11px]"
                      style={{
                        backgroundColor: `${row.color}22`,
                        color: row.color,
                        border: `1px solid ${row.color}44`,
                      }}
                    >
                      {row.letterGrade}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
