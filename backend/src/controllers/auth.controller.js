const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'uma_chave_secreta_troque_ja';

module.exports = {
  async register(req, res){
    try {
      const { name, email, password, role } = req.body;
      if(!email || !password || !name) return res.status(400).json({message: 'Dados incompletos'});
      const existing = await User.findOne({ email });
      if(existing) return res.status(400).json({ message: 'Email já cadastrado' });
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hash, role: role || 'aluno' });
      return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch(err){ console.error(err); res.status(500).json({ message: 'Erro interno' });}
  },

  async login(req, res){
    try {
      const { email, password } = req.body;
      if(!email || !password) return res.status(400).json({message: 'Email e senha obrigatórios'});
      const user = await User.findOne({ email });
      if(!user) return res.status(400).json({ message: 'Credenciais inválidas' });
      const ok = await bcrypt.compare(password, user.password);
      if(!ok) return res.status(400).json({ message: 'Credenciais inválidas' });
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch(err){ console.error(err); res.status(500).json({ message: 'Erro interno' });}
  }
};
