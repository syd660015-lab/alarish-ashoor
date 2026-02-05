import React from 'react';
import { TeacherDataEntry } from '../types';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';

interface SummaryCardsProps {
  data: TeacherDataEntry[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  const totalCurrent = data.reduce((acc, curr) => acc + curr.currentCount, 0);
  const totalRequired = data.reduce((acc, curr) => acc + curr.requiredCount, 0);
  
  const totalDeficit = data.reduce((acc, curr) => {
    const diff = curr.currentCount - curr.requiredCount;
    return diff < 0 ? acc + Math.abs(diff) : acc;
  }, 0);

  const totalSurplus = data.reduce((acc, curr) => {
    const diff = curr.currentCount - curr.requiredCount;
    return diff > 0 ? acc + diff : acc;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 print:mb-4">
      {/* Total Current */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-blue-600 uppercase">إجمالي الحالي</span>
          <Users size={20} className="text-blue-600" />
        </div>
        <div className="text-3xl font-black text-blue-900">{totalCurrent}</div>
        <p className="text-xs text-blue-600 mt-1">معلم</p>
      </div>

      {/* Total Required */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-indigo-600 uppercase">إجمالي المطلوب</span>
          <Users size={20} className="text-indigo-600" />
        </div>
        <div className="text-3xl font-black text-indigo-900">{totalRequired}</div>
        <p className="text-xs text-indigo-600 mt-1">معلم</p>
      </div>

      {/* Total Deficit */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-red-600 uppercase">إجمالي العجز</span>
          <TrendingDown size={20} className="text-red-600" />
        </div>
        <div className="text-3xl font-black text-red-900">{totalDeficit}</div>
        <p className="text-xs text-red-600 mt-1">معلم</p>
      </div>

      {/* Total Surplus */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-green-600 uppercase">إجمالي الزيادة</span>
          <TrendingUp size={20} className="text-green-600" />
        </div>
        <div className="text-3xl font-black text-green-900">{totalSurplus}</div>
        <p className="text-xs text-green-600 mt-1">معلم</p>
      </div>
    </div>
  );
};
