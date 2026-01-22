require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const carsRoutes = require('./routes/cars');
const subscribeRouter = require('./routes/subscribe');

const app = express();

/* =========================
   CORS CONFIG
   ========================= */

const corsOptions = {
  origin: [
    'https://xlentcar.com',
    'https://www.xlentcar.com',
    'https://xlentcar.vercel.app',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


/* =========================
   BODY PARSERS
   ========================= */

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

/* =========================
   REQUEST LOGGING
   ========================= */

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

/* =========================
   ROUTES
   ========================= */

app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api', subscribeRouter);

/* =========================
   HEALTH CHECK
   ========================= */

app.get('/api/ping', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Server is running',
  });
});

/* =========================
   ROOT
   ========================= */

app.get('/', (req, res) => {
  res.json({
    name: 'XlentCar Backend API',
    status: 'running',
  });
});

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
   SERVER
   ========================= */

   const PORT = process.env.PORT;

   if (!PORT) {
     console.error('❌ PORT is not defined');
     process.exit(1);
   }
   
   const server = app.listen(PORT, '0.0.0.0', () => {
     console.log(`🚀 Backend listening on ${PORT}`);
   });
   
/* =========================
   SHUTDOWN SAFETY
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
