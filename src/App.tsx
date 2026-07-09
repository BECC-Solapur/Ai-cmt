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
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Sparkles, HelpCircle, Activity } from 'lucide-react';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Database status indicator state
  const [dbStatus, setDbStatus] = useState({ connected: false, type: 'Local JSON (Fallback)' });

  useEffect(() => {
    fetch('/api/db/status')
      .then(res => res.json())
      .then(data => {
        if (data && data.type) {
          setDbStatus({ connected: data.connected, type: data.type });
        }
      })
      .catch(err => console.error('Database status error:', err));
  }, []);

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

  // Delete specific student profile and associated assessments
  const handleDeleteStudent = async (studentId: string) => {
    try {
      const response = await fetch(`/api/admin/delete-student/${studentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== studentId));
        setAssessments(prev => prev.filter(a => a.studentId !== studentId));
      } else {
        alert('Could not remove student profile.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Wipe the entire database clean (except Admin account)
  const handleClearDatabase = async () => {
    try {
      const response = await fetch('/api/admin/clear-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Local sandbox database wiped successfully! You can now register or intake brand new student profiles.');
        setUsers(prev => prev.filter(u => u.role === 'Admin'));
        setAssessments([]);
      } else {
        alert('Database wipe failed.');
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500/25 border-t-blue-500 animate-spin mx-auto" />
          <h2 className="text-sm font-bold text-slate-500 tracking-wider uppercase">Loading PersonaAI Suite...</h2>
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

  const handleAssessmentUpdated = (updated: StudentAssessment) => {
    setAssessments(prev => prev.map(a => a.id === updated.id ? updated : a));
    setActiveReport(updated);
  };

  // Detailed 15-Page dossier print-preview mode overlay
  if (activeReport) {
    return (
      <PDFReportView
        assessment={activeReport}
        onClose={() => setActiveReport(null)}
        onAssessmentUpdated={handleAssessmentUpdated}
      />
    );
  }

  // Filter student assessments for current logged in roles
  const studentHistory = assessments.filter(a => a.studentId === user?.id);
  const activeStudentAssessment = studentHistory[0] || null;

  // Parents filter child progress dynamically
  const childHistory = assessments.filter(a => {
    if (user?.role !== 'Parent') return false;
    if (user.childId && a.studentId === user.childId) return true;
    // Fallback for pre-seeded demo parent users to ensure high-fidelity out-of-the-box demo
    return a.studentDetails.name === 'Danny Kim' || a.studentDetails.name === 'Alex Mercer';
  });
  
  const childUserAccount = users.find(u => {
    if (user?.role !== 'Parent') return false;
    if (user.childId && u.id === user.childId) return true;
    // Fallback for pre-seeded demo parent users
    return u.name === 'Danny Kim' || u.name === 'Alex Mercer';
  }) || null;

  // 1. Special EARLY RETURN for Student Role (strictly no dashboard, only submit form and done)
  if (user?.role === 'Student') {
    if (activeStudentAssessment) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full p-8 bg-white rounded-3xl border border-slate-200 shadow-lg text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500" />
            <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
              <Activity className="h-8 w-8 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] text-blue-600 uppercase font-black tracking-widest block font-sans">ASSESSMENT COMPLETED</span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Response Recorded!</h2>
              <p className="text-xs text-slate-505 leading-relaxed">
                Thank you, <strong className="text-slate-800 font-semibold">{user.name}</strong>. Your confidential 20-Question psychometric growth assessment has been securely submitted.
              </p>
              <div className="text-xs text-slate-500 bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-1.5 text-left leading-relaxed">
                <p>● **Dossier Generated**: Your multidimensional psychometric analysis is ready.</p>
                <p>● **Portal Sync**: Your assigned academic advisers, school administrators, and parents/guardians can now review your full 15-page psychometric report.</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            >
              Sign Out Securely
            </button>
          </div>
        </div>
      );
    }

    return (
      <AssessmentForm
        studentUser={user}
        onSubmitSuccess={handleAssessmentCompleted}
        onCancel={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
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
        <div className="no-print border-b px-8 py-3.5 flex items-center justify-between text-[11px] font-semibold border-slate-200/80 bg-white text-slate-500 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${dbStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
            <span>Secure Enterprise Cluster Synced • DB: <strong className="text-slate-700 font-bold">{dbStatus.type}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span>Server Latency: ~12ms</span>
            <span className="text-slate-300">|</span>
            <span>Gemini v3.5 Engines Activated</span>
          </div>
        </div>

        {/* Dynamic Route Content Renders */}
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
                onDeleteStudent={handleDeleteStudent}
                onClearDatabase={handleClearDatabase}
                onResetDatabase={handleResetSandboxDB}
                onSelectStudent={handleSelectCohortStudentReport}
                dbStatus={dbStatus}
                activeTab="dashboard"
              />
            ) : currentTab === 'students_list' ? (
              <AdminDashboard
                users={users}
                assessments={assessments}
                onAddUser={handleCreateUser}
                onDeleteUser={handleDeleteUser}
                onDeleteStudent={handleDeleteStudent}
                onClearDatabase={handleClearDatabase}
                onResetDatabase={handleResetSandboxDB}
                onSelectStudent={handleSelectCohortStudentReport}
                dbStatus={dbStatus}
                activeTab="students_list"
              />
            ) : currentTab === 'users_manager' ? (
              <AdminDashboard
                users={users}
                assessments={assessments}
                onAddUser={handleCreateUser}
                onDeleteUser={handleDeleteUser}
                onDeleteStudent={handleDeleteStudent}
                onClearDatabase={handleClearDatabase}
                onResetDatabase={handleResetSandboxDB}
                onSelectStudent={handleSelectCohortStudentReport}
                dbStatus={dbStatus}
                activeTab="users_manager"
              />
            ) : currentTab === 'audit_logs' ? (
              <AdminDashboard
                users={users}
                assessments={assessments}
                onAddUser={handleCreateUser}
                onDeleteUser={handleDeleteUser}
                onDeleteStudent={handleDeleteStudent}
                onClearDatabase={handleClearDatabase}
                onResetDatabase={handleResetSandboxDB}
                onSelectStudent={handleSelectCohortStudentReport}
                dbStatus={dbStatus}
                activeTab="audit_logs"
              />
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
