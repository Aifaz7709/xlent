const express = require('express');
const router = express.Router();
const supabase = require('../../supabaseClient'); // Make sure this file exists

// routes/customer.js
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

    // ✅ Use customer_inquiries instead of profiles
    const { data, error } = await supabase
      .from('customer_inquiries') // CHANGED!
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

    console.log('✅ Customer inquiry saved:', data[0]);
    
    res.json({
      success: true,
      message: 'Your information has been saved successfully!',
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

// GET - Get all customer inquiries
router.get('/', async (req, res) => {
  try {
    console.log('📥 GET /api/customers - Fetching inquiries...');
    
    // ✅ Use customer_inquiries instead of profiles
    const { data, error } = await supabase
      .from('customer_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`✅ Found ${data?.length || 0} customer inquiries`);
    
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