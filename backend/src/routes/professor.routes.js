const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const ProfessorController = require('../controllers/professor.controller');

router.use(auth, role(['professor']));

router.get('/turmas', ProfessorController.listMinhasAtribuicoes); 
router.get('/turmas/:turmaId/alunos', ProfessorController.listAlunosDaTurma);

// notas e faltas
router.post('/registros/notas', ProfessorController.lancarNota);
router.put('/registros/notas/:id', ProfessorController.alterarNota);
router.post('/registros/faltas', ProfessorController.lancarFalta);
router.put('/registros/faltas/:id', ProfessorController.alterarFalta);

router.post('/avisos', ProfessorController.criarAviso);


router.get('/trabalhos/turma/:turmaId', ProfessorController.listarTrabalhosDaTurma);

module.exports = router;
