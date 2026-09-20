// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const supabase = require('../../supabaseClient');

// PREFLIGHT HANDLER. REQUIRED.
router.options('*', (req, res) => {
  res.sendStatus(204);
});

router.post('/register', async (req, res) => {
  try {
    const {
      customer_name,
      email,
      password,
      phone_number,
      vehicle_reg_number
    } = req.body;

    const normalizedEmail = String(email || '').trim().toLowerCase();
    const trimmedName = String(customer_name || '').trim();

    if (!normalizedEmail || !password || !trimmedName) {
      return res.status(400).json({
        error: 'Email, password, and customer name are required'
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: true,
        user_metadata: {
          customer_name: trimmedName,
          phone_number,
          vehicle_reg_number
        }
      });

    if (authError) {
      if (authError.message?.toLowerCase().includes('already registered') || authError.message?.toLowerCase().includes('already exists')) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData.user.id;
    const hashedPassword = await bcrypt.hash(password, 10);

    await supabase.from('profiles').insert([{
      id: userId,
      customer_name,
      email: email.trim().toLowerCase(),
      phone_number,
      vehicle_reg_number,
      password_hash: hashedPassword,
      created_at: new Date().toISOString()
    }]);

    return res.status(201).json({
      message: 'User registered successfully',
      user_id: userId,
      email: authData.user.email
    });

  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

    if (authError) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!authData.session || !authData.session.access_token) {
      return res.status(401).json({ message: 'Failed to create session. Please try again.' });
    }

    const userId = authData.user.id;
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return res.status(200).json({
      message: 'Login successful',
      token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      expires_at: authData.session.expires_at,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        customer_name: profile?.customer_name,
        phone_number: profile?.phone_number,
        vehicle_reg_number: profile?.vehicle_reg_number
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;