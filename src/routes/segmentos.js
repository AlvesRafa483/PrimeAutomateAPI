const express = require('express');
const router = express.Router();
const segmentosController = require('../controllers/segmentosController');


router.get('/', segmentosController.findAll);
router.get('/:id', segmentosController.findByPk);
router.post('/', segmentosController.create);
router.put('/:id', segmentosController.update);
router.delete('/:id', segmentosController.delete);

module.exports = router;