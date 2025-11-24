const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const multer = require('multer');
const path = require('path');

const AlunoController = require('../controllers/aluno.controller');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random()*1E9);
    cb(null, unique + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// rotas protegidas
router.use(auth, role(['aluno']));

router.get('/historico', AlunoController.historico);
router.get('/avisos', AlunoController.avisos);
router.get('/dashboard-dados', AlunoController.dashboardDados);

// upload de trabalho (multipart/form-data)
router.post('/trabalhos/upload', upload.single('arquivo'), AlunoController.uploadTrabalho);
router.get('/trabalhos', AlunoController.listarTrabalhos);

module.exports = router;
