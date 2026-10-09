import { GradeInput, CalculationResult, GradeScaleItem, GradeTableEntry } from '../types';

export const DEFAULT_GRADE_SCALE: GradeScaleItem[] = [
  { grade: 'A+', minPercent: 97, gpa: 4.0, color: '#198754' },
  { grade: 'A',  minPercent: 93, gpa: 4.0, color: '#20C997' },
  { grade: 'A-', minPercent: 90, gpa: 3.7, color: '#0DCAF0' },
  { grade: 'B+', minPercent: 87, gpa: 3.3, color: '#0DCAF0' },
  { grade: 'B',  minPercent: 83, gpa: 3.0, color: '#3D8BFD' },
  { grade: 'B-', minPercent: 80, gpa: 2.7, color: '#6610F2' },
  { grade: 'C+', minPercent: 77, gpa: 2.3, color: '#FFC107' },
  { grade: 'C',  minPercent: 73, gpa: 2.0, color: '#FFB703' },
  { grade: 'C-', minPercent: 70, gpa: 1.7, color: '#FD7E14' },
  { grade: 'D+', minPercent: 67, gpa: 1.3, color: '#FD7E14' },
  { grade: 'D',  minPercent: 63, gpa: 1.0, color: '#F76707' },
  { grade: 'D-', minPercent: 60, gpa: 0.7, color: '#DC3545' },
  { grade: 'F',  minPercent: 0,  gpa: 0.0, color: '#DC3545' },
];

export function resolveGradeScale(
  percentage: number,
  scale: GradeScaleItem[] = DEFAULT_GRADE_SCALE
): { letterGrade: string; gpa: number; color: string } {
  const sorted = [...scale].sort((a, b) => b.minPercent - a.minPercent);
  const matched = sorted.find((s) => percentage >= s.minPercent);
  if (matched) {
    return { letterGrade: matched.grade, gpa: matched.gpa, color: matched.color };
  }
  return { letterGrade: 'F', gpa: 0.0, color: '#DC3545' };
}

export function getPerformanceFeedback(percentage: number): { en: string; ar: string } {
  if (percentage >= 97) return { en: 'Exceptional Mastery! Perfect execution.', ar: 'إتقان استثنائي! أداء ممتاز جداً.' };
  if (percentage >= 90) return { en: 'Outstanding Performance!', ar: 'أداء ممتاز واحترافي!' };
  if (percentage >= 80) return { en: 'Great Job! Solid understanding.', ar: 'أداء جيد جداً! فهم قوي.' };
  if (percentage >= 70) return { en: 'Good Effort! Room for improvement.', ar: 'أداء جيد! يمكنك التحسين أكثر.' };
  if (percentage >= 60) return { en: 'Passing Grade. Review missed concepts.', ar: 'درجة نجاح. يرجى مراجعة الأخطاء.' };
  return { en: 'Needs Immediate Review and Practice.', ar: 'يحتاج إلى مراجعة فورية وتمارين مكثفة.' };
}

export function calculateGrade(
  input: GradeInput,
  scale: GradeScaleItem[] = DEFAULT_GRADE_SCALE
): CalculationResult {
  const { totalItems, errorsOrCorrect, maxGrade, inputMode } = input;

  // Validation
  if (isNaN(totalItems) || totalItems <= 0) {
    return {
      totalItems: 0,
      correctItems: 0,
      errorsCount: 0,
      maxGrade: maxGrade || 100,
      score: 0,
      percentage: 0,
      letterGrade: '-',
      gpaEquivalent: 0,
      pointsPerItem: 0,
      pointsPerError: 0,
      gradeColor: '#ADB5BD',
      performanceLabel: 'Enter valid total questions',
      performanceLabelAr: 'أدخل إجمالي الأسئلة بشكل صحيح',
      isValid: false,
      errorMessage: 'Total questions must be greater than 0',
      errorMessageAr: 'يجب أن يكون إجمالي الأسئلة أكبر من 0',
    };
  }

  if (isNaN(maxGrade) || maxGrade <= 0) {
    return {
      totalItems,
      correctItems: 0,
      errorsCount: 0,
      maxGrade: 0,
      score: 0,
      percentage: 0,
      letterGrade: '-',
      gpaEquivalent: 0,
      pointsPerItem: 0,
      pointsPerError: 0,
      gradeColor: '#ADB5BD',
      performanceLabel: 'Invalid max final score',
      performanceLabelAr: 'الدرجة النهائية غير صحيحة',
      isValid: false,
      errorMessage: 'Maximum final grade must be greater than 0',
      errorMessageAr: 'يجب أن تكون الدرجة الكلية أكبر من 0',
    };
  }

  const inputValue = isNaN(errorsOrCorrect) ? 0 : Math.max(0, errorsOrCorrect);

  let errorsCount = 0;
  let correctItems = 0;

  if (inputMode === 'errors') {
    errorsCount = inputValue;
    correctItems = Math.max(0, totalItems - errorsCount);
  } else {
    correctItems = Math.min(totalItems, inputValue);
    errorsCount = Math.max(0, totalItems - correctItems);
  }

  // Error validation: errors cannot exceed total items
  if (errorsCount > totalItems) {
    return {
      totalItems,
      correctItems: 0,
      errorsCount,
      maxGrade,
      score: 0,
      percentage: 0,
      letterGrade: 'F',
      gpaEquivalent: 0,
      pointsPerItem: maxGrade / totalItems,
      pointsPerError: maxGrade / totalItems,
      gradeColor: '#DC3545',
      performanceLabel: 'Errors exceed total questions',
      performanceLabelAr: 'عدد الأخطاء يتجاوز إجمالي الأسئلة',
      isValid: false,
      errorMessage: `Errors (${errorsCount}) cannot exceed total items (${totalItems})`,
      errorMessageAr: `عدد الأخطاء (${errorsCount}) لا يمكن أن يتجاوز إجمالي الأسئلة (${totalItems})`,
    };
  }

  const percentage = Math.max(0, Math.min(100, (correctItems / totalItems) * 100));
  const rawScore = (correctItems / totalItems) * maxGrade;
  // Round score to 2 decimal places cleanly
  const score = Math.round(rawScore * 100) / 100;

  const pointsPerItem = maxGrade / totalItems;
  const pointsPerError = pointsPerItem;

  const { letterGrade, gpa, color } = resolveGradeScale(percentage, scale);
  const feedback = getPerformanceFeedback(percentage);

  return {
    totalItems,
    correctItems,
    errorsCount,
    maxGrade,
    score,
    percentage: Math.round(percentage * 10) / 10,
    letterGrade,
    gpaEquivalent: gpa,
    pointsPerItem: Math.round(pointsPerItem * 100) / 100,
    pointsPerError: Math.round(pointsPerError * 100) / 100,
    gradeColor: color,
    performanceLabel: feedback.en,
    performanceLabelAr: feedback.ar,
    isValid: true,
  };
}

export function generateGradeTable(
  totalItems: number,
  maxGrade: number = 100,
  scale: GradeScaleItem[] = DEFAULT_GRADE_SCALE
): GradeTableEntry[] {
  if (totalItems <= 0 || totalItems > 300) return [];

  const table: GradeTableEntry[] = [];
  for (let mistakes = 0; mistakes <= totalItems; mistakes++) {
    const correct = totalItems - mistakes;
    const percentage = (correct / totalItems) * 100;
    const rawScore = (correct / totalItems) * maxGrade;
    const score = Math.round(rawScore * 100) / 100;
    const { letterGrade, color } = resolveGradeScale(percentage, scale);

    table.push({
      mistakes,
      correct,
      score,
      percentage: Math.round(percentage * 10) / 10,
      letterGrade,
      color,
    });
  }

  return table;
}
