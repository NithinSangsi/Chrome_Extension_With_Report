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
  await db.collection('usage').createIndex({ date: 1, domain: 1 });
}

app.post('/save-usage', async (req, res) => {
  const payload = req.body;
  if (!payload || !payload.date || !payload.domain || typeof payload.ms !== 'number') {
    return res.status(400).json({ error: 'Invalid payload.' });
  }
  if (!db) {
    return res.status(500).json({ error: 'Database not connected.' });
  }
  
  // Use aggregation pipeline to correctly convert ms → seconds → minutes → hours
  await db.collection('usage').updateOne(
    { date: payload.date, domain: payload.domain },
    [
      {
        // Stage 1: Add new ms to existing ms
        $set: {
          ms: { $add: [{ $ifNull: ['$ms', 0] }, payload.ms] },
          updatedAt: new Date()
        }
      },
      {
        // Stage 2: Convert ms to seconds, then seconds to minutes, then minutes to hours
        $set: {
          seconds: { $floor: { $divide: ['$ms', 1000] } }
        }
      },
      {
        // Stage 3: Calculate minutes from total seconds
        $set: {
          minutes: { $floor: { $divide: ['$seconds', 60] } }
        }
      },
      {
        // Stage 4: Calculate hours from total minutes
        $set: {
          hours: { $floor: { $divide: ['$minutes', 60] } }
        }
      }
    ],
    { upsert: true }
  );
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
