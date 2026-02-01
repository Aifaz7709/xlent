// Save customer data
router.post('/customers', async (req, res) => {
  try {
    // Check content type
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Request body:', req.body);
    
    // For FormData, body parser might not work
    // Extract from request body (express.json() should handle both)
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