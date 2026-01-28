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
    'https://xlent-production.up.railway.app',
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
// Only parse JSON and urlencoded for non-multipart requests
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

/* =========================
   LOGGING
   ========================= */
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('  Content-Type:', req.get('content-type'));
  console.log('  Headers:', Object.keys(req.headers).join(', '));
  next();
});

// Specific logging for POST /api/cars
app.post('/api/cars', (req, res, next) => {
  console.log('\n⚠️  INTERCEPTED POST /api/cars BEFORE ROUTES');
  console.log('  This handler should NOT be hit - request should go to routes');
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

// Debug endpoint for form data
app.post('/api/test-upload', (req, res) => {
  console.log('=== TEST UPLOAD ===');
  console.log('Content-Type:', req.get('content-type'));
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  res.json({ body: req.body, files: req.files?.length || 0 });
});

app.get('/', (req, res) => {
  res.json({
    name: 'XlentCar Backend API',
    status: 'running',
    version: '1.0.0',
    cors: {
      allowedOrigins: [
        'https://xlentcar.com',
        'https://www.xlentcar.com',
        'https://xlentcar.vercel.app',
        'https://xlent-production.up.railway.app',
        'http://localhost:3000',
      ]
    }
  });
});

/* =========================
   LOAD ROUTES
   ========================= */
console.log('\n========== LOADING ROUTES ==========');
console.log('Attempting to load routes...');
try {
  const authRoutes = require('./routes/auth');
  const carsRoutes = require('./routes/cars');
  const subscribeRouter = require('./routes/subscribe');
  
  console.log('✓ Routes imported successfully');
  
  app.use('/api/auth', authRoutes);
  console.log('✓ /api/auth route mounted');
  
  app.use('/api/cars', carsRoutes);
  console.log('✓ /api/cars route mounted');
  
  app.use('/api', subscribeRouter);
  console.log('✓ /api subscribe route mounted');
  
  console.log('Routes loaded successfully');
  console.log('========== ROUTES LOADED ==========\n');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  console.error(error.stack);
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