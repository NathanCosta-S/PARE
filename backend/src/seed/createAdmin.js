require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function run() {
  try {
    const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/pare_db';

    console.log('🔌 Conectando ao MongoDB...');
    await mongoose.connect(MONGO);
    console.log('✅ Mongo conectado');

    // dados do admin
    const email = process.env.ADMIN_EMAIL || 'admin@pare.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    // existe
    const existing = await User.findOne({ email });

    if (existing) {
      console.log('⚠️ Admin já existe:', email);
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: 'Administrador',
      email,
      password: hash,
      role: 'admin'
    });

    console.log('🎉 Admin criado com sucesso!');
    console.log('Email:', user.email);
    console.log('Senha:', password);

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error('❌ Erro ao criar admin:', err);
    process.exit(1);
  }
}

run();
