import React from 'react';
import { SCHOOLS } from '../schools';
import { School, BookOpen, Zap, Trophy } from 'lucide-react';

interface SchoolSelectProps {
  selectedSchool: string;
  onChange: (school: string) => void;
}

export interface SchoolTheme {
  bg: string;
  border: string;
  color: string;
  icon: React.ReactNode;
}

export const SchoolSelect: React.FC<SchoolSelectProps> = ({ selectedSchool, onChange }) => {
  return (
    <select
      value={selectedSchool}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
    >
      <option value="">اختر المدرسة</option>
      {SCHOOLS.map((school) => (
        <option key={school} value={school}>
          {school}
        </option>
      ))}
    </select>
  );
};

export const getSchoolTheme = (schoolName: string): SchoolTheme => {
  // Return theme based on school name
  const themes: { [key: string]: SchoolTheme } = {
    default: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      color: 'text-blue-700',
      icon: School,
    },
  };

  return themes.default;
};
