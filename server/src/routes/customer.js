const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Save customer data
router.post('/customers', async (req, res) => {
  try {
    const { customer_name, phone_number, email } = req.body;

    // Validate
    if (!customer_name || !phone_number || !email) {
      return res.status(400).json({
        error: 'All fields are required: name, phone, email'
      });
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('public_profiles')
      .insert([
        {
          customer_name,
          phone_number,
          email,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    // Success response
    res.json({
      success: true,
      message: 'Customer saved successfully',
      customer: data[0]
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Get all customers (for dashboard)
router.get('/customers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('public_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      success: true,
      customers: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;