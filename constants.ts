import { JobGrade, TeacherDataEntry, ClassCounts, StudentCounts } from './types';

export const INITIAL_DATA: TeacherDataEntry[] = [
  { id: '1', grade: JobGrade.SENIOR, currentCount: 0, requiredCount: 0, quota: 16 },
  { id: '2', grade: JobGrade.EXPERT, currentCount: 0, requiredCount: 0, quota: 18 },
  { id: '3', grade: JobGrade.FIRST_A, currentCount: 0, requiredCount: 0, quota: 20 },
  { id: '4', grade: JobGrade.FIRST, currentCount: 0, requiredCount: 0, quota: 22 },
  { id: '5', grade: JobGrade.TEACHER, currentCount: 0, requiredCount: 0, quota: 24 },
  { id: '6', grade: JobGrade.ASSISTANT, currentCount: 0, requiredCount: 0, quota: 24 },
];

export const INITIAL_CLASS_COUNTS: ClassCounts = {
  grade1: 0,
  grade2: 0,
  grade3: 0,
  grade4: 0,
  grade5: 0,
  grade6: 0,
};

export const INITIAL_STUDENT_COUNTS: StudentCounts = {
  grade1: 0,
  grade2: 0,
  grade3: 0,
  grade4: 0,
  grade5: 0,
  grade6: 0,
};