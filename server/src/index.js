require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

/* =========================
   CRITICAL FIX: Handle OPTIONS FIRST
   ========================= */

// Handle ALL OPTIONS requests BEFORE anything else
app.options('*', (req, res) => {
  console.log(`Handling OPTIONS for: ${req.url}`);
  
  const allowedOrigins = [
    'https://xlentcar.com',
    'https://www.xlentcar.com',
    'https://xlentcar.vercel.app',
    'http://localhost:3000',
  ];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  return res.status(200).send();
});

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

/* =========================
   BODY PARSERS
   ========================= */

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

/* =========================
   REQUEST LOGGING
   ========================= */

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

/* =========================
   SIMPLE TEST ROUTES FIRST (to verify server works)
   ========================= */

app.get('/api/ping', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/auth/simple-login', (req, res) => {
  console.log('Simple login test:', req.body);
  res.json({
    success: true,
    message: 'Simple login test successful',
    timestamp: new Date().toISOString()
  });
});

/* =========================
   LOAD ROUTES WITH ERROR HANDLING
   ========================= */

try {
  console.log('Attempting to load routes...');
  
  // Try to load routes with error catching
  const authRoutes = require('./routes/auth');
  const carsRoutes = require('./routes/cars');
  const subscribeRouter = require('./routes/subscribe');
  
  console.log('Routes loaded successfully');
  
  // Use routes
  app.use('/api/auth', authRoutes);
  app.use('/api/cars', carsRoutes);
  app.use('/api', subscribeRouter);
  
} catch (error) {
  console.error('❌ ERROR LOADING ROUTES:', error.message);
  console.error(error.stack);
  
  // Create fallback routes if the actual routes fail to load
  app.post('/api/auth/login', (req, res) => {
    console.log('Fallback login route called');
    res.status(500).json({
      error: 'Routes failed to load',
      message: 'Authentication routes are temporarily unavailable',
      timestamp: new Date().toISOString()
    });
  });
  
  app.get('/api/cars', (req, res) => {
    res.status(500).json({
      error: 'Routes failed to load',
      message: 'Car routes are temporarily unavailable'
    });
  });
  
  app.post('/api/subscribe', (req, res) => {
    res.status(500).json({
      error: 'Routes failed to load',
      message: 'Subscription routes are temporarily unavailable'
    });
  });
}

/* =========================
   ROOT
   ========================= */

app.get('/', (req, res) => {
  res.json({
    name: 'XlentCar Backend API',
    status: 'running',
    cors: 'enabled',
    timestamp: new Date().toISOString()
  });
});

/* =========================
   ERROR HANDLING
   ========================= */

app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Not Found',
    path: req.url,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Global Error Handler:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server',
    timestamp: new Date().toISOString()
  });
});

/* =========================
   SERVER STARTUP WITH ERROR CHECKING
   ========================= */

const PORT = process.env.PORT || 8080;

if (!process.env.PORT) {
  console.warn('⚠️  PORT environment variable not found, using default:', PORT);
}

try {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server started successfully on port ${PORT}`);
    console.log(`📅 ${new Date().toISOString()}`);
    console.log('🌐 Allowed Origins:');
    console.log('   - https://xlentcar.com');
    console.log('   - https://www.xlentcar.com');
    console.log('   - https://xlentcar.vercel.app');
    console.log('   - http://localhost:3000');
    console.log('\n🔧 Test Endpoints:');
    console.log(`   GET  http://localhost:${PORT}/api/ping`);
    console.log(`   POST http://localhost:${PORT}/api/auth/simple-login`);
    console.log(`   OPTIONS http://localhost:${PORT}/api/auth/login`);
  });
  
  /* =========================
     SHUTDOWN SAFETY
     ========================= */
  
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server...');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
  
  process.on('SIGINT', () => {
    console.log('SIGINT received. Closing server...');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
  
  server.on('error', (error) => {
    console.error('❌ Server error:', error);
    process.exit(1);
  });
  
} catch (startupError) {
  console.error('❌ Failed to start server:', startupError);
  process.exit(1);
}

module.exports = app;