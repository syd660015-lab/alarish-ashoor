import React from 'react';
import { TeacherDataEntry } from '../types';

interface DashboardChartsProps {
  data: TeacherDataEntry[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ data }) => {
  const chartData = data.map(entry => ({
    grade: entry.grade,
    current: entry.currentCount,
    required: entry.requiredCount,
  }));

  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.current, d.required)),
    10
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-6">مقارنة العدد الحالي والمطلوب</h3>
      
      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-gray-700">{item.grade}</span>
              <span className="text-gray-500">الحالي: {item.current} | المطلوب: {item.required}</span>
            </div>
            
            <div className="flex gap-2 h-8">
              {/* Current Count Bar */}
              <div className="flex-1 bg-blue-100 rounded-lg overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-lg transition-all"
                  style={{ width: `${(item.current / maxValue) * 100}%` }}
                />
              </div>
              
              {/* Required Count Bar */}
              <div className="flex-1 bg-indigo-100 rounded-lg overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-lg transition-all"
                  style={{ width: `${(item.required / maxValue) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full" />
          <span className="text-gray-600">العدد الحالي</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-indigo-600 rounded-full" />
          <span className="text-gray-600">العدد المطلوب</span>
        </div>
      </div>
    </div>
  );
};
