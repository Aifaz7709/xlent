// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const supabase = require('../../supabaseClient'); // adjust path if needed

// Registration endpoint
router.post('/register', async (req, res) => {
  console.log(req.body, 'Payload received');

  try {
    const {
      customer_name,
      email,
      password,
      phone_number,
      vehicle_reg_number
    } = req.body;

    // 1️⃣ Create user in Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData.user.id;

    // 2️⃣ Hash password for your own table (optional but fine)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Insert profile with SAME id
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: userId, // 🔴 THIS fixes the FK error
        customer_name,
        email,
        phone_number,
        vehicle_reg_number,
        password_hash: hashedPassword
      }]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: 'User registered successfully',
      user_id: userId
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password
    });

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    return res.status(200).json({
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
