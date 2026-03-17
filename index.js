const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Keepa proxy running' });
});

// Proxy all /keepa/* → api.keepa.com/*
app.get('/keepa/*', async (req, res) => {
  const path = req.url.replace('/keepa', '');
  const keepaUrl = `https://api.keepa.com${path}`;
  try {
    const response = await fetch(keepaUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Keepa proxy running on port ${PORT}`);
});
