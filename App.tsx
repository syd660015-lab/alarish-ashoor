import React, { useState, useCallback } from 'react';
import { INITIAL_DATA, INITIAL_CLASS_COUNTS, INITIAL_STUDENT_COUNTS } from './constants';
import { SCHOOLS } from './schools';
import { TeacherDataEntry, ClassCounts, StudentCounts } from './types';
import { DataInputRow } from './components/dataInputRow';
import { SummaryCards } from './components/SummaryCards';
import { DashboardCharts } from './components/DashboardCharts';
import { AiAdvisor } from './components/AiAdvisor';
import { ClassCountSection } from './components/ClassCountSection';
import { SubjectPlan } from './components/SubjectPlan';
import { SchoolSelect, getSchoolTheme } from './components/SchoolSelect';
import { GraduationCap, Printer, School, Phone, FileSpreadsheet, Download, FileText, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<TeacherDataEntry[]>(INITIAL_DATA);
  const [classCounts, setClassCounts] = useState<ClassCounts>(INITIAL_CLASS_COUNTS);
  const [studentCounts, setStudentCounts] = useState<StudentCounts>(INITIAL_STUDENT_COUNTS);
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [isExportingWord, setIsExportingWord] = useState(false);

  const handleDataChange = useCallback((id: string, field: 'currentCount' | 'requiredCount', value: number) => {
    setData(prevData => prevData.map(item => 
      item.id === id ? { ...item, [field]: Math.max(0, value) } : item
    ));
  }, []);

  const handleClassCountChange = useCallback((field: keyof ClassCounts, value: number) => {
    setClassCounts(prev => ({
      ...prev,
      [field]: Math.max(0, value)
    }));
  }, []);

  const handleStudentCountChange = useCallback((field: keyof StudentCounts, value: number) => {
    setStudentCounts(prev => ({
      ...prev,
      [field]: Math.max(0, value)
    }));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportData = () => {
    const BOM = "\uFEFF";
    const csvHeader = "الدرجة الوظيفية,العدد الحالي,العدد المطلوب,العجز/الزيادة,النصاب\n";
    const csvRows = data.map(entry => {
      const difference = entry.currentCount - entry.requiredCount;
      return `"${entry.grade}",${entry.currentCount},${entry.requiredCount},${difference},${entry.quota}`;
    }).join("\n");
    
    const csvContent = BOM + csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const filename = selectedSchool 
      ? `teacher_data_${selectedSchool.replace(/\s+/g, '_')}.csv`
      : 'teacher_data.csv';
      
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSchools = () => {
    // BOM for Excel to recognize Arabic encoding correctly
    const BOM = "\uFEFF";
    const csvHeader = "م,اسم المدرسة\n";
    const csvRows = SCHOOLS.map((school, index) => `${index + 1},"${school}"`).join("\n");
    const csvContent = BOM + csvHeader + csvRows;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'schools_database.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportWord = async () => {
    setIsExportingWord(true);
    try {
      // Dynamic import to prevent load errors if docx fails or is heavy
      const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, AlignmentType, TextRun } = await import('docx');

      // Calculate Summaries
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
      const totalClasses = Object.values(classCounts).reduce((a: number, b) => a + (b as number), 0);
      const totalStudents = Object.values(studentCounts).reduce((a: number, b) => a + (b as number), 0);

      // Styles
      const cellBorder = {
        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      };

      const createCell = (text: string, bold = false, width = 20) => new TableCell({
        width: { size: width, type: WidthType.PERCENTAGE },
        borders: cellBorder,
        children: [new Paragraph({ 
          text, 
          bidirectional: true, 
          alignment: AlignmentType.CENTER,
          style: bold ? "Strong" : undefined
        })],
      });

      // Data Table Rows
      const tableRows = data.map(entry => {
        const difference = entry.currentCount - entry.requiredCount;
        const deficit = difference < 0 ? Math.abs(difference).toString() : "-";
        const surplus = difference > 0 ? difference.toString() : "-";

        return new TableRow({
          children: [
            createCell(entry.grade, true, 30),
            createCell(entry.currentCount.toString()),
            createCell(entry.requiredCount.toString()),
            createCell(deficit),
            createCell(surplus),
            createCell(entry.quota.toString()),
          ],
        });
      });

      // Header Row
      const headerRow = new TableRow({
        children: [
          createCell("الدرجة الوظيفية", true, 30),
          createCell("الحالي", true),
          createCell("المطلوب", true),
          createCell("العجز", true),
          createCell("الزيادة", true),
          createCell("النصاب", true),
        ],
      });

      // Document Construction
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Title
            new Paragraph({
              text: "تقرير العجز والزيادة في هيئة التدريس",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              bidirectional: true,
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "المدرسة: ", bold: true, size: 28 }),
                new TextRun({ text: selectedSchool || "غير محدد", size: 28 }),
              ],
              alignment: AlignmentType.CENTER,
              bidirectional: true,
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: `تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`,
              alignment: AlignmentType.CENTER,
              bidirectional: true,
              spacing: { after: 400 }
            }),

            // Class Counts Section
            new Paragraph({
              text: "بيانات الفصول والتلاميذ:",
              heading: HeadingLevel.HEADING_2,
              bidirectional: true,
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: `إجمالي عدد الفصول: ${totalClasses} | إجمالي عدد التلاميذ: ${totalStudents}`,
              bidirectional: true,
              spacing: { after: 200 }
            }),

            // Main Data Table
            new Paragraph({
              text: "جدول موازنة الكادر:",
              heading: HeadingLevel.HEADING_2,
              bidirectional: true,
              spacing: { after: 100 }
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [headerRow, ...tableRows],
            }),

            // Summary Section
            new Paragraph({
              text: "ملخص الإحصائيات:",
              heading: HeadingLevel.HEADING_2,
              bidirectional: true,
              spacing: { before: 400, after: 100 }
            }),
            new Paragraph({ text: `إجمالي المعلمين الحاليين: ${totalCurrent}`, bidirectional: true }),
            new Paragraph({ text: `إجمالي القوة المطلوبة: ${totalRequired}`, bidirectional: true }),
            new Paragraph({ text: `إجمالي العجز (معلم): ${totalDeficit}`, bidirectional: true }),
            new Paragraph({ text: `إجمالي الزيادة (معلم): ${totalSurplus}`, bidirectional: true }),

            // Signatures
            new Paragraph({
              text: "التوقيعات",
              heading: HeadingLevel.HEADING_2,
              bidirectional: true,
              spacing: { before: 800, after: 400 }
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: "مدير المدرسة", alignment: AlignmentType.CENTER, bidirectional: true })], borders: { top: { style: BorderStyle.NONE, size: 0, color: "auto" }, bottom: { style: BorderStyle.NONE, size: 0, color: "auto" }, left: { style: BorderStyle.NONE, size: 0, color: "auto" }, right: { style: BorderStyle.NONE, size: 0, color: "auto" } } }),
                    new TableCell({ children: [new Paragraph({ text: "مسؤول الإحصاء", alignment: AlignmentType.CENTER, bidirectional: true })], borders: { top: { style: BorderStyle.NONE, size: 0, color: "auto" }, bottom: { style: BorderStyle.NONE, size: 0, color: "auto" }, left: { style: BorderStyle.NONE, size: 0, color: "auto" }, right: { style: BorderStyle.NONE, size: 0, color: "auto" } } }),
                    new TableCell({ children: [new Paragraph({ text: "مدير الإدارة", alignment: AlignmentType.CENTER, bidirectional: true })], borders: { top: { style: BorderStyle.NONE, size: 0, color: "auto" }, bottom: { style: BorderStyle.NONE, size: 0, color: "auto" }, left: { style: BorderStyle.NONE, size: 0, color: "auto" }, right: { style: BorderStyle.NONE, size: 0, color: "auto" } } }),
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: "....................", alignment: AlignmentType.CENTER, spacing: { before: 600 } })], borders: { top: { style: BorderStyle.NONE, size: 0, color: "auto" }, bottom: { style: BorderStyle.NONE, size: 0, color: "auto" }, left: { style: BorderStyle.NONE, size: 0, color: "auto" }, right: { style: BorderStyle.NONE, size: 0, color: "auto" } } }),
                    new TableCell({ children: [new Paragraph({ text: "....................", alignment: AlignmentType.CENTER, spacing: { before: 600 } })], borders: { top: { style: BorderStyle.NONE, size: 0, color: "auto" }, bottom: { style: BorderStyle.NONE, size: 0, color: "auto" }, left: { style: BorderStyle.NONE, size: 0, color: "auto" }, right: { style: BorderStyle.NONE, size: 0, color: "auto" } } }),
                    new TableCell({ children: [new Paragraph({ text: "....................", alignment: AlignmentType.CENTER, spacing: { before: 600 } })], borders: { top: { style: BorderStyle.NONE, size: 0, color: "auto" }, bottom: { style: BorderStyle.NONE, size: 0, color: "auto" }, left: { style: BorderStyle.NONE, size: 0, color: "auto" }, right: { style: BorderStyle.NONE, size: 0, color: "auto" } } }),
                  ]
                })
              ]
            })
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `تقرير_${selectedSchool || 'المدرسة'}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating Word doc:", error);
      alert("حدث خطأ أثناء إنشاء ملف الوورد. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsExportingWord(false);
    }
  };

  const totalClasses = Object.values(classCounts).reduce((a: number, b) => a + (b as number), 0);
  const totalStudents = Object.values(studentCounts).reduce((a: number, b) => a + (b as number), 0);
  const schoolTheme = getSchoolTheme(selectedSchool);
  const SchoolIcon = schoolTheme.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">نظام موازنة الكادر</h1>
              <p className="text-xs text-gray-500">حساب العجز والزيادة للمعلمين</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportWord}
              disabled={isExportingWord}
              className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-2 rounded-lg transition-colors"
              title="تصدير التقرير إلى ملف Word"
            >
              {isExportingWord ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
              <span className="hidden sm:inline text-sm font-bold">تقرير Word</span>
            </button>
            
            <button 
              onClick={handleExportData}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-lg transition-colors"
              title="تصدير بيانات المعلمين إلى ملف CSV"
            >
              <Download size={20} />
              <span className="hidden sm:inline text-sm font-bold">تصدير البيانات</span>
            </button>
            <button 
              onClick={handleExportSchools}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-lg transition-colors"
              title="تصدير قائمة المدارس إلى Excel"
            >
              <FileSpreadsheet size={20} />
              <span className="hidden sm:inline text-sm font-bold">تصدير المدارس</span>
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              <Printer size={20} />
              <span className="hidden sm:inline">طباعة التقرير</span>
            </button>
          </div>
        </div>
      </header>

      {/* Print Header (Visible only when printing) */}
      <div className="hidden print:block text-center py-6 border-b-2 border-gray-800 mb-6">
        <h1 className="text-3xl font-black mb-6">تقرير العجز والزيادة في هيئة التدريس</h1>
        {selectedSchool && (
          <div className={`inline-flex items-center gap-3 px-8 py-3 rounded-xl border-2 ${schoolTheme.bg} ${schoolTheme.border} ${schoolTheme.color} mb-2`}>
             <SchoolIcon size={32} strokeWidth={2.5} />
             <h2 className="text-2xl font-black">
                مدرسة: {selectedSchool}
             </h2>
          </div>
        )}
        <div className="mt-6 flex justify-center gap-8 text-sm text-gray-600 font-semibold">
           <span>تاريخ التقرير: {new Date().toLocaleDateString('ar-EG')}</span>
           <span>إجمالي عدد الفصول: {totalClasses}</span>
           <span>إجمالي التلاميذ: {totalStudents}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex-grow">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 print:hidden">
            {/* School Selection */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <School size={24} />
                    <h2 className="text-lg font-bold text-gray-800 whitespace-nowrap">بيانات المدرسة</h2>
                  </div>
                  <div className="flex-1 w-full">
                    <SchoolSelect selectedSchool={selectedSchool} onChange={setSelectedSchool} />
                  </div>
              </div>
            </div>

            {/* Class Count Section (Compact) */}
            <div className="lg:col-span-1">
               <ClassCountSection 
                 counts={classCounts} 
                 studentCounts={studentCounts}
                 onChange={handleClassCountChange} 
                 onStudentChange={handleStudentCountChange}
               />
            </div>
        </div>

        {/* Print Only: Class Table Summary */}
        <div className="hidden print:block mb-8">
           <h3 className="text-lg font-bold mb-2 border-b pb-2">هيكل الفصول والتلاميذ:</h3>
           <div className="grid grid-cols-6 gap-2 text-center border p-2 rounded bg-gray-50">
              {['grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'grade6'].map((key, i) => {
                 const g = key as keyof ClassCounts;
                 const students = studentCounts[g as keyof StudentCounts];
                 const classes = classCounts[g];
                 const density = classes > 0 ? (students / classes).toFixed(0) : 0;
                 return (
                  <div key={key}>
                     <div className="text-xs text-gray-500 mb-1">الصف {i + 1}</div>
                     <div className="font-bold text-sm">{classes} فصل</div>
                     <div className="font-bold text-sm text-gray-600">{students} تلميذ</div>
                     {Number(density) > 0 && <div className="text-[10px] text-gray-400">({density}/فصل)</div>}
                  </div>
                 );
              })}
           </div>
        </div>

        {/* Summary Section */}
        <SummaryCards data={data} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column: Inputs & Subject Plan */}
          <div className="xl:col-span-1 space-y-4">
            {/* Teacher Input */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 flex justify-between items-center">
              <h2 className="font-bold text-gray-800 text-lg">إدخال بيانات المعلمين</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">يتم الحفظ تلقائياً</span>
            </div>
            
            <div className="space-y-3">
              {data.map(entry => (
                <DataInputRow 
                  key={entry.id} 
                  entry={entry} 
                  onChange={handleDataChange} 
                />
              ))}
            </div>

            {/* Subject Plan (Added here for better flow) */}
            <div className="mt-8">
               <SubjectPlan classCounts={classCounts} studentCounts={studentCounts} teacherData={data} />
            </div>
          </div>

          {/* Right Column: Visualization & AI */}
          <div className="xl:col-span-2 space-y-6">
            <DashboardCharts data={data} />
            {/* Pass school name and class counts to AI Advisor */}
            <AiAdvisor 
              data={data} 
              schoolName={selectedSchool} 
              classCounts={classCounts}
              studentCounts={studentCounts}
            /> 
          </div>

        </div>

        {/* Print Footer */}
        <div className="hidden print:block mt-8 text-center text-gray-500 border-t pt-4 break-inside-avoid">
          <div className="flex justify-between items-end px-12 mt-8">
             <div className="text-center">
                <p className="font-bold mb-12">مدير المدرسة</p>
                <p>.......................</p>
             </div>
             <div className="text-center">
                <p className="font-bold mb-12">مسؤول الإحصاء</p>
                <p>.......................</p>
             </div>
             <div className="text-center">
                <p className="font-bold mb-12">يعتمد، مدير الإدارة</p>
                <p>.......................</p>
             </div>
          </div>
        </div>

      </main>

      {/* Screen Footer with Credits */}
      <footer className="mt-12 bg-white border-t border-gray-200 py-6 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white p-2 pr-6 pl-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="text-right">
                <p className="text-[10px] text-gray-500 font-medium mb-0.5">تصميم وإعداد</p>
                <h3 className="font-bold text-gray-800 text-sm">د. أحمد عاشور الغول</h3>
                <div className="flex items-center justify-end gap-1 text-indigo-600 mt-0.5">
                   <span className="text-xs font-mono font-bold">01227233987</span>
                   <Phone size={10} />
                </div>
             </div>
             <div className="h-12 w-12 rounded-full bg-indigo-100 border-2 border-white shadow-sm overflow-hidden relative group">
                <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white font-bold text-lg">
                  أ.ع
                </div>
             </div>
          </div>
          <p className="text-[10px] text-gray-400">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
