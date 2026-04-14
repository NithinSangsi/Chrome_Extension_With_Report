import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

let db;

async function connectDb() {
  if (!uri) {
    console.warn('MONGODB_URI not set. Analytics endpoint will return a warning response.');
    return;
  }
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db('productivity-tracker');
  await db.collection('usage').createIndex({ date: 1 });
}

app.post('/save-usage', async (req, res) => {
  const payload = req.body;
  if (!payload || !payload.date || !payload.domain || typeof payload.ms !== 'number') {
    return res.status(400).json({ error: 'Invalid payload.' });
  }
  if (!db) {
    return res.status(500).json({ error: 'Database not connected.' });
  }
  await db.collection('usage').insertOne(payload);
  res.json({ success: true });
});

app.get('/analytics', async (req, res) => {
  if (!db) {
    return res.status(500).json({ error: 'Database not connected.' });
  }
  const rows = await db.collection('usage').find().limit(1000).toArray();
  res.json({ data: rows });
});

app.listen(port, async () => {
  await connectDb();
  console.log(`Backend server listening on http://localhost:${port}`);
});
