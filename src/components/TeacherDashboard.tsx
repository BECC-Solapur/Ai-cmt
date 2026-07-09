/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  ShieldAlert, 
  Download, 
  Filter, 
  ChevronRight, 
  ArrowUpRight,
  FileSpreadsheet,
  Printer,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend 
} from 'recharts';
import { StudentAssessment, User } from '../types';
import { CATEGORY_LABELS } from '../assessmentEngine';

interface TeacherDashboardProps {
  assessments: StudentAssessment[];
  users: User[];
  teacherUser: User;
  onSelectStudent: (studentId: string) => void;
}

export default function TeacherDashboard({
  assessments,
  users,
  teacherUser,
  onSelectStudent
}: TeacherDashboardProps) {
  // Filters
  const [filterClass, setFilterClass] = useState('All');
  const [filterSection, setFilterSection] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [filterAge, setFilterAge] = useState('All');

  // Filter students
  const filteredAssessments = useMemo(() => {
    return assessments.filter(a => {
      if (filterClass !== 'All' && a.studentDetails.grade !== filterClass) return false;
      if (filterSection !== 'All' && a.studentDetails.section !== filterSection) return false;
      if (filterGender !== 'All' && a.studentDetails.gender !== filterGender) return false;
      if (filterAge !== 'All' && a.studentDetails.age.toString() !== filterAge) return false;
      return true;
    });
  }, [assessments, filterClass, filterSection, filterGender, filterAge]);

  // Calculations for KPI Cards
  const totalStudentsCount = filteredAssessments.length;
  
  const classAvgGrowthIndex = useMemo(() => {
    if (totalStudentsCount === 0) return 0;
    const sum = filteredAssessments.reduce((acc, curr) => acc + curr.growthIndex, 0);
    return Math.round(sum / totalStudentsCount);
  }, [filteredAssessments, totalStudentsCount]);

  const emotionalHealth = useMemo(() => {
    if (totalStudentsCount === 0) return 0;
    const sum = filteredAssessments.reduce((acc, curr) => acc + (curr.scores['Emotional Regulation'] || 50), 0);
    return Math.round(sum / totalStudentsCount);
  }, [filteredAssessments, totalStudentsCount]);

  const studentsNeedingAttention = useMemo(() => {
    return filteredAssessments.filter(a => a.growthIndex < 60 || a.aiInsights.riskIndicator === 'High');
  }, [filteredAssessments]);

  // Student ranking data
  const studentRankings = useMemo(() => {
    return [...filteredAssessments].sort((a, b) => b.growthIndex - a.growthIndex);
  }, [filteredAssessments]);

  // Distribution chart data
  const careerDistribution = useMemo(() => {
    const counts: { [key: string]: number } = {
      'Tech / Research': 0,
      'Creative / Design': 0,
      'Social / Education': 0,
      'Leadership / Business': 0
    };
    
    filteredAssessments.forEach(a => {
      const cluster = a.aiInsights.predictions.careerCluster;
      if (cluster.includes('Technology') || cluster.includes('Research')) counts['Tech / Research']++;
      else if (cluster.includes('Creative') || cluster.includes('Design')) counts['Creative / Design']++;
      else if (cluster.includes('Business') || cluster.includes('Ventures')) counts['Leadership / Business']++;
      else counts['Social / Education']++;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredAssessments]);

  const careerColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'];

  // Check if dark class exists on document
  const isDark = false;

  // Exports CSV data trigger
  const handleExportCSV = () => {
    const headers = ['Name', 'Grade', 'Section', 'Age', 'Gender', 'Growth Index', 'Personality Type', 'Anxiety Risk'];
    const rows = filteredAssessments.map(a => [
      a.studentDetails.name,
      a.studentDetails.grade,
      a.studentDetails.section,
      a.studentDetails.age,
      a.studentDetails.gender,
      `${a.growthIndex}%`,
      a.aiInsights.personalityType,
      a.aiInsights.riskIndicator
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Class_Cohort_Analytics_${filterClass}_${filterSection}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="font-sans text-slate-800 p-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] text-blue-600 uppercase font-black tracking-widest flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> EDUCATOR COHORT PORTAL
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Cohort Analytics: {teacherUser.name}
          </h1>
          <p className="text-xs text-slate-500">
            Institution: {teacherUser.school || 'Pinecrest Academy'} • Department: student psychological growth monitoring
          </p>
        </div>

        {/* Dynamic Exports */}
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> Export Excel/CSV
          </button>
          
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Export PDF Report
          </button>
        </div>
      </div>

      {/* Interactive Filters Grid */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-wrap gap-4 items-center shadow-sm">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase shrink-0">
          <Filter className="h-4 w-4 text-blue-600" /> Filter Cohort:
        </div>

        {/* Class Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-semibold">Grade</span>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none shadow-xs"
          >
            <option value="All">All Grades</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
          </select>
        </div>

        {/* Section Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-semibold">Section</span>
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none shadow-xs"
          >
            <option value="All">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-semibold">Gender</span>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none shadow-xs"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Age Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-semibold">Age</span>
          <select
            value={filterAge}
            onChange={(e) => setFilterAge(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none shadow-xs"
          >
            <option value="All">All Ages</option>
            <option value="15">15 Years</option>
            <option value="16">16 Years</option>
            <option value="17">17 Years</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* TOTAL ENROLLED */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-blue-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Cohort size</span>
            <span className="text-lg font-bold text-slate-800">{totalStudentsCount} Enrolled</span>
          </div>
        </div>

        {/* CLASS AVG INDEX */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-full border-2 border-blue-500 flex items-center justify-center font-black text-slate-800 text-lg bg-slate-50">
            {classAvgGrowthIndex}%
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-blue-600 tracking-wider block">Cohort Growth Avg</span>
            <span className="text-xs font-bold text-slate-800">System Average</span>
          </div>
        </div>

        {/* CLASS EMOTIONAL HEALTH */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-emerald-600">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Emotional Health index</span>
            <span className="text-lg font-bold text-slate-800">{emotionalHealth}% Average</span>
          </div>
        </div>

        {/* RISK STUDENTS */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className={`p-3 rounded-xl border ${studentsNeedingAttention.length > 0 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Critical Risk Flag</span>
            <span className="text-lg font-bold text-slate-800">{studentsNeedingAttention.length} Students</span>
          </div>
        </div>
      </div>

      {/* Interactive Mastery Heatmap */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
          <TrendingUp className="h-4.5 w-4.5 text-blue-600" /> Cohort Category Mastery Heatmap
        </h3>
        <p className="text-[11px] text-slate-500">
          Visualizes detailed category performance for individual students. Cells represent percentage scores mapped as green (High Mastery), yellow (Developing), or red (Requires Support).
        </p>

        <div className="overflow-x-auto no-scrollbar rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[9px] font-bold">
              <tr>
                <th className="p-3.5 border-b border-slate-200">Student Name</th>
                <th className="p-2 border-b border-slate-200 text-center">Self</th>
                <th className="p-2 border-b border-slate-200 text-center">Conf</th>
                <th className="p-2 border-b border-slate-200 text-center">Learn</th>
                <th className="p-2 border-b border-slate-200 text-center">Motiv</th>
                <th className="p-2 border-b border-slate-200 text-center">Emot</th>
                <th className="p-2 border-b border-slate-200 text-center">Comm</th>
                <th className="p-2 border-b border-slate-200 text-center">Lead</th>
                <th className="p-2 border-b border-slate-200 text-center">Creat</th>
                <th className="p-2 border-b border-slate-200 text-center">Decis</th>
                <th className="p-2 border-b border-slate-200 text-center">Career</th>
                <th className="p-3.5 border-b border-slate-200 text-center">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 bg-white text-slate-700">
              {filteredAssessments.map(student => {
                const s = student.scores;
                const getHeatColor = (score: number) => {
                  if (score >= 75) return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
                  if (score >= 50) return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
                  return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
                };
                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-800">
                      <button 
                        onClick={() => onSelectStudent(student.studentId)}
                        className="text-left hover:text-blue-600 hover:underline transition cursor-pointer"
                      >
                        {student.studentDetails.name}
                      </button>
                    </td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Self Awareness'])}`}>{s['Self Awareness']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Confidence'])}`}>{s['Confidence']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Learning Style'])}`}>{s['Learning Style']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Motivation'])}`}>{s['Motivation']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Emotional Regulation'])}`}>{s['Emotional Regulation']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Communication'])}`}>{s['Communication']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Leadership'])}`}>{s['Leadership']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Creativity'])}`}>{s['Creativity']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Decision Making'])}`}>{s['Decision Making']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Career Interest'])}`}>{s['Career Interest']}%</span></td>
                    <td className="p-3.5 text-center font-bold text-blue-600 font-mono text-[11px]">{student.growthIndex}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cohort Distributions Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* STUDENTS NEEDING ATTENTION */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-4.5 w-4.5 text-rose-500" /> Critical Focus Group (Attention Needed)
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">Identified cohort students scoring below 60% Growth Index or exhibiting High stress risk baselines.</p>
          
          <div className="space-y-3">
            {studentsNeedingAttention.map(student => (
              <div key={student.id} className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-rose-600">{student.studentDetails.name}</p>
                  <p className="text-[10px] text-slate-500">Stress Risk: {student.aiInsights.predictions.stressRisk} • Learn Risk: {student.aiInsights.predictions.learningRisk}</p>
                </div>
                <button
                  onClick={() => onSelectStudent(student.studentId)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 text-[10px] font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition shadow-xs cursor-pointer"
                >
                  Analyze Profile
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COHORT CAREER ALIGNMENT */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Cohort Vocational Cluster Alignment</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">Displays estimated distribution of current cohort students across key modern vocational areas.</p>
          
          <div className="h-[200px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={careerDistribution}>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} />
                <YAxis stroke="#475569" fontSize={10} />
                <Tooltip contentStyle={{ background: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]}>
                  {careerDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={careerColors[index % careerColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* COHORT RANKINGS LIST */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Cohort Leaderboard Ranking</h3>
        <p className="text-[11px] text-slate-500">Detailed student listings filtered according to overall development indices.</p>

        <div className="overflow-x-auto no-scrollbar rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[9px] font-bold">
              <tr>
                <th className="p-3 border-b border-slate-200 text-center">Rank</th>
                <th className="p-3 border-b border-slate-200">Student Name</th>
                <th className="p-3 border-b border-slate-200">Personality Type</th>
                <th className="p-3 border-b border-slate-200">Anxiety Profile</th>
                <th className="p-3 border-b border-slate-200 text-center">Growth Index</th>
                <th className="p-3 border-b border-slate-200 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 bg-white text-slate-700">
              {studentRankings.map((student, idx) => (
                <tr key={student.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 text-center font-bold font-mono text-slate-500">#{idx + 1}</td>
                  <td className="p-3 font-bold text-slate-800">{student.studentDetails.name}</td>
                  <td className="p-3 text-slate-500 font-medium">{student.aiInsights.personalityType}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      student.aiInsights.riskIndicator === 'High' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :
                      student.aiInsights.riskIndicator === 'Medium' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    }`}>
                      {student.aiInsights.riskIndicator} Risk
                    </span>
                  </td>
                  <td className="p-3 text-center font-bold text-blue-600 font-mono text-[11px]">{student.growthIndex}%</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onSelectStudent(student.studentId)}
                      className="text-blue-600 hover:text-blue-700 font-bold transition flex items-center gap-0.5 mx-auto cursor-pointer"
                    >
                      View Report <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
