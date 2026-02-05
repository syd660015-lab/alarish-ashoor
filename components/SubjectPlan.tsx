import React from 'react';
import { BookMarked } from 'lucide-react';

export const SubjectPlan: React.FC = () => {
  const subjects = [
    { name: 'اللغة العربية', code: 'AR' },
    { name: 'الرياضيات', code: 'MATH' },
    { name: 'اللغة الإنجليزية', code: 'EN' },
    { name: 'العلوم', code: 'SC' },
    { name: 'الدراسات الاجتماعية', code: 'SS' },
    { name: 'التربية الإسلامية', code: 'IS' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <BookMarked size={20} className="text-indigo-600" />
        <h3 className="text-lg font-bold text-gray-800">خطة التوزيع المقترحة</h3>
      </div>

      <div className="space-y-3">
        {subjects.map((subject) => (
          <div
            key={subject.code}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="font-semibold text-gray-700">{subject.name}</span>
            <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
              {subject.code}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        هذه قائمة بالمواد الأساسية المتوقعة توزيعها على المعلمين
      </p>
    </div>
  );
};
