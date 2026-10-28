import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { lessons as seedLessons, quizQuestions } from './seed.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json({ limit: '100kb' }));

const lessonSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, title: { type: String, required: true },
  category: { type: String, required: true }, level: { type: String, default: 'Beginner' },
  duration: { type: String, default: '10 min' }, icon: { type: String, default: '📘' },
  summary: { type: String, required: true }, objectives: [String], sections: [{ heading: String, body: String }], safetyNote: String
}, { timestamps: true });
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 70 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  completedLessons: { type: [String], default: [] },
  quizAttempts: { type: [{ score: Number, total: Number, completedAt: { type: Date, default: Date.now } }], default: [] }
}, { timestamps: true });
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
let databaseConnected = false;
const safeUser = user => ({ id: user._id.toString(), name: user.name, email: user.email, completedLessons: user.completedLessons || [], quizAttempts: user.quizAttempts || [] });
function makeToken(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be set to a random value of at least 32 characters.');
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d', issuer: 'vetsphere-api', audience: 'vetsphere-web' });
}
function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return res.status(401).json({ error: 'Please sign in to access your student progress.' });
  try { req.userId = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'vetsphere-api', audience: 'vetsphere-web' }).sub; next(); }
  catch { return res.status(401).json({ error: 'Your session is invalid or has expired. Please sign in again.' }); }
}
function requireDatabase(req, res, next) {
  if (!databaseConnected) return res.status(503).json({ error: 'Student accounts require a connected MongoDB database. Configure MONGODB_URI in backend/.env and restart the API.' });
  next();
}
async function getLessons() {
  if (databaseConnected) { const stored = await Lesson.find().lean(); if (stored.length) return stored.map(({ _id, __v, ...lesson }) => lesson); }
  return seedLessons;
}
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'VetSphere API', database: databaseConnected ? 'connected' : 'demo-mode', accounts: databaseConnected }));
app.get('/api/lessons', async (_req, res, next) => { try { res.json({ lessons: await getLessons(), source: databaseConnected ? 'mongodb' : 'seed-data' }); } catch (e) { next(e); } });
app.get('/api/lessons/:id', async (req, res, next) => { try { const lesson = (await getLessons()).find(item => item.id === req.params.id); if (!lesson) return res.status(404).json({ error: 'Lesson not found.' }); res.json({ lesson }); } catch (e) { next(e); } });
app.get('/api/quiz', (_req, res) => res.json({ questions: quizQuestions.map(({ answerIndex, ...q }) => q), note: 'Correct answers are not included in the public question response.' }));

app.post('/api/auth/register', requireDatabase, async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (name.length < 2 || name.length > 70) return res.status(400).json({ error: 'Name must be between 2 and 70 characters.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (password.length < 10 || password.length > 128) return res.status(400).json({ error: 'Password must be 10–128 characters long.' });
    if (await User.exists({ email })) return res.status(409).json({ error: 'An account with that email already exists.' });
    const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
    return res.status(201).json({ token: makeToken(user), user: safeUser(user) });
  } catch (e) { if (e.code === 11000) return res.status(409).json({ error: 'An account with that email already exists.' }); next(e); }
});
app.post('/api/auth/login', requireDatabase, async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ error: 'Email or password is incorrect.' });
    res.json({ token: makeToken(user), user: safeUser(user) });
  } catch (e) { next(e); }
});
app.get('/api/auth/me', requireDatabase, requireAuth, async (req, res, next) => {
  try { const user = await User.findById(req.userId); if (!user) return res.status(401).json({ error: 'Student account not found.' }); res.json({ user: safeUser(user) }); } catch (e) { next(e); }
});
app.get('/api/progress', requireDatabase, requireAuth, async (req, res, next) => {
  try { const user = await User.findById(req.userId); if (!user) return res.status(404).json({ error: 'Student account not found.' }); res.json({ completedLessons: user.completedLessons, quizAttempts: user.quizAttempts }); } catch (e) { next(e); }
});
app.put('/api/progress/lessons/:id', requireDatabase, requireAuth, async (req, res, next) => {
  try {
    const valid = (await getLessons()).some(l => l.id === req.params.id);
    if (!valid) return res.status(404).json({ error: 'Lesson not found.' });
    const complete = req.body.completed !== false;
    const update = complete ? { $addToSet: { completedLessons: req.params.id } } : { $pull: { completedLessons: req.params.id } };
    const user = await User.findByIdAndUpdate(req.userId, update, { new: true });
    if (!user) return res.status(404).json({ error: 'Student account not found.' });
    res.json({ completedLessons: user.completedLessons });
  } catch (e) { next(e); }
});
app.post('/api/progress/quiz', requireDatabase, requireAuth, async (req, res, next) => {
  try {
    const answers = req.body.answers;
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return res.status(400).json({ error: 'Submit an answers object keyed by question ID.' });
    let score = 0;
    for (const q of quizQuestions) if (Number.isInteger(answers[q.id]) && answers[q.id] === q.answerIndex) score++;
    const user = await User.findByIdAndUpdate(req.userId, { $push: { quizAttempts: { $each: [{ score, total: quizQuestions.length, completedAt: new Date() }], $slice: -50 } } }, { new: true });
    if (!user) return res.status(404).json({ error: 'Student account not found.' });
    res.json({ score, total: quizQuestions.length, quizAttempts: user.quizAttempts });
  } catch (e) { next(e); }
});
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use((error, _req, res, _next) => { console.error('API error:', error.message); res.status(500).json({ error: 'An unexpected server error occurred.' }); });

async function start() {
  if (process.env.MONGODB_URI?.trim()) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 }); databaseConnected = true; console.log('MongoDB connected.');
      if (await Lesson.countDocuments() === 0) { await Lesson.insertMany(seedLessons); console.log(`Seeded ${seedLessons.length} lessons.`); }
    } catch (e) { databaseConnected = false; console.warn(`MongoDB unavailable; using demo mode (${e.message}). Student accounts remain disabled.`); }
  } else console.log('MONGODB_URI not set; using bundled demo content. Configure MongoDB to enable student accounts.');
  app.listen(PORT, () => console.log(`VetSphere API listening at http://localhost:${PORT}`));
}
start();
