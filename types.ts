export enum JobGrade {
  SENIOR = 'كبير معلمين',
  EXPERT = 'معلم خبير',
  FIRST_A = 'معلم أول (أ)',
  FIRST = 'معلم أول',
  TEACHER = 'معلم',
  ASSISTANT = 'معلم مساعد'
}

export interface TeacherDataEntry {
  id: string;
  grade: JobGrade;
  currentCount: number; // العدد الحالي
  requiredCount: number; // العدد المطلوب (الملاك)
  quota: number; // نصاب الحصص
}

export interface ClassCounts {
  grade1: number;
  grade2: number;
  grade3: number;
  grade4: number;
  grade5: number;
  grade6: number;
}

export interface StudentCounts {
  grade1: number;
  grade2: number;
  grade3: number;
  grade4: number;
  grade5: number;
  grade6: number;
}

export interface CalculationResult {
  grade: JobGrade;
  difference: number; // if negative: deficit (عجز), if positive: surplus (زيادة)
  status: 'deficit' | 'surplus' | 'balanced';
}