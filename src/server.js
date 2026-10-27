import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { lessons as seedLessons, quizQuestions } from './seed.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json({ limit: '100kb' }));

const lessonSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, default: 'Beginner' },
  duration: { type: String, default: '10 min' },
  icon: { type: String, default: '📘' },
  summary: { type: String, required: true },
  objectives: [String],
  sections: [{ heading: String, body: String }],
  safetyNote: String
}, { timestamps: true });

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);
let databaseConnected = false;

async function getLessons() {
  if (databaseConnected) {
    const stored = await Lesson.find().lean();
    if (stored.length) return stored.map(({ _id, __v, ...lesson }) => lesson);
  }
  return seedLessons;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'VetSphere API', database: databaseConnected ? 'connected' : 'demo-mode' });
});

app.get('/api/lessons', async (_req, res, next) => {
  try {
    const allLessons = await getLessons();
    res.json({ lessons: allLessons, source: databaseConnected ? 'mongodb' : 'seed-data' });
  } catch (error) { next(error); }
});

app.get('/api/lessons/:id', async (req, res, next) => {
  try {
    const allLessons = await getLessons();
    const lesson = allLessons.find(item => item.id === req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found.' });
    res.json({ lesson });
  } catch (error) { next(error); }
});

app.get('/api/quiz', (_req, res) => {
  const questions = quizQuestions.map(({ answerIndex, ...question }) => question);
  res.json({ questions, note: 'Answers are checked in the browser for this Stage 1 demo.' });
});

app.use((req, res) => res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` }));
app.use((error, _req, res, _next) => {
  console.error('API error:', error.message);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

async function start() {
  if (process.env.MONGODB_URI?.trim()) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 4000 });
      databaseConnected = true;
      console.log('MongoDB connected.');
      const count = await Lesson.countDocuments();
      if (count === 0) {
        await Lesson.insertMany(seedLessons);
        console.log(`Seeded ${seedLessons.length} lessons into MongoDB.`);
      }
    } catch (error) {
      databaseConnected = false;
      console.warn(`MongoDB unavailable; continuing in demo mode (${error.message}).`);
    }
  } else {
    console.log('MONGODB_URI not set; using bundled demo data.');
  }

  app.listen(PORT, () => console.log(`VetSphere API listening at http://localhost:${PORT}`));
}

start();
