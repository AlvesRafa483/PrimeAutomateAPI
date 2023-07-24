const express = require('express');
var cors = require('cors')
require('./database');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');


// IMPORTAR ROTAS ------------------------------------------------
const rotasEmpresas = require('./routes/empresas');
const rotasComentarios = require('./routes/comentarios');
const rotasAgendamentos = require('./routes/agendamentos');
const rotasAvaliacoes = require('./routes/avaliacoes');
const rotasContas = require('./routes/contas');
const rotasSegmentos = require('./routes/segmentos');
const rotasBot = require('./routes/bot');
//----------------------------------------------------------------

// Configuracao do middleware cors
var corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Content-Type, Origin, X-Requested-With, Authorization, Accept');
    res.header('Access-Control-Expose-Headers', 'Content-Range')

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();
})

// ROTAS ---------------------------------------------------------
app.get('/', (req, res, next) => {
    return res.json({
        success: true,
        message: "Hello, world!",
        version: '1.0',
        date: '2023-05-10'
    });
})


app.use('/empresas', rotasEmpresas);
app.use('/comentarios', rotasComentarios);
app.use('/agendamentos', rotasAgendamentos);
app.use('/avaliacoes', rotasAvaliacoes);
app.use('/contas', rotasContas);
app.use('/segmentos', rotasSegmentos); 
app.use('/bot', rotasBot); 
//----------------------------------------------------------------

// TRATAMENTO DE ERROS
app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            status: error.status,
            message: error.message
        }
    })
})

module.exports = app;