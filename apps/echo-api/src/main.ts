/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Echo endpoint
app.post('/api/echo', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      error: 'Text field is required'
    });
  }

  res.json({
    echo: text,
    timestamp: new Date().toISOString()
  });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
