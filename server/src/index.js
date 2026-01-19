const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const carsRoutes = require('./routes/cars');
const subscribeRouter = require("./routes/subscribe");

dotenv.config();
const app = express();

// Enable CORS
app.use(cors({
    origin: [
      'https://www.xlentcar.com',
      'https://xlentcar.com',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ],
    credentials: true
  }))
// Increase JSON body size limit to allow base64 image uploads from the frontend.
// Keep reasonable cap to avoid DoS via huge payloads.
app.use(express.json({ limit: process.env.EXPRESS_JSON_LIMIT || '25mb' }));
app.use(express.urlencoded({ limit: process.env.EXPRESS_JSON_LIMIT || '25mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api', subscribeRouter); 

app.get('/api/ping', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
