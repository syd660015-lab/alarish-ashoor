import React from 'react';
import { ClassCounts, StudentCounts } from '../types';
import { BookOpen, Users as UsersIcon } from 'lucide-react';

interface ClassCountSectionProps {
  counts: ClassCounts;
  studentCounts: StudentCounts;
  onChange: (field: keyof ClassCounts, value: number) => void;
  onStudentChange: (field: keyof StudentCounts, value: number) => void;
}

export const ClassCountSection: React.FC<ClassCountSectionProps> = ({
  counts,
  studentCounts,
  onChange,
  onStudentChange,
}) => {
  const totalClasses = Object.values(counts).reduce((a, b) => a + (b || 0), 0);
  const totalStudents = Object.values(studentCounts).reduce((a, b) => a + (b || 0), 0);

  const grades = ['grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'grade6'] as const;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">بيانات الفصول والتلاميذ</h3>

      <div className="space-y-4">
        {grades.map((grade, index) => (
          <div key={grade} className="pb-4 border-b border-gray-100 last:border-0">
            <label className="block text-sm font-semibold text-gray-700 mb-2">الصف {index + 1}</label>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <BookOpen size={14} />
                  عدد الفصول
                </label>
                <input
                  type="number"
                  value={counts[grade]}
                  onChange={(e) => onChange(grade, parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <UsersIcon size={14} />
                  عدد التلاميذ
                </label>
                <input
                  type="number"
                  value={studentCounts[grade]}
                  onChange={(e) => onStudentChange(grade, parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t-2 border-gray-200 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-xs text-blue-600 font-semibold">إجمالي الفصول</div>
          <div className="text-2xl font-black text-blue-900">{totalClasses}</div>
        </div>
        <div className="bg-indigo-50 p-3 rounded-lg text-center">
          <div className="text-xs text-indigo-600 font-semibold">إجمالي التلاميذ</div>
          <div className="text-2xl font-black text-indigo-900">{totalStudents}</div>
        </div>
      </div>
    </div>
  );
};
