import React from 'react';
import { TeacherDataEntry } from '../types';

interface DataInputRowProps {
  entry: TeacherDataEntry;
  onChange: (id: string, field: 'currentCount' | 'requiredCount', value: number) => void;
}

export const DataInputRow: React.FC<DataInputRowProps> = ({ entry, onChange }) => {
  const difference = entry.currentCount - entry.requiredCount;
  const showDeficit = difference < 0;
  const showSurplus = difference > 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
      <div className="font-bold text-gray-800 text-center">{entry.grade}</div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">العدد الحالي</label>
          <input
            type="number"
            value={entry.currentCount}
            onChange={(e) => onChange(entry.id, 'currentCount', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">العدد المطلوب</label>
          <input
            type="number"
            value={entry.requiredCount}
            onChange={(e) => onChange(entry.id, 'requiredCount', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div className={`p-2 rounded ${showDeficit ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'}`}>
          <div className="font-semibold">العجز</div>
          <div>{showDeficit ? Math.abs(difference) : '-'}</div>
        </div>
        <div className={`p-2 rounded ${showSurplus ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
          <div className="font-semibold">الزيادة</div>
          <div>{showSurplus ? difference : '-'}</div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200 text-center">
        <div className="text-xs text-gray-600">النصاب</div>
        <div className="font-bold text-lg text-gray-800">{entry.quota}</div>
      </div>
    </div>
  );
};
