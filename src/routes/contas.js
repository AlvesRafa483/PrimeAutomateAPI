const express = require('express');
const router = express.Router();
const contasController = require('../controllers/contasController');


router.get('/', contasController.findAll);
router.get('/:id', contasController.findByPk);
router.post('/', contasController.create);
router.put('/:id', contasController.update);
router.delete('/:id', contasController.delete);

router.get('/avaliacoes/dia', contasController.findAvaliacoesDia);

module.exports = router;