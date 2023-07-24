const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const moment = require('moment/moment');
const botApi = require('../config/botApi');
const Avaliacao = require('../models/Avaliacao');
const Agendamento = require('../models/Agendamento');
const Conta = require('../models/Conta');

async function gravarErro(mensagem, id) {
    try {
        await Avaliacao.update({
            erro_em: moment(),
            mensagem: mensagem
        }, {
            where: {
                id: id
            }
        });
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {
    async gravarErroAvaliacao(req, res, next) {
        try {
            const date = moment().format("YYYY-MM-DD HH:mm:ss");
            console.log(date);
            console.log(req.body);
            console.log(req.body.erro);
            await Avaliacao.update({
                erro_em: date,
                mensagem: req.body.erro
            }, {
                where: {
                    id: req.params.id
                }
            });
            res.send({success: true});
        } catch (error) {
            console.error(error.message);
            res.send({error: error.message});
        }
    },

    async gravarSucessoAvaliacao(req, res, next) {
        try {
            const date = moment().format("YYYY-MM-DD HH:mm:ss");
            await Avaliacao.update({
                avaliado_em: date
            }, {
                where: {
                    id: req.params.id
                }
            });
            res.send({success: true});
        } catch (error) {
            console.error(error.message);
            res.send({error: error.message});
        }
    },

    async botAvaliar(req, res, next) {
        try {

            const date = moment().format("YYYY-MM-DD");

            const avaliacoesDia = await Conta.findAll({
                include: [{
                    association: 'avaliacoes',
                    include: [{
                        association: 'agendamento',
                        include: ['empresa']
                    }],
                    where: {
                        data: date,
                        avaliado_em: { [Op.is]: null },
                        erro_em: { [Op.is]: null },
                        deleted_at: { [Op.is]: null }
                    }
                }]
            });

            for (const conta of avaliacoesDia) {
                await botApi.post('/maps/avaliar', conta)
                .then(response => {
                    console.log(response.data);
                    if (!response.data.success) {
                        gravarErro(response.data.error, conta.avaliacoes[0].id);
                    }
                })
                .catch(error => {
                    console.log(error.message);
                    gravarErro(error.message, conta.avaliacoes[0].id);
                });
            }

            res.send(avaliacoesDia);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async avaliacoesDiaJson(req, res, next) {
        try {
            
            const {range, sort, filter} = req.query;
            let offset;
            let limit;
            let where = {
                deleted_at: {
                    [Op.is]: null
                }
            };

            if (typeof range !== "undefined") {
                offset = JSON.parse(range)[0];
                limit = (JSON.parse(range)[1]+1) - offset;
            } else {
                offset = null;
                limit = null;
            }

            if (typeof sort !== "undefined") {
                order = [JSON.parse(sort)];
            } else {
                order = null;
            }

            if (typeof filter !== "undefined") {
                let jsonFilter = JSON.parse(filter)
                
                if (jsonFilter.id) {
                    where.id = jsonFilter.id;
                }
            } else {
                var filterQuery = null;
            }

            const date = moment().format("YYYY-MM-DD");

            const contas = await Conta.findAndCountAll({
                include: [{
                    association: 'avaliacoes',
                    include: [{
                        association: 'agendamento',
                        include: ['empresa']
                    }],
                    where: {
                        data: date,
                        avaliado_em: { [Op.is]: null },
                        erro_em: { [Op.is]: null },
                        deleted_at: { [Op.is]: null }
                    }
                }],
                where,
                offset,
                limit,
                order,
            });

            newContas = []
            contas.rows.forEach(function (conta) {
                tempConta = JSON.parse(JSON.stringify(conta))
                tempConta.avaliacoes.forEach(function (avaliacao) {
                    avaliacao.nome_empresa = avaliacao.agendamento.empresa.nome
                });
                newContas.push(tempConta)
            });

            if (!limit) {
                limit = contas.count
            }

            res.set({
                "Content-Type": "application/json",
                "Content-Range": `contas ${limit}/${contas.count}`
            });

            return res.json(newContas);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },


    async hello(req, res, next) {
        try {
            botApi.get('/hello')
                .then(response => {
                    console.log(response.data.url);
                    console.log(response.data.explanation);
                    res.send(response.data);
                })
                .catch(error => {
                    return res.status(500).send({
                        error: error.message
                    })
                });
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async arraySum(req, res, next) {
        try {
            const data = {
                array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }

            botApi.post('/arraysum', data)
                .then(response => {
                    console.log(response.data.url);
                    console.log(response.data.explanation);
                    res.send(response.data);
                })
                .catch(error => {
                    return res.status(500).send({
                        error: error.message
                    })
                });
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },
}
