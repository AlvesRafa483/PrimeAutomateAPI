const express = require('express');
const router = express.Router();
const comentariosController = require('../controllers/comentariosController');


router.get('/', comentariosController.findAll);
router.get('/:id', comentariosController.findByPk);
router.post('/', comentariosController.create);
router.post('/bulk', comentariosController.bulkCreate);
router.put('/:id', comentariosController.update);
router.delete('/:id', comentariosController.delete);


module.exports = router;