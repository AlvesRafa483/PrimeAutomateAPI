const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

// IMPORT MODELS ----------------------------------------------------------------
const Empresa = require('../models/Empresa');
const Comentario = require('../models/Comentario');
const Agendamento = require('../models/Agendamento');
const Avaliacao = require('../models/Avaliacao');
const Conta = require('../models/Conta');
const Segmento = require('../models/Segmento');

const connection = new Sequelize(dbConfig);

// INIT MODELS ------------------------------------------------------------------
Empresa.init(connection)
Comentario.init(connection);
Agendamento.init(connection);
Avaliacao.init(connection);
Conta.init(connection);
Segmento.init(connection);

// ASSOCIACOES ------------------------------------------------------------------
Avaliacao.belongsTo(Conta);
Conta.hasMany(Avaliacao, { foreignKey: 'conta_id', as: 'avaliacoes'});

Avaliacao.belongsTo(Agendamento);
Agendamento.hasMany(Avaliacao, { foreignKey: 'agendamento_id', as: 'agendamento'});

Agendamento.belongsTo(Empresa);
Empresa.hasMany(Agendamento, { foreignKey: 'empresa_id', as: 'empresa'});

module.exports = connection;