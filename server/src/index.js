require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

/* =========================
   CORS CONFIG
   ========================= */
app.use(cors({
  origin: [
    'https://xlentcar.com',
    'https://www.xlentcar.com',
    'https://xlentcar.vercel.app',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// Handle OPTIONS preflight
app.options('*', cors());

/* =========================
   BODY PARSERS
   ========================= */
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

/* =========================
   LOGGING
   ========================= */
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

/* =========================
   TEST ENDPOINTS (MUST WORK)
   ========================= */
app.get('/api/ping', (req, res) => {
  console.log('Ping endpoint hit');
  res.json({
    ok: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'XlentCar Backend API',
    status: 'running',
    version: '1.0.0'
  });
});

/* =========================
   LOAD ROUTES
   ========================= */
console.log('Attempting to load routes...');
try {
  const authRoutes = require('./routes/auth');
  const carsRoutes = require('./routes/cars');
  const subscribeRouter = require('./routes/subscribe');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/cars', carsRoutes);
  app.use('/api', subscribeRouter);
  
  console.log('Routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  // Fallback route
  app.post('/api/auth/login', (req, res) => {
    res.json({ error: 'Routes failed to load', message: error.message });
  });
}

/* =========================
   ERROR HANDLING
   ========================= */
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

/* =========================
   SERVER START (FIXED FOR RAILWAY)
   ========================= */
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0'; // FIX: Railway requires 0.0.0.0

if (!process.env.PORT) {
  console.warn('⚠️ PORT env var not set, using default:', PORT);
}

console.log(`Starting server on ${HOST}:${PORT}`);

const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server listening on ${HOST}:${PORT}`);
  console.log(`📅 ${new Date().toISOString()}`);
  console.log('✅ Ready to accept connections');
});

/* =========================
   SHUTDOWN HANDLERS
   ========================= */
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});

module.exports = app;