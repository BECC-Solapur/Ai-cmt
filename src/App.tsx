/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  StudentAssessment, 
  UserRole 
} from './types';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import AssessmentForm from './components/AssessmentForm';
import PDFReportView from './components/PDFReportView';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Sparkles, HelpCircle, Activity } from 'lucide-react';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Application Data States
  const [assessments, setAssessments] = useState<StudentAssessment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Assessment Wizards & Report Overlays
  const [assessmentInProgress, setAssessmentInProgress] = useState<boolean>(false);
  const [activeReport, setActiveReport] = useState<StudentAssessment | null>(null);

  // Check auth session on startup
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${storedToken}` }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          // Sync state with token
          setToken(storedToken);
        } else {
          // Token expired or invalid
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Session validation connection issue:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  // Sync assessments and users when authenticated
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch user profiles (for administrative/teacher tools)
        const uRes = await fetch('/api/users', { headers });
        if (uRes.ok) {
          const uData = await uRes.json();
          setUsers(uData.users);
        }

        // Fetch student assessments dossiers
        const aRes = await fetch('/api/assessments', { headers });
        if (aRes.ok) {
          const aData = await aRes.json();
          setAssessments(aData.assessments);
        }
      } catch (err) {
        console.error('Cohort data retrieval issue:', err);
      }
    };

    loadData();
  }, [user, token]);

  // Handle successful login
  const handleLoginSuccess = (newToken: string, loggedInUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(loggedInUser);
    setCurrentTab('dashboard');
    setActiveReport(null);
    setAssessmentInProgress(false);
  };

  // Student intake register direct start
  const handleStudentIntakeStart = (details: { token: string; user: User }) => {
    localStorage.setItem('token', details.token);
    setToken(details.token);
    setUser(details.user);
    setAssessmentInProgress(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAssessments([]);
    setUsers([]);
    setActiveReport(null);
    setAssessmentInProgress(false);
  };

  // Demo shortcut login helper
  const handleQuickDemoLogin = async (role: UserRole) => {
    try {
      const emailMap = {
        'Admin': 'admin@school.edu',
        'Teacher': 'teacher@school.edu',
        'Parent': 'parent@school.edu',
        'Student': 'student@school.edu'
      };
      
      const pwdMap = {
        'Admin': 'admin',
        'Teacher': 'teacher',
        'Parent': 'parent',
        'Student': 'student'
      };

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailMap[role],
          password: pwdMap[role]
        })
      });

      if (response.ok) {
        const data = await response.json();
        handleLoginSuccess(data.token, data.user);
      } else {
        alert(`Failed to execute demonstration shortcut for ${role}. Please reset database.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger dynamic DB reset to original pre-seeded cohort data
  const handleResetSandboxDB = async () => {
    try {
      const response = await fetch('/api/admin/reset-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Local sandbox database successfully reseeded with multi-role enterprise cohort!');
        // Quick session reload
        handleLogout();
      } else {
        alert('Database reset failed. Try restarting development server.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add customized Parent or Teacher user profile to server DB
  const handleCreateUser = async (userPayload: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userPayload)
      });

      if (response.ok) {
        const data = await response.json();
        // Append newly created user to state
        setUsers(prev => [...prev, data.user]);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Delete specific teacher/parent user profile
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/delete-user/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        alert('Could not remove user. Only non-admin credentials can be deleted.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Successful assessment questionnaire intake handler
  const handleAssessmentCompleted = (completedResult: StudentAssessment) => {
    // Append to local state list
    setAssessments(prev => [completedResult, ...prev]);
    setActiveReport(completedResult);
    setAssessmentInProgress(false);
    setCurrentTab('dashboard');
  };

  // Trigger automated email mock notification
  const handleNotifyParentAlert = (studentName: string, email: string) => {
    // Standard system logging/reporting notification
    console.log(`Automated Parent Notification sent out for student '${studentName}' to email '${email}'.`);
  };

  // Teacher dashboard selecting a child profile to inspect
  const handleSelectCohortStudentReport = (studentId: string) => {
    // Find active assessment for that student
    const studAss = assessments.find(a => a.studentId === studentId);
    if (studAss) {
      setActiveReport(studAss);
    } else {
      alert("No active psychometric profile registered for this student yet.");
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin mx-auto" />
          <h2 className="text-sm font-bold text-slate-300 tracking-wider uppercase">Loading PersonaAI Suite...</h2>
        </div>
      </div>
    );
  }

  // Login Portal View (if unauthenticated and not taking assessment)
  if (!user && !assessmentInProgress) {
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess}
        onStudentStart={handleStudentIntakeStart}
        onResetDatabase={handleResetSandboxDB}
      />
    );
  }

  // Active Assessment taking screen (wizard style override)
  if (assessmentInProgress && user) {
    return (
      <AssessmentForm
        studentUser={user}
        onSubmitSuccess={handleAssessmentCompleted}
        onCancel={() => setAssessmentInProgress(false)}
      />
    );
  }

  // Detailed 15-Page dossier print-preview mode overlay
  if (activeReport) {
    return (
      <PDFReportView
        assessment={activeReport}
        onClose={() => setActiveReport(null)}
      />
    );
  }

  // Filter student assessments for current logged in roles
  const studentHistory = assessments.filter(a => a.studentId === user?.id);
  const activeStudentAssessment = studentHistory[0] || null;

  // Parents filter child progress
  const childHistory = assessments.filter(a => user?.role === 'Parent' ? a.studentDetails.name === 'Danny Kim' || a.studentDetails.name === 'Alex Mercer' : false);
  const childUserAccount = users.find(u => user?.role === 'Parent' ? u.name === 'Danny Kim' || u.name === 'Alex Mercer' : false) || null;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} font-sans`}>
      
      {/* Dynamic Sidebar navigation */}
      <Sidebar 
        user={user}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onQuickLogin={handleQuickDemoLogin}
        onResetDatabase={handleResetSandboxDB}
      />

      {/* Main Panel Content Frame */}
      <main className="pl-64 min-h-screen pb-12">
        {/* Top Mini Header */}
        <div className={`no-print border-b px-8 py-3.5 flex items-center justify-between text-[11px] font-semibold ${
          darkMode ? 'border-slate-800/60 bg-slate-950/40 text-slate-400' : 'border-slate-200/80 bg-white text-slate-500 shadow-xs'
        }`}>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Secure Enterprise Cluster Synced</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Server Latency: ~12ms</span>
            <span className="text-slate-700">|</span>
            <span>Gemini v3.5 Engines Activated</span>
          </div>
        </div>

        {/* Dynamic Route Content Renders */}
        {user?.role === 'Student' && (
          <div>
            {currentTab === 'dashboard' ? (
              <StudentDashboard
                assessment={activeStudentAssessment}
                history={studentHistory}
                onTakeAssessment={() => setAssessmentInProgress(true)}
                onOpenReport={() => setActiveReport(activeStudentAssessment)}
                onNotifyParent={handleNotifyParentAlert}
              />
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Menu section in progress. Please use 'My Dashboard' to interact.
              </div>
            )}
          </div>
        )}

        {user?.role === 'Teacher' && (
          <div>
            {currentTab === 'dashboard' ? (
              <TeacherDashboard
                assessments={assessments}
                users={users}
                teacherUser={user}
                onSelectStudent={handleSelectCohortStudentReport}
              />
            ) : currentTab === 'students_list' ? (
              <div className="p-8">
                <TeacherDashboard
                  assessments={assessments}
                  users={users}
                  teacherUser={user}
                  onSelectStudent={handleSelectCohortStudentReport}
                />
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Feature block in progress.
              </div>
            )}
          </div>
        )}

        {user?.role === 'Parent' && (
          <div>
            {currentTab === 'dashboard' ? (
              <ParentDashboard
                childAssessments={childHistory}
                childUser={childUserAccount}
                parentUser={user}
                onOpenReport={() => setActiveReport(childHistory[0] || null)}
              />
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Feature block in progress.
              </div>
            )}
          </div>
        )}

        {user?.role === 'Admin' && (
          <div>
            {currentTab === 'dashboard' ? (
              <AdminDashboard
                users={users}
                assessments={assessments}
                onAddUser={handleCreateUser}
                onDeleteUser={handleDeleteUser}
                onResetDatabase={handleResetSandboxDB}
              />
            ) : currentTab === 'users_manager' ? (
              <div className="p-8">
                <AdminDashboard
                  users={users}
                  assessments={assessments}
                  onAddUser={handleCreateUser}
                  onDeleteUser={handleDeleteUser}
                  onResetDatabase={handleResetSandboxDB}
                />
              </div>
            ) : currentTab === 'audit_logs' ? (
              <div className="p-8">
                <AdminDashboard
                  users={users}
                  assessments={assessments}
                  onAddUser={handleCreateUser}
                  onDeleteUser={handleDeleteUser}
                  onResetDatabase={handleResetSandboxDB}
                />
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Administrative block.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
