const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'uma_chave_secreta_troque_ja';

module.exports = async function(req, res, next){
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({ message: 'Sem token' });
  const parts = authHeader.split(' ');
  if(parts.length !== 2) return res.status(401).json({ message: 'Token inválido' });
  const [, token] = parts;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch(err){
    return res.status(401).json({ message: 'Token inválido' });
  }
}
