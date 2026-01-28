// routes/cars.js
const express = require('express');
const router = express.Router();
const supabase = require('../../supabaseClient');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5 // Max 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Multer middleware that handles everything
// .any() captures all files and fields
const uploadMiddleware = upload.any();

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader ? 'present' : 'missing');
    
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    console.log('Authenticating user with token...');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Supabase auth error:', error);
      return res.status(401).json({ error: 'Invalid token: ' + error.message });
    }
    
    if (!user) {
      console.log('No user found for token');
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    console.log('User authenticated:', user.id);
    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(500).json({ error: 'Authentication failed: ' + err.message });
  }
};

// Preflight
router.options('*', (req, res) => {
  res.sendStatus(204);
});

// CREATE new car with photo uploads
// Note: uploadMiddleware must come BEFORE authenticate to parse body
router.post('/', uploadMiddleware, authenticate, async (req, res) => {
  try {
    console.log('\n========== POST /api/cars START ==========');
    console.log('Timestamp:', new Date().toISOString());
    console.log('User ID:', req.user?.id);
    console.log('Content-Type:', req.get('content-type'));
    
    // Log raw files array
    console.log('\n--- RAW req.files ---');
    console.log('req.files type:', Array.isArray(req.files) ? 'Array' : typeof req.files);
    console.log('req.files length:', req.files?.length);
    if (req.files && Array.isArray(req.files)) {
      console.log('req.files structure:');
      for (let i = 0; i < req.files.length; i++) {
        const f = req.files[i];
        console.log(`  [${i}] fieldname="${f.fieldname}", originalname="${f.originalname}", size=${f.size}, mimetype="${f.mimetype}", buffer.length=${f.buffer?.length}`);
      }
    }
    
    // Process fields
    console.log('\n--- PROCESSING FIELDS ---');
    let modelStr = '';
    let numberStr = '';
    const photosArray = [];
    
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        console.log(`Processing field: "${file.fieldname}"`);
        
        if (file.fieldname === 'car_model') {
          modelStr = file.buffer.toString('utf8').trim();
          console.log(`  → Extracted car_model: "${modelStr}"`);
        } else if (file.fieldname === 'car_number') {
          numberStr = file.buffer.toString('utf8').trim();
          console.log(`  → Extracted car_number: "${numberStr}"`);
        } else if (file.fieldname === 'photos') {
          photosArray.push(file);
          console.log(`  → Added photo: ${file.originalname}`);
        }
      }
    } else {
      console.log('❌ req.files is not an array or is undefined!');
      console.log('req.files value:', req.files);
    }

    console.log('\n--- VALIDATION ---');
    console.log(`car_model: "${modelStr}" (length: ${modelStr.length})`);
    console.log(`car_number: "${numberStr}" (length: ${numberStr.length})`);
    console.log(`photos: ${photosArray.length} files`);

    // Validate
    if (!modelStr) {
      console.log('❌ VALIDATION FAILED: car_model is empty');
      return res.status(400).json({ error: 'Missing required fields', debug: { modelStr, numberStr, filesCount: photosArray.length } });
    }
    
    if (!numberStr) {
      console.log('❌ VALIDATION FAILED: car_number is empty');
      return res.status(400).json({ error: 'Missing required fields', debug: { modelStr, numberStr, filesCount: photosArray.length } });
    }

    console.log(`✓ VALIDATION PASSED`);
    
    // Check if car number already exists
    console.log('\n--- CHECKING DUPLICATES ---');
    const { data: existingCar, error: checkError } = await supabase
      .from('cars')
      .select('id')
      .eq('car_number', numberStr)
      .single();

    if (checkError) {
      console.log('Check query error (expected if not found):', checkError.message);
    }
    
    if (existingCar) {
      console.log('❌ Car number already exists');
      return res.status(400).json({ error: 'Car number already exists' });
    }
    console.log('✓ Car number is unique');

    // Upload photos to Supabase Storage
    console.log('\n--- UPLOADING PHOTOS ---');
    const photoUrls = [];
    
    for (let i = 0; i < photosArray.length; i++) {
      const file = photosArray[i];
      const fileExt = path.extname(file.originalname);
      const fileName = `${req.user.id}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}${fileExt}`;
      
      console.log(`Uploading photo [${i}]: ${file.originalname} (${file.size} bytes)`);
      const { error: uploadError } = await supabase.storage
        .from('car-photos')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error(`  ❌ Upload error: ${uploadError.message}`);
        continue;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('car-photos')
        .getPublicUrl(fileName);
      
      console.log(`  ✓ Uploaded to: ${publicUrl}`);
      photoUrls.push(publicUrl);
    }

    console.log('\n--- INSERTING TO DATABASE ---');
    console.log(`Data to insert:`, JSON.stringify({
      user_id: req.user.id,
      car_model: modelStr,
      car_number: numberStr,
      photos: photoUrls,
      created_at: new Date().toISOString()
    }, null, 2));
    
    const { data, error } = await supabase
      .from('cars')
      .insert([{
        user_id: req.user.id,
        car_model: modelStr,
        car_number: numberStr,
        photos: photoUrls,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Database insert error:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log(`✓ Car added successfully: ${data.id}`);
    console.log('========== POST /api/cars END ==========\n');
    
    return res.status(201).json({
      message: 'Car added successfully',
      car: data
    });
  } catch (err) {
    console.error('❌ CATCH ERROR:', err.message);
    console.error('Stack:', err.stack);
    console.log('========== POST /api/cars END (ERROR) ==========\n');
    
    // Handle multer errors
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Max 5MB per file' });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ error: 'Maximum 5 photos allowed' });
      }
      return res.status(400).json({ error: `File upload error: ${err.message}` });
    }
    
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

// Apply authentication to remaining routes
router.use(authenticate);

// GET all cars for current user
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ cars: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single car
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Car not found' });
      }
      return res.status(400).json({ error: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE car
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get car photos first
    const { data: car } = await supabase
      .from('cars')
      .select('photos')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    // Delete photos from storage
    if (car && car.photos && Array.isArray(car.photos)) {
      for (const photoUrl of car.photos) {
        try {
          const filePath = photoUrl.split('/car-photos/')[1];
          if (filePath) {
            await supabase.storage
              .from('car-photos')
              .remove([filePath]);
          }
        } catch (err) {
          console.error('Error deleting photo:', err);
        }
      }
    }

    // Delete car from database
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Car not found' });
      }
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: 'Car deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;