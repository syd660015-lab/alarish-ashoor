import React from 'react';
import { TeacherDataEntry } from '../types';
import { Lightbulb } from 'lucide-react';

interface AiAdvisorProps {
  data: TeacherDataEntry[];
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ data }) => {
  const totalDeficit = data.reduce((acc, curr) => {
    const diff = curr.currentCount - curr.requiredCount;
    return diff < 0 ? acc + Math.abs(diff) : acc;
  }, 0);

  const deficitGrades = data.filter(entry => (entry.currentCount - entry.requiredCount) < 0);

  const getInsights = () => {
    if (totalDeficit === 0) {
      return "لا يوجد عجز في الكادر التعليمي. الوضع الحالي متوازن.";
    }
    
    if (deficitGrades.length === 0) {
      return "جميع الدرجات الوظيفية لديها كادر كافي أو زائد.";
    }

    const criticalGrades = deficitGrades.filter(g => (g.requiredCount - g.currentCount) > 5);
    
    if (criticalGrades.length > 0) {
      return `يوجد عجز حرج في: ${criticalGrades.map(g => g.grade).join('، ')}. يتطلب توظيف فوري.`;
    }

    return `إجمالي العجز: ${totalDeficit} معلم. يتطلب تخطيط للتوظيف.`;
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <Lightbulb className="text-amber-600 flex-shrink-0 mt-1" size={20} />
        <div>
          <h3 className="font-bold text-amber-900 text-sm mb-1">ملاحظات ذكية</h3>
          <p className="text-sm text-amber-800">{getInsights()}</p>
        </div>
      </div>
    </div>
  );
};
