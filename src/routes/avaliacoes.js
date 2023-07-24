const express = require('express');
const router = express.Router();
const avaliacoesController = require('../controllers/avaliacoesController');


router.get('/', avaliacoesController.findAll);
router.get('/:id', avaliacoesController.findByPk);
router.post('/', avaliacoesController.create);
router.put('/:id', avaliacoesController.update);
router.delete('/:id', avaliacoesController.delete);


module.exports = router;