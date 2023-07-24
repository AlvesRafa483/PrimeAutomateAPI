const express = require('express');
const router = express.Router();
const agendamentosController = require('../controllers/agendamentosController');


router.get('/', agendamentosController.findAll);
router.get('/:id', agendamentosController.findByPk);
router.post('/', agendamentosController.create);


module.exports = router;