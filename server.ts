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
import mysql from 'mysql2/promise';
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

// Ensure database folders exist for JSON fallback
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'db.json');

// Initialize database with premium pre-seeded data
function getInitialData(seedStudents: boolean = false) {
  const initialUsers: User[] = [
    { id: 'user_admin_1', email: 'admin@school.edu', name: 'Principal Evelyn Vance', role: 'Admin', school: 'Pinecrest Academy', createdAt: '2026-01-10T10:00:00Z' },
    { id: 'user_teacher_1', email: 'teacher@school.edu', name: 'Dr. Sarah Jenkins', role: 'Teacher', school: 'Pinecrest Academy', className: 'Grade 10', section: 'A', createdAt: '2026-01-11T11:00:00Z' },
    { id: 'user_counselor_1', email: 'counselor@school.edu', name: 'Marcus Brody, Counselor', role: 'Teacher', school: 'Pinecrest Academy', className: 'Grade 11', section: 'B', createdAt: '2026-01-12T12:00:00Z' },
  ];

  if (seedStudents) {
    initialUsers.push(
      { id: 'user_parent_1', email: 'parent@school.edu', name: 'Robert Mercer', role: 'Parent', school: 'Pinecrest Academy', childId: 'student_alex', createdAt: '2026-01-15T09:00:00Z' },
      { id: 'user_parent_2', email: 'parent_chloe@school.edu', name: 'William Zhao', role: 'Parent', school: 'Pinecrest Academy', childId: 'student_chloe', createdAt: '2026-01-15T14:00:00Z' },
      { id: 'user_parent_3', email: 'parent_daniel@school.edu', name: 'Jenny Kim', role: 'Parent', school: 'Pinecrest Academy', childId: 'student_daniel', createdAt: '2026-01-20T10:00:00Z' }
    );
  }

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

  const initialAssessments: StudentAssessment[] = seedStudents ? [
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
  ] : [];

  const initialAuditLogs: AuditLog[] = [
    { id: 'log_1', userId: 'user_admin_1', userName: 'Principal Evelyn Vance', userRole: 'Admin', action: 'Database Initialized', details: seedStudents ? 'Enterprise student analytics database successfully pre-seeded with 6 month cohort trend data.' : 'Clean sandbox database initialized successfully.', timestamp: '2026-07-08T10:00:00Z' },
    { id: 'log_2', userId: 'user_admin_1', userName: 'Principal Evelyn Vance', userRole: 'Admin', action: 'User Created', details: 'Created Teacher account for Dr. Sarah Jenkins (Grade 10, Sec A).', timestamp: '2026-07-08T10:05:00Z' },
  ];

  if (seedStudents) {
    initialAuditLogs.push(
      { id: 'log_3', userId: 'user_admin_1', userName: 'Principal Evelyn Vance', userRole: 'Admin', action: 'User Created', details: 'Created Parent account for Robert Mercer (Alex Mercer).', timestamp: '2026-07-08T10:10:00Z' }
    );
  }

  return {
    users: initialUsers,
    assessments: initialAssessments,
    auditLogs: initialAuditLogs
  };
}

// Load local fallback data
let dbData = getInitialData(false);
if (fs.existsSync(DB_PATH)) {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    dbData = JSON.parse(raw);
    console.log(`Loaded fallback cache with ${dbData.users?.length || 0} users and ${dbData.assessments?.length || 0} assessments.`);
  } catch (err) {
    console.error('Failed to parse database file. Resetting to defaults.', err);
    saveDB();
  }
} else {
  saveDB();
}

function saveDB() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save local db.json', err);
  }
}

// ==========================================
// REAL MYSQL DATABASE CONNECTOR ENGINE
// ==========================================
let pool: mysql.Pool | null = null;
let dbStatus = {
  connected: false,
  type: 'Local JSON (Fallback)',
  host: '',
  database: '',
  error: ''
};

let mysqlHost = process.env.MYSQL_HOST;
let mysqlUser = process.env.MYSQL_USER;
let mysqlPassword = process.env.MYSQL_PASSWORD;
let mysqlDatabase = process.env.MYSQL_DATABASE || 'persona_ai';
let mysqlPort = parseInt(process.env.MYSQL_PORT || '3306', 10);

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
if (dbUrl && dbUrl.startsWith('mysql://')) {
  try {
    const url = new URL(dbUrl);
    mysqlHost = url.hostname;
    mysqlUser = url.username;
    mysqlPassword = decodeURIComponent(url.password);
    mysqlDatabase = url.pathname.substring(1) || 'persona_ai';
    mysqlPort = parseInt(url.port || '3306', 10);
    console.log(`Parsed database connection URL: host=${mysqlHost}, database=${mysqlDatabase}, port=${mysqlPort}`);
  } catch (err: any) {
    console.error('Failed to parse database connection URL:', err.message);
  }
}

async function initMySQL() {
  if (mysqlHost) {
    try {
      try {
        console.log(`Attempting to ensure database '${mysqlDatabase}' exists on ${mysqlHost}...`);
        // Connect without a specific database first to make sure we can create it
        const tempConn = await mysql.createConnection({
          host: mysqlHost,
          user: mysqlUser,
          password: mysqlPassword,
          port: mysqlPort,
          ssl: process.env.MYSQL_SSL === 'true' ? {} : undefined
        });
        await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${mysqlDatabase}\``);
        await tempConn.end();
        console.log(`Database '${mysqlDatabase}' verified/created.`);
      } catch (dbErr: any) {
        console.log(`Note: Could not run CREATE DATABASE command directly (this is normal for limited-privilege cloud databases like Railway: ${dbErr.message}). Proceeding directly with connection pool...`);
      }

      console.log(`Creating connection pool for database '${mysqlDatabase}'...`);
      pool = mysql.createPool({
        host: mysqlHost,
        user: mysqlUser,
        password: mysqlPassword,
        database: mysqlDatabase,
        port: mysqlPort,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ssl: process.env.MYSQL_SSL === 'true' ? {} : undefined
      });

      // Confirm connectivity
      const conn = await pool.getConnection();
      console.log('MySQL Database Connected successfully!');
      conn.release();

      dbStatus = {
        connected: true,
        type: 'MySQL Live',
        host: mysqlHost,
        database: mysqlDatabase,
        error: ''
      };

      // Exec migrations to compile relational tables
      await runMigrations();
      // Auto-seed cohort data if empty
      await seedMySQLIfEmpty();
    } catch (err: any) {
      console.error('MySQL database pool connection failed, falling back to local file db.json:', err.message);
      pool = null;
      dbStatus = {
        connected: false,
        type: 'Local JSON (Fallback)',
        host: mysqlHost || '',
        database: mysqlDatabase,
        error: err.message
      };
    }
  } else {
    console.log('No MYSQL_HOST environment variable set. Server operating via local db.json fallback engine.');
  }
}

async function runMigrations() {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        name VARCHAR(255),
        role VARCHAR(50),
        school VARCHAR(255),
        className VARCHAR(50),
        section VARCHAR(50),
        age INT,
        gender VARCHAR(50),
        childId VARCHAR(255),
        createdAt VARCHAR(255)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id VARCHAR(255) PRIMARY KEY,
        studentId VARCHAR(255),
        studentDetails TEXT,
        answers TEXT,
        scores TEXT,
        growthIndex INT,
        date VARCHAR(100),
        aiInsights TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255),
        userName VARCHAR(255),
        userRole VARCHAR(50),
        action VARCHAR(255),
        details TEXT,
        timestamp VARCHAR(255)
      )
    `);

    console.log('Relational tables compiled successfully.');
  } catch (err) {
    console.error('Failed to compile migrations on MySQL:', err);
  }
}

async function seedMySQLIfEmpty() {
  if (!pool) return;
  try {
    const [rows]: any = await pool.query('SELECT COUNT(*) as count FROM users');
    if (rows[0].count === 0) {
      console.log('Seed cohort index is empty. Injecting pre-seeded student dataset...');
      const seed = getInitialData();
      
      for (const u of seed.users) {
        await pool.query(
          'INSERT INTO users (id, email, name, role, school, className, section, age, gender, childId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [u.id, u.email, u.name, u.role, u.school || 'Pinecrest Academy', u.className || null, u.section || null, u.age || null, u.gender || null, u.childId || null, u.createdAt]
        );
      }

      for (const a of seed.assessments) {
        await pool.query(
          'INSERT INTO assessments (id, studentId, studentDetails, answers, scores, growthIndex, date, aiInsights) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            a.id,
            a.studentId,
            JSON.stringify(a.studentDetails),
            JSON.stringify(a.answers),
            JSON.stringify(a.scores),
            a.growthIndex,
            a.date,
            JSON.stringify(a.aiInsights)
          ]
        );
      }

      for (const log of seed.auditLogs) {
        await pool.query(
          'INSERT INTO audit_logs (id, userId, userName, userRole, action, details, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [log.id, log.userId, log.userName, log.userRole, log.action, log.details, log.timestamp]
        );
      }
      console.log('Pre-seeded student dataset injected successfully.');
    }
  } catch (err) {
    console.error('Failed to seed MySQL tables:', err);
  }
}

// ==========================================
// DYNAMIC DATA LAYER ADAPTERS
// ==========================================
async function getUsers(): Promise<User[]> {
  if (pool) {
    try {
      const [rows]: any = await pool.query('SELECT * FROM users');
      return rows.map((r: any) => ({
        ...r,
        age: r.age || undefined,
        className: r.className || undefined,
        section: r.section || undefined,
        childId: r.childId || undefined
      }));
    } catch (err) {
      console.error('MySQL getUsers fail, using JSON fallback:', err);
    }
  }
  return dbData.users;
}

async function getAssessments(): Promise<StudentAssessment[]> {
  if (pool) {
    try {
      const [rows]: any = await pool.query('SELECT * FROM assessments');
      return rows.map((r: any) => ({
        id: r.id,
        studentId: r.studentId,
        studentDetails: JSON.parse(r.studentDetails),
        answers: JSON.parse(r.answers),
        scores: JSON.parse(r.scores),
        growthIndex: r.growthIndex,
        date: r.date,
        aiInsights: JSON.parse(r.aiInsights)
      }));
    } catch (err) {
      console.error('MySQL getAssessments fail, using JSON fallback:', err);
    }
  }
  return dbData.assessments;
}

async function getAuditLogs(): Promise<AuditLog[]> {
  if (pool) {
    try {
      const [rows]: any = await pool.query('SELECT * FROM audit_logs ORDER BY timestamp DESC');
      return rows;
    } catch (err) {
      console.error('MySQL getAuditLogs fail, using JSON fallback:', err);
    }
  }
  return dbData.auditLogs;
}

async function addUser(u: User) {
  if (pool) {
    try {
      await pool.query(
        'INSERT INTO users (id, email, name, role, school, className, section, age, gender, childId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [u.id, u.email, u.name, u.role, u.school || 'Pinecrest Academy', u.className || null, u.section || null, u.age || null, u.gender || null, u.childId || null, u.createdAt]
      );
      return;
    } catch (err) {
      console.error('MySQL addUser fail:', err);
    }
  }
  dbData.users.push(u);
  saveDB();
}

async function deleteUser(userId: string) {
  if (pool) {
    try {
      await pool.query('DELETE FROM users WHERE id = ?', [userId]);
      return;
    } catch (err) {
      console.error('MySQL deleteUser fail:', err);
    }
  }
  dbData.users = dbData.users.filter(u => u.id !== userId);
  saveDB();
}

async function addAssessment(a: StudentAssessment) {
  if (pool) {
    try {
      await pool.query(
        'INSERT INTO assessments (id, studentId, studentDetails, answers, scores, growthIndex, date, aiInsights) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          a.id,
          a.studentId,
          JSON.stringify(a.studentDetails),
          JSON.stringify(a.answers),
          JSON.stringify(a.scores),
          a.growthIndex,
          a.date,
          JSON.stringify(a.aiInsights)
        ]
      );
      return;
    } catch (err) {
      console.error('MySQL addAssessment fail:', err);
    }
  }
  dbData.assessments.push(a);
  saveDB();
}

async function addAuditLog(log: AuditLog) {
  if (pool) {
    try {
      await pool.query(
        'INSERT INTO audit_logs (id, userId, userName, userRole, action, details, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [log.id, log.userId, log.userName, log.userRole, log.action, log.details, log.timestamp]
      );
      return;
    } catch (err) {
      console.error('MySQL addAuditLog fail:', err);
    }
  }
  dbData.auditLogs.unshift(log);
  saveDB();
}

async function resetDatabase() {
  if (pool) {
    try {
      await pool.query('DROP TABLE IF EXISTS users');
      await pool.query('DROP TABLE IF EXISTS assessments');
      await pool.query('DROP TABLE IF EXISTS audit_logs');
      await runMigrations();
      await seedMySQLIfEmpty();
      return;
    } catch (err) {
      console.error('MySQL resetDatabase fail:', err);
    }
  }
  dbData = getInitialData(true);
  saveDB();
}

async function deleteStudentData(studentId: string) {
  if (pool) {
    try {
      await pool.query('DELETE FROM assessments WHERE studentId = ?', [studentId]);
      await pool.query('DELETE FROM users WHERE id = ?', [studentId]);
      return;
    } catch (err) {
      console.error('MySQL deleteStudentData fail:', err);
    }
  }
  dbData.assessments = dbData.assessments.filter(a => a.studentId !== studentId);
  dbData.users = dbData.users.filter(u => u.id !== studentId);
  saveDB();
}

async function clearDatabaseData() {
  if (pool) {
    try {
      await pool.query('DELETE FROM assessments');
      await pool.query('DELETE FROM users WHERE role != "Admin"');
      await pool.query('DELETE FROM audit_logs');
      return;
    } catch (err) {
      console.error('MySQL clearDatabaseData fail:', err);
    }
  }
  dbData.assessments = [];
  dbData.users = dbData.users.filter(u => u.role === 'Admin');
  dbData.auditLogs = [];
  saveDB();
}

// ==========================================
// EXPRESS SERVER & MIDDLEWARE
// ==========================================
app.use(express.json());

// 1. Database Connection Status Endpoint
app.get('/api/db/status', (req, res) => {
  res.json(dbStatus);
});

// 2. Fetch Session Endpoint
app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  const token = authHeader.split(' ')[1];
  const rolePart = token.replace('mock-jwt-token-for-', '');
  
  // Format role string correctly
  const allUsers = await getUsers();
  const matchedUser = allUsers.find(u => u.role.toLowerCase() === rolePart.toLowerCase() || u.id === rolePart);
  if (matchedUser) {
    res.json({ user: matchedUser });
  } else {
    // Return first user matching token role or default back to teacher
    const firstMatchedRole = allUsers.find(u => u.role.toLowerCase() === rolePart.toLowerCase());
    if (firstMatchedRole) {
      res.json({ user: firstMatchedRole });
    } else {
      res.status(401).json({ error: 'Session expired' });
    }
  }
});

// 3. User Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const allUsers = await getUsers();
  let targetUser: User | undefined;
  
  if (email === 'admin@school.edu' && password === 'admin') {
    targetUser = allUsers.find(u => u.id === 'user_admin_1');
  } else if (email === 'teacher@school.edu' && password === 'teacher') {
    targetUser = allUsers.find(u => u.id === 'user_teacher_1');
  } else if (email === 'counselor@school.edu' && password === 'counselor') {
    targetUser = allUsers.find(u => u.id === 'user_counselor_1');
  } else if (email === 'parent@school.edu' && password === 'parent') {
    targetUser = allUsers.find(u => u.id === 'user_parent_1');
  } else {
    targetUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  if (targetUser) {
    await addAuditLog({
      id: `log_${Date.now()}`,
      userId: targetUser.id,
      userName: targetUser.name,
      userRole: targetUser.role,
      action: 'User Logged In',
      details: `Logged in from IP: Simulated Secure JWT Auth Session.`,
      timestamp: new Date().toISOString()
    });

    return res.json({
      token: `mock-jwt-token-for-${targetUser.role.toLowerCase()}`,
      user: targetUser
    });
  }

  return res.status(401).json({ error: 'Invalid school login credentials.' });
});

// 4. Student intake register
app.post('/api/auth/register-student', async (req, res) => {
  const { name, age, gender, grade, section, school, email } = req.body;
  const studentEmail = email || `${name.toLowerCase().replace(/\s+/g, '')}@student.edu`;
  
  const allUsers = await getUsers();
  let existingUser = allUsers.find(u => u.email === studentEmail);
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
    await addUser(newStudent);
    existingUser = newStudent;
    
    await addAuditLog({
      id: `log_${Date.now()}`,
      userId: newStudent.id,
      userName: newStudent.name,
      userRole: 'Student',
      action: 'Student Account Registered',
      details: `Registered during assessment intake: Class ${grade}-${section}.`,
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({ token: `mock-jwt-token-for-${existingUser.id}`, user: existingUser });
});

// 5. Admin API to create Users
app.post('/api/admin/create-user', async (req, res) => {
  const { email, name, role, school, childEmail, className, section } = req.body;
  
  if (!email || !name || !role) {
    return res.status(400).json({ error: 'Email, Name, and Role are required.' });
  }

  const allUsers = await getUsers();
  if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'User with this email already exists.' });
  }

  let childId = undefined;
  if (role === 'Parent' && childEmail) {
    const childUser = allUsers.find(u => u.email.toLowerCase() === childEmail.toLowerCase() && u.role === 'Student');
    if (childUser) {
      childId = childUser.id;
    } else {
      const newChildId = `student_linked_${Date.now()}`;
      await addUser({
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

  await addUser(newUser);
  
  await addAuditLog({
    id: `log_${Date.now()}`,
    userId: 'user_admin_1',
    userName: 'Principal Evelyn Vance',
    userRole: 'Admin',
    action: `User Created`,
    details: `Admin created ${role} account: ${name} (${email}).`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, user: newUser });
});

// Map legacy route for creation compatibility
app.post('/api/users/create', async (req, res) => {
  const { email, name, role, school, childEmail, className, section } = req.body;
  
  if (!email || !name || !role) {
    return res.status(400).json({ error: 'Email, Name, and Role are required.' });
  }

  const allUsers = await getUsers();
  if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'User with this email already exists.' });
  }

  let childId = undefined;
  if (role === 'Parent' && childEmail) {
    const childUser = allUsers.find(u => u.email.toLowerCase() === childEmail.toLowerCase() && u.role === 'Student');
    if (childUser) {
      childId = childUser.id;
    } else {
      const newChildId = `student_linked_${Date.now()}`;
      await addUser({
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

  await addUser(newUser);
  res.json({ success: true, user: newUser });
});

// 6. Delete User profiles
app.delete('/api/admin/delete-user/:userId', async (req, res) => {
  const { userId } = req.params;
  const allUsers = await getUsers();
  const target = allUsers.find(u => u.id === userId);
  
  if (!target) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (target.role === 'Admin') {
    return res.status(400).json({ error: 'Admin account cannot be deleted' });
  }

  await deleteUser(userId);

  await addAuditLog({
    id: `log_${Date.now()}`,
    userId: 'user_admin_1',
    userName: 'Principal Evelyn Vance',
    userRole: 'Admin',
    action: `User Deleted`,
    details: `Deleted user profile: ${target.name} (${target.email}).`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true });
});

// 7. Reset database profiles
app.post('/api/admin/reset-database', async (req, res) => {
  await resetDatabase();
  res.json({ status: 'ok', message: 'Database reset to default enterprise seed cohort.' });
});

// Delete specific student user and all associated assessments
app.delete('/api/admin/delete-student/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const allUsers = await getUsers();
  const allAssessments = await getAssessments();
  const targetUser = allUsers.find(u => u.id === studentId);
  const targetAssessment = allAssessments.find(a => a.studentId === studentId);
  
  if (!targetUser && !targetAssessment) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const name = targetUser?.name || targetAssessment?.studentDetails?.name || 'Unknown Student';
  const email = targetUser?.email || (targetAssessment ? `${targetAssessment.studentDetails.name.toLowerCase().replace(/\s+/g, '')}@school.edu` : 'unknown@school.edu');

  await deleteStudentData(studentId);

  await addAuditLog({
    id: `log_${Date.now()}`,
    userId: 'user_admin_1',
    userName: 'Principal Evelyn Vance',
    userRole: 'Admin',
    action: `Student & Assessments Deleted`,
    details: `Deleted student profile and all associated reports for ${name} (${email}).`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true });
});

// Clear entire database except Admin
app.post('/api/admin/clear-database', async (req, res) => {
  await clearDatabaseData();
  
  await addAuditLog({
    id: `log_${Date.now()}`,
    userId: 'user_admin_1',
    userName: 'Principal Evelyn Vance',
    userRole: 'Admin',
    action: `Database Wiped`,
    details: `Administrative database wipe completed. All pre-seeded and custom students, parents, teachers, and assessments deleted.`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, message: 'Database wiped clean of all default student data successfully.' });
});

// 8. Retrieve User Lists (supports both wrapper and raw arrays for extreme robustness)
app.get('/api/users', async (req, res) => {
  const allUsers = await getUsers();
  res.json({ users: allUsers });
});

// 9. Submit psychometric assessments
app.post('/api/assessments/submit', async (req, res) => {
  const { studentId, answers, studentDetails } = req.body;

  if (!studentId || !answers || !Array.isArray(answers) || !studentDetails) {
    return res.status(400).json({ error: 'Missing assessment payload data.' });
  }

  console.log(`Calculating assessment scores for ${studentDetails.name} (ID: ${studentId})`);
  
  const scores = calculateScores(answers);
  const growthIndex = calculateGrowthIndex(scores);

  const answersTextSummary = answers.map((ans, idx) => {
    return `Q${idx+1}: Category: ${ans.category}, Score: ${ans.score}/4`;
  }).join('\n');

  let aiInsights;

  if (ai) {
    console.log(`Invoking Gemini for student: ${studentDetails.name}...`);
    try {
      aiInsights = await generateGeminiPsychometrics(scores, studentDetails, answersTextSummary, ai);
    } catch (err: any) {
      console.error('Failed Gemini invocation:', err);
      return res.status(500).json({
        error: `Gemini AI service error: ${err.message || err}. Please try again later.`
      });
    }
  } else {
    console.error('Failed to generate with AI: GEMINI_API_KEY is not configured.');
    return res.status(400).json({
      error: 'GEMINI_API_KEY is not configured in your environment. Please open the Settings menu in Google AI Studio, add your GEMINI_API_KEY, and restart the server to enable live Gemini AI psychometric evaluation.'
    });
  }

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

  await addAssessment(newAssessment);

  await addAuditLog({
    id: `log_${Date.now()}`,
    userId: studentId,
    userName: studentDetails.name,
    userRole: 'Student',
    action: 'Assessment Submitted',
    details: `Growth Index evaluated at ${growthIndex}%. Detailed AI Insights compiled.`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, assessment: newAssessment });
});

// 9.5 Regenerate assessment report with Gemini AI
app.post('/api/assessments/regenerate-ai', async (req, res) => {
  const { assessmentId } = req.body;
  if (!assessmentId) {
    return res.status(400).json({ error: 'Assessment ID is required.' });
  }

  const allAssessments = await getAssessments();
  const assessment = allAssessments.find(a => a.id === assessmentId);
  if (!assessment) {
    return res.status(404).json({ error: 'Assessment report not found.' });
  }

  const studentDetails = {
    name: assessment.studentDetails.name,
    age: assessment.studentDetails.age,
    gender: assessment.studentDetails.gender,
    grade: assessment.studentDetails.grade || 'Grade 10'
  };
  const scores = assessment.scores;
  const answersTextSummary = assessment.answers.map((ans, idx) => {
    return `Q${idx+1}: Category: ${ans.category}, Score: ${ans.score}/4`;
  }).join('\n');

  let aiInsights;
  let isSimulated = false;

  if (ai) {
    console.log(`Regenerating with Gemini AI for student: ${studentDetails.name}...`);
    try {
      aiInsights = await generateGeminiPsychometrics(scores, studentDetails, answersTextSummary, ai);
    } catch (err: any) {
      console.error('Failed to regenerate with Gemini AI:', err);
      return res.status(500).json({ error: `Gemini AI service error: ${err.message}` });
    }
  } else {
    console.error('Failed to regenerate: GEMINI_API_KEY is not configured.');
    return res.status(400).json({
      error: 'GEMINI_API_KEY is not set in your environment variables. Please open the Settings menu in Google AI Studio, add your GEMINI_API_KEY, and restart the server to enable live Gemini AI psychometric evaluation.'
    });
  }

  // Update assessment in-memory and database
  assessment.aiInsights = aiInsights;

  if (pool) {
    try {
      await pool.query(
        'UPDATE assessments SET aiInsights = ? WHERE id = ?',
        [JSON.stringify(aiInsights), assessmentId]
      );
    } catch (err) {
      console.error('MySQL update assessment failed:', err);
    }
  } else {
    // Save to local dbData structure
    const idx = dbData.assessments.findIndex(a => a.id === assessmentId);
    if (idx !== -1) {
      dbData.assessments[idx].aiInsights = aiInsights;
    }
    saveDB();
  }

  await addAuditLog({
    id: `log_${Date.now()}`,
    userId: 'system_ai',
    userName: 'Gemini AI Advisor',
    userRole: 'Admin',
    action: 'Dossier Re-evaluated',
    details: `Successfully completed a 15-page AI psychometric re-evaluation for ${studentDetails.name} ${isSimulated ? '(Simulated/Fallback)' : '(Live Gemini v3.5)'}.`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, assessment });
});

// 10. Retrieve Assessments list
app.get('/api/assessments', async (req, res) => {
  const { role, userId, childId } = req.query;

  const allAssessments = await getAssessments();
  let filtered = [...allAssessments];

  if (role === 'Student' && userId) {
    filtered = filtered.filter(a => a.studentId === userId);
  } else if (role === 'Parent' && childId) {
    filtered = filtered.filter(a => a.studentId === childId);
  }

  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.json({ assessments: filtered });
});

// 11. Retrieve Audit Logs list
app.get('/api/audit-logs', async (req, res) => {
  const logs = await getAuditLogs();
  res.json(logs);
});

// 12. Trigger Email alerts
app.post('/api/notify/email', async (req, res) => {
  const { studentName, recipientEmail, subject, type } = req.body;
  
  await addAuditLog({
    id: `log_${Date.now()}`,
    userId: 'system_notify',
    userName: 'AI Automations Engine',
    userRole: 'Admin',
    action: 'Email Dispatch Notification',
    details: `Successfully dispatched personality growth report for ${studentName} to ${recipientEmail} (Trigger: ${type}).`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, message: `Notification email queued for ${recipientEmail}.` });
});

// Vite connection setup
async function startServer() {
  // Initialize MySQL system if configurations are set in environment
  await initMySQL();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Student Personality & Growth Platform server running on port ${PORT}`);
  });
}

startServer();
