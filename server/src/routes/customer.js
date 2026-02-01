const express = require('express');
const router = express.Router();
const supabase = require('../../supabaseClient'); // Make sure this file exists

// POST - Save customer data
router.post('/', async (req, res) => {
  try {
    console.log('📥 POST /api/customers - Received:', req.body);
    
    const { customer_name, phone_number, email } = req.body;

    // Validate
    if (!customer_name || !phone_number || !email) {
      return res.status(400).json({
        error: 'All fields are required: name, phone, email'
      });
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('profiles')
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
      console.error('❌ Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ Customer saved:', data[0]);
    
    res.json({
      success: true,
      message: 'Customer saved successfully',
      customer: data[0]
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// GET - Get all customers
router.get('/', async (req, res) => {
  try {
    console.log('📥 GET /api/customers - Fetching...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`✅ Found ${data?.length || 0} customers`);
    
    res.json({
      success: true,
      customers: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;