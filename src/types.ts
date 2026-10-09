export type InputMode = 'errors' | 'correct';

export interface GradeInput {
  totalItems: number;
  errorsOrCorrect: number;
  maxGrade: number;
  inputMode: InputMode; // whether user is entering mistakes or correct answers
}

export interface GradeScaleItem {
  grade: string;
  minPercent: number;
  gpa: number;
  color: string;
}

export interface CalculationResult {
  totalItems: number;
  correctItems: number;
  errorsCount: number;
  maxGrade: number;
  score: number;
  percentage: number;
  letterGrade: string;
  gpaEquivalent: number;
  pointsPerItem: number;
  pointsPerError: number;
  gradeColor: string;
  performanceLabel: string;
  performanceLabelAr: string;
  isValid: boolean;
  errorMessage?: string;
  errorMessageAr?: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  studentOrExamName: string;
  totalItems: number;
  errorsCount: number;
  score: number;
  maxGrade: number;
  percentage: number;
  letterGrade: string;
}

export interface GradeTableEntry {
  mistakes: number;
  correct: number;
  score: number;
  percentage: number;
  letterGrade: string;
  color: string;
}

export type Language = 'en' | 'ar';
