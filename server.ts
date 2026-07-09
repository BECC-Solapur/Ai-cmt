/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { calculateScores, calculateGrowthIndex, generateLocalPsychometrics, generateGeminiPsychometrics } from './src/assessmentEngine';
import { StudentAssessment, User, AuditLog } from './src/types';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (GEMINI_KEY && GEMINI_KEY !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: GEMINI_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log('Gemini AI Client initialized successfully for Server-side analysis.');
  } catch (err) {
    console.error('Failed to initialize Gemini Client:', err);
  }
} else {
  console.log('No valid GEMINI_API_KEY environment variable found. Falling back to local scoring engine.');
}

// Ensure database folders exist
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'db.json');

// Initialize database with premium pre-seeded data
function getInitialData() {
  const initialUsers: User[] = [
    { id: 'user_admin_1', email: 'admin@school.edu', name: 'Principal Evelyn Vance', role: 'Admin', school: 'Pinecrest Academy', createdAt: '2026-01-10T10:00:00Z' },
    { id: 'user_teacher_1', email: 'teacher@school.edu', name: 'Dr. Sarah Jenkins', role: 'Teacher', school: 'Pinecrest Academy', className: 'Grade 10', section: 'A', createdAt: '2026-01-11T11:00:00Z' },
    { id: 'user_counselor_1', email: 'counselor@school.edu', name: 'Marcus Brody, Counselor', role: 'Teacher', school: 'Pinecrest Academy', className: 'Grade 11', section: 'B', createdAt: '2026-01-12T12:00:00Z' },
    { id: 'user_parent_1', email: 'parent@school.edu', name: 'Robert Mercer', role: 'Parent', school: 'Pinecrest Academy', childId: 'student_alex', createdAt: '2026-01-15T09:00:00Z' },
    { id: 'user_parent_2', email: 'parent_chloe@school.edu', name: 'William Zhao', role: 'Parent', school: 'Pinecrest Academy', childId: 'student_chloe', createdAt: '2026-01-15T14:00:00Z' },
    { id: 'user_parent_3', email: 'parent_daniel@school.edu', name: 'Jenny Kim', role: 'Parent', school: 'Pinecrest Academy', childId: 'student_daniel', createdAt: '2026-01-20T10:00:00Z' },
  ];

  // Helper to generate mock assessment
  const generateMockAssessment = (
    id: string,
    studentId: string,
    name: string,
    age: number,
    gender: string,
    grade: string,
    section: string,
    scoresOverride: { [cat: string]: number },
    date: string
  ): StudentAssessment => {
    // Generate mock answers matching scoresOverride
    // Percentage score S = ((Raw - 2) / 6) * 100 -> Raw = Math.round((S * 6) / 100) + 2
    // We split Raw into two values (e.g. half/half) each between 1 and 4.
    const answers = Object.entries(scoresOverride).flatMap(([cat, score]) => {
      const raw = Math.round((score * 6) / 100) + 2;
      const first = Math.min(4, Math.max(1, Math.round(raw / 2)));
      const second = Math.min(4, Math.max(1, raw - first));
      return [
        { questionId: 1, category: cat, score: first },
        { questionId: 2, category: cat, score: second }
      ];
    });

    const scores = calculateScores(answers);
    const growthIndex = calculateGrowthIndex(scores);
    const aiInsights = generateLocalPsychometrics(scores, { name, age, gender });

    return {
      id,
      studentId,
      studentDetails: { name, age, gender, grade, section, school: 'Pinecrest Academy' },
      answers,
      scores,
      growthIndex,
      date,
      aiInsights
    };
  };

  const initialAssessments: StudentAssessment[] = [
    // Alex Mercer: historical progression to show Monthly Growth Line Charts!
    generateMockAssessment(
      'assess_alex_1', 'student_alex', 'Alex Mercer', 16, 'Male', 'Grade 10', 'A',
      {
        'Self Awareness': 55, 'Confidence': 45, 'Learning Style': 70, 'Motivation': 50,
        'Emotional Regulation': 60, 'Communication': 50, 'Leadership': 40, 'Creativity': 60,
        'Decision Making': 50, 'Career Interest': 55
      },
      '2026-02-08'
    ),
    generateMockAssessment(
      'assess_alex_2', 'student_alex', 'Alex Mercer', 16, 'Male', 'Grade 10', 'A',
      {
        'Self Awareness': 75, 'Confidence': 70, 'Learning Style': 85, 'Motivation': 80,
        'Emotional Regulation': 75, 'Communication': 80, 'Leadership': 65, 'Creativity': 80,
        'Decision Making': 75, 'Career Interest': 80
      },
      '2026-07-08'
    ),

    // Chloe Zhao: exceptionally creative high-performer
    generateMockAssessment(
      'assess_chloe_1', 'student_chloe', 'Chloe Zhao', 15, 'Female', 'Grade 10', 'A',
      {
        'Self Awareness': 85, 'Confidence': 90, 'Learning Style': 90, 'Motivation': 95,
        'Emotional Regulation': 80, 'Communication': 90, 'Leadership': 85, 'Creativity': 100,
        'Decision Making': 80, 'Career Interest': 95
      },
      '2026-06-25'
    ),

    // Maya Patel: steady academic focus
    generateMockAssessment(
      'assess_maya_1', 'student_maya', 'Maya Patel', 16, 'Female', 'Grade 10', 'B',
      {
        'Self Awareness': 70, 'Confidence': 65, 'Learning Style': 80, 'Motivation': 75,
        'Emotional Regulation': 70, 'Communication': 60, 'Leadership': 55, 'Creativity': 70,
        'Decision Making': 75, 'Career Interest': 70
      },
      '2026-04-12'
    ),

    // Daniel Kim: HIGH RISK student showing severe academic stress and low emotional regulation
    generateMockAssessment(
      'assess_daniel_1', 'student_daniel', 'Daniel Kim', 15, 'Male', 'Grade 10', 'B',
      {
        'Self Awareness': 40, 'Confidence': 30, 'Learning Style': 50, 'Motivation': 35,
        'Emotional Regulation': 25, 'Communication': 35, 'Leadership': 20, 'Creativity': 45,
        'Decision Making': 30, 'Career Interest': 40
      },
      '2026-07-01'
    ),

    // Rohan Dev: strong independent tech-focused student
    generateMockAssessment(
      'assess_rohan_1', 'student_rohan', 'Rohan Dev', 16, 'Male', 'Grade 10', 'A',
      {
        'Self Awareness': 80, 'Confidence': 75, 'Learning Style': 85, 'Motivation': 90,
        'Emotional Regulation': 70, 'Communication': 65, 'Leadership': 60, 'Creativity': 85,
        'Decision Making': 80, 'Career Interest': 90
      },
      '2026-07-03'
    ),

    // Liam Gallagher: strong extrovert / high leadership profile
    generateMockAssessment(
      'assess_liam_1', 'student_liam', 'Liam Gallagher', 17, 'Male', 'Grade 11', 'A',
      {
        'Self Awareness': 75, 'Confidence': 85, 'Learning Style': 70, 'Motivation': 80,
        'Emotional Regulation': 75, 'Communication': 90, 'Leadership': 95, 'Creativity': 75,
        'Decision Making': 85, 'Career Interest': 80
      },
      '2026-05-18'
    ),

    // Aisha Nwosu: focused, mature leader
    generateMockAssessment(
      'assess_aisha_1', 'student_aisha', 'Aisha Nwosu', 17, 'Female', 'Grade 11', 'B',
      {
        'Self Awareness': 90, 'Confidence': 80, 'Learning Style': 85, 'Motivation': 85,
        'Emotional Regulation': 85, 'Communication': 80, 'Leadership': 85, 'Creativity': 80,
        'Decision Making': 90, 'Career Interest': 85
      },
      '2026-06-08'
    ),
  ];

  const initialAuditLogs: AuditLog[] = [
    { id: 'log_1', userId: 'user_admin_1', userName: 'Principal Evelyn Vance', userRole: 'Admin', action: 'Database Initialized', details: 'Enterprise student analytics database successfully pre-seeded with 6 month cohort trend data.', timestamp: '2026-07-08T10:00:00Z' },
    { id: 'log_2', userId: 'user_admin_1', userName: 'Principal Evelyn Vance', userRole: 'Admin', action: 'User Created', details: 'Created Teacher account for Dr. Sarah Jenkins (Grade 10, Sec A).', timestamp: '2026-07-08T10:05:00Z' },
    { id: 'log_3', userId: 'user_admin_1', userName: 'Principal Evelyn Vance', userRole: 'Admin', action: 'User Created', details: 'Created Parent account for Robert Mercer (Alex Mercer).', timestamp: '2026-07-08T10:10:00Z' }
  ];

  return {
    users: initialUsers,
    assessments: initialAssessments,
    auditLogs: initialAuditLogs
  };
}

// Load or seed DB
let dbData = getInitialData();
if (fs.existsSync(DB_PATH)) {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    dbData = JSON.parse(raw);
    console.log(`Loaded ${dbData.users?.length || 0} users and ${dbData.assessments?.length || 0} assessments from db.json.`);
  } catch (err) {
    console.error('Failed to parse database file. Resetting to defaults.', err);
    saveDB();
  }
} else {
  saveDB();
}

function saveDB() {
  fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), 'utf-8');
}

// Express middle-wares
app.use(express.json());

// API Endpoints

// Reset Database API
app.get('/api/reset-db', (req, res) => {
  dbData = getInitialData();
  saveDB();
  res.json({ status: 'ok', message: 'Database reset to default enterprise seed cohort.' });
});

// Authentication API (Simulated secure authentication with simple structures)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Handle default developer quick accounts
  let targetUser: User | undefined;
  
  if (email === 'admin@school.edu' && password === 'admin') {
    targetUser = dbData.users.find(u => u.id === 'user_admin_1');
  } else if (email === 'teacher@school.edu' && password === 'teacher') {
    targetUser = dbData.users.find(u => u.id === 'user_teacher_1');
  } else if (email === 'counselor@school.edu' && password === 'counselor') {
    targetUser = dbData.users.find(u => u.id === 'user_counselor_1');
  } else if (email === 'parent@school.edu' && password === 'parent') {
    targetUser = dbData.users.find(u => u.id === 'user_parent_1');
  } else {
    // Dynamic look up
    targetUser = dbData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  if (targetUser) {
    // Log action
    dbData.auditLogs.unshift({
      id: `log_${Date.now()}`,
      userId: targetUser.id,
      userName: targetUser.name,
      userRole: targetUser.role,
      action: 'User Logged In',
      details: `Logged in from IP: Simulated Secure JWT Auth Session.`,
      timestamp: new Date().toISOString()
    });
    saveDB();

    return res.json({
      token: `mock-jwt-token-for-${targetUser.role.toLowerCase()}`,
      user: targetUser
    });
  }

  return res.status(401).json({ error: 'Invalid school login credentials.' });
});

// Student assessment direct login / register on form completion
app.post('/api/auth/register-student', (req, res) => {
  const { name, age, gender, grade, section, school, email } = req.body;
  
  const studentEmail = email || `${name.toLowerCase().replace(/\s+/g, '')}@student.edu`;
  
  // Find or create user
  let existingUser = dbData.users.find(u => u.email === studentEmail);
  if (!existingUser) {
    const newStudent: User = {
      id: `student_${Date.now()}`,
      email: studentEmail,
      name,
      role: 'Student',
      school: school || 'Pinecrest Academy',
      className: grade,
      section,
      age: parseInt(age, 10) || 16,
      gender,
      createdAt: new Date().toISOString()
    };
    dbData.users.push(newStudent);
    existingUser = newStudent;
    
    // Log audit
    dbData.auditLogs.unshift({
      id: `log_${Date.now()}`,
      userId: newStudent.id,
      userName: newStudent.name,
      userRole: 'Student',
      action: 'Student Account Registered',
      details: `Registered during assessment intake: Class ${grade}-${section}.`,
      timestamp: new Date().toISOString()
    });
    saveDB();
  }
  
  res.json({ token: 'mock-jwt-student', user: existingUser });
});

// Admin API to create Teachers and Parents
app.post('/api/users/create', (req, res) => {
  const { email, name, role, school, childEmail, className, section } = req.body;
  
  if (!email || !name || !role) {
    return res.status(400).json({ error: 'Email, Name, and Role are required.' });
  }

  // Check if user exists
  if (dbData.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'User with this email already exists.' });
  }

  let childId = undefined;
  if (role === 'Parent' && childEmail) {
    // Try to find the child ID
    const childUser = dbData.users.find(u => u.email.toLowerCase() === childEmail.toLowerCase() && u.role === 'Student');
    if (childUser) {
      childId = childUser.id;
    } else {
      // Create a dummy placeholder student first so they are linked
      const newChildId = `student_linked_${Date.now()}`;
      dbData.users.push({
        id: newChildId,
        email: childEmail,
        name: `${name}'s Child`,
        role: 'Student',
        school: school || 'Pinecrest Academy',
        className: className || 'Grade 10',
        section: section || 'A',
        createdAt: new Date().toISOString()
      });
      childId = newChildId;
    }
  }

  const newUser: User = {
    id: `user_${role.toLowerCase()}_${Date.now()}`,
    email,
    name,
    role,
    school: school || 'Pinecrest Academy',
    childId,
    className,
    section,
    createdAt: new Date().toISOString()
  };

  dbData.users.push(newUser);
  
  // Log audit
  dbData.auditLogs.unshift({
    id: `log_${Date.now()}`,
    userId: 'user_admin_1',
    userName: 'Principal Evelyn Vance',
    userRole: 'Admin',
    action: `User Created`,
    details: `Admin created ${role} account: ${name} (${email}).`,
    timestamp: new Date().toISOString()
  });

  saveDB();
  res.json({ success: true, user: newUser });
});

// Retrieve User List
app.get('/api/users', (req, res) => {
  res.json(dbData.users);
});

// Submit MCQ Assessment and generate AI Insights
app.post('/api/assessments/submit', async (req, res) => {
  const { studentId, answers, studentDetails } = req.body;

  if (!studentId || !answers || !Array.isArray(answers) || !studentDetails) {
    return res.status(400).json({ error: 'Missing assessment payload data.' });
  }

  console.log(`Calculating assessment scores for ${studentDetails.name} (ID: ${studentId})`);
  
  // 1. Calculate percentage scores
  const scores = calculateScores(answers);
  const growthIndex = calculateGrowthIndex(scores);

  // 2. Compile questionnaire context for Gemini to read
  const answersTextSummary = answers.map((ans, idx) => {
    return `Q${idx+1}: Category: ${ans.category}, Score: ${ans.score}/4`;
  }).join('\n');

  let aiInsights;

  // 3. Trigger Server-side AI or fall back
  if (ai) {
    console.log(`Invoking Gemini 3.5 Flash Model for student: ${studentDetails.name}...`);
    try {
      aiInsights = await generateGeminiPsychometrics(scores, studentDetails, answersTextSummary, ai);
    } catch (err) {
      console.error('Failed Gemini invocation, running fallback analysis engine.', err);
      aiInsights = generateLocalPsychometrics(scores, studentDetails);
    }
  } else {
    console.log('Running deterministic psychological analysis rules (No Gemini key available).');
    aiInsights = generateLocalPsychometrics(scores, studentDetails);
  }

  // 4. Store result
  const assessmentId = `assess_${Date.now()}`;
  const newAssessment: StudentAssessment = {
    id: assessmentId,
    studentId,
    studentDetails: {
      name: studentDetails.name,
      age: parseInt(studentDetails.age, 10) || 16,
      gender: studentDetails.gender,
      grade: studentDetails.grade,
      section: studentDetails.section,
      school: studentDetails.school || 'Pinecrest Academy'
    },
    answers,
    scores,
    growthIndex,
    date: new Date().toISOString().split('T')[0],
    aiInsights
  };

  dbData.assessments.push(newAssessment);

  // Log action
  dbData.auditLogs.unshift({
    id: `log_${Date.now()}`,
    userId: studentId,
    userName: studentDetails.name,
    userRole: 'Student',
    action: 'Assessment Submitted',
    details: `Growth Index evaluated at ${growthIndex}%. Detailed AI Insights compiled.`,
    timestamp: new Date().toISOString()
  });

  saveDB();

  res.json({ success: true, assessment: newAssessment });
});

// Retrieve Assessment List (with Role based access check)
app.get('/api/assessments', (req, res) => {
  const { role, userId, childId } = req.query;

  let filtered = [...dbData.assessments];

  if (role === 'Student' && userId) {
    filtered = filtered.filter(a => a.studentId === userId);
  } else if (role === 'Parent' && childId) {
    filtered = filtered.filter(a => a.studentId === childId);
  } else if (role === 'Teacher') {
    // Teachers see assessments from their school (usually all preseeded)
    // Filters can be handled on client side, let's keep all available for teachers
  }

  // Sort by date descending
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  res.json(filtered);
});

// Retrieve Audit Logs for activity timelines
app.get('/api/audit-logs', (req, res) => {
  res.json(dbData.auditLogs);
});

// Simulates real-time e-mail parent / teacher notifications
app.post('/api/notify/email', (req, res) => {
  const { studentName, recipientEmail, subject, type } = req.body;
  
  // Log simulated notification
  dbData.auditLogs.unshift({
    id: `log_${Date.now()}`,
    userId: 'system_notify',
    userName: 'AI Automations Engine',
    userRole: 'Admin',
    action: 'Email Dispatch Notification',
    details: `Successfully dispatched personality growth report for ${studentName} to ${recipientEmail} (Trigger: ${type}).`,
    timestamp: new Date().toISOString()
  });

  saveDB();
  res.json({ success: true, message: `Notification email queued for ${recipientEmail}.` });
});

// Vite server connection setup for development and production build handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static builds
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Student Personality & Growth Platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
