const Avaliacao = require('../models/Avaliacao');
const Agendamento = require('../models/Agendamento');
const {Op} = require('sequelize');
const moment = require('moment/moment');

module.exports = {
    async create(req, res, next) {
        try {
            const { agendamento_id, conta_id, item, data, comentario } = req.body;
            const avaliacao = await Avaliacao.create({ agendamento_id, conta_id, item, data, comentario });

            return res.json(avaliacao);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async findAll(req, res, next) {
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
                console.log(order);
                if (order[0][0] == 'nome_empresa') {
                    order[0][0] = 'id'
                }
            } else {
                order = null;
            }

            if (typeof filter !== "undefined") {
                let jsonFilter = JSON.parse(filter)
                console.log(jsonFilter)

                Object.keys(jsonFilter).forEach(key => {
                    if (jsonFilter[key] == "not_null") {
                        jsonFilter[key] = {[Op.ne]: null}
                    }
                });

                where = Object.assign({}, where, jsonFilter)
                console.log (where)
            } else {
                var filterQuery = null;
            }

            const avaliacoes = await Avaliacao.findAndCountAll({
                where,
                offset,
                limit,
                order,
                include: [{model: Agendamento, include: ['empresa']}, 'conta']
            });

            if (!limit) {
                limit = avaliacoes.count
            }

            res.set({
                "Content-Type": "application/json",
                "Content-Range": `avaliacoes ${limit}/${avaliacoes.count}`
            });

            resData = []
            avaliacoes.rows.forEach(function (avaliacaoRow) {
                tempData = JSON.parse(JSON.stringify(avaliacaoRow))
                tempData.nome_empresa = avaliacaoRow.agendamento.empresa.nome
                resData.push(tempData)
            });

            return res.json(resData);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async findByPk(req, res, next) {
        try {
            const {id} = req.params;
            const avaliacao = await Avaliacao.findByPk(id);

            return res.json(avaliacao);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const avaliacao = await Avaliacao.update({ ativo: false, deleted_at: moment() }, {
                where: {
                    id,
                }
            });

            return res.json(avaliacao);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async update(req, res, next) {
        try {
            const id = req.params.id;
            const { agendamento_id, conta_id, item, data, comentario, avaliado_em, erro_em } = req.body;
            await Avaliacao.update({ agendamento_id, conta_id, item, data, comentario, avaliado_em, erro_em }, {where: {id}});

            const avaliacao = await Avaliacao.findByPk(id);

            return res.json(avaliacao);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    }
}
