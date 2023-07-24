const express = require('express');
const router = express.Router();
const bot = require('../controllers/botController');


router.get('/hello', bot.hello);
router.post('/arraysum', bot.arraySum);

router.get('/avaliar/1', bot.botAvaliar);
router.get('/avaliacoes/dia', bot.avaliacoesDiaJson);
router.post('/avaliacoes/erro/:id', bot.gravarErroAvaliacao);
router.post('/avaliacoes/sucesso/:id', bot.gravarSucessoAvaliacao);

module.exports = router;