  const express = require("express");
  const router = express.Router();
  const User = require("../models/User"); 
  const bcrypt = require("bcryptjs");

  // GET - listar usuários
  router.get("/users", async (req, res) => {
  try {
    const { role } = req.query;

    const filter = role ? { role } : {};

    const users = await User.find(filter, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar usuários" });
  }
});

  // POST - criar novo usuário
  router.post("/users", async (req, res) => {
    try {
      const { name, email, role, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        role,
        password: hashedPassword
      });

      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar usuário" });
    }
  });

  // DELETE - remover usuário
  router.delete("/users/:id", async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "Usuário removido" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir usuário" });
    }
  });

  // PUT - atualizar
  router.put("/users/:id", async (req, res) => {
    try {
      const data = req.body;
      if (data.password) data.password = await bcrypt.hash(data.password, 10);

      const updatedUser = await User.findByIdAndUpdate(req.params.id, data, { new: true });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  });

  module.exports = router;
