const express = require('express');
const router = express.Router();
const empresasController = require('../controllers/empresasController');


router.get('/', empresasController.findAll);
router.get('/:id', empresasController.findByPk);
router.post('/', empresasController.create);
router.put('/:id', empresasController.update);
router.delete('/:id', empresasController.delete);


module.exports = router;