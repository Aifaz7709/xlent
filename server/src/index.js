const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const carsRoutes = require('./routes/cars');
const subscribeRouter = require("./routes/subscribe");

dotenv.config();
const app = express();

// Get your local IP address
const os = require('os');
const networkInterfaces = os.networkInterfaces();

// Function to get local IP
const getLocalIp = () => {
  for (const interfaceName of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[interfaceName]) {
      // Skip internal and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
};

const localIp = getLocalIp();
console.log('Local IP address:', localIp);

// Enable CORS with dynamic origins
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://www.xlentcar.com',
      'https://xlentcar.com',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      `http://${localIp}:3000`,
      // Common local network IP ranges
      /^http:\/\/192\.168\.\d+\.\d+:3000$/,  // 192.168.x.x
      /^http:\/\/10\.\d+\.\d+\.\d+:3000$/,   // 10.x.x.x
      /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:3000$/ // 172.16-31.x.x
    ];
    
    // Check if the origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Increase JSON body size limit
app.use(express.json({ limit: process.env.EXPRESS_JSON_LIMIT || '25mb' }));
app.use(express.urlencoded({ 
  limit: process.env.EXPRESS_JSON_LIMIT || '25mb', 
  extended: true 
}));

// Add request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin || 'No Origin'} - IP: ${req.ip}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api', subscribeRouter); 

// Health check endpoint
app.get('/api/ping', (req, res) => res.json({ 
  ok: true, 
  message: 'Server is running',
  timestamp: new Date().toISOString(),
  localIp 
}));

// Test endpoint for mobile debugging
app.get('/api/test-mobile', (req, res) => {
  res.json({
    success: true,
    message: 'Mobile test successful!',
    clientIp: req.ip,
    clientOrigin: req.headers.origin || 'No Origin',
    serverTime: new Date().toISOString(),
    serverIp: localIp,
    instructions: 'If you see this, your mobile can reach the server'
  });
});

const PORT = process.env.PORT || 5000;

// Listen on all network interfaces, not just localhost
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Network: http://${localIp}:${PORT}`);
  console.log(`=========================================`);
});