// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const pool = require('./db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({
      status: 'ok',
      db: rows?.[0]?.ok === 1,
      time: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await pool.query('SELECT 1');
    console.log(`✅ API lista en http://localhost:${PORT}`);
  } catch (err) {
    console.error('❌ Error conectando a la BD:', err.message);
  }
});
