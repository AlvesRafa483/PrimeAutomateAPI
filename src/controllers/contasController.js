const moment = require('moment/moment');
const Conta = require('../models/Conta');
const Avaliacao = require('../models/Avaliacao');
const { Op, where } = require('sequelize');

module.exports = {
    async create(req, res, next) {
        try {
            const { email, senha } = req.body;
            const conta = await Conta.create({ email, senha, ativo: 1 });

            return res.json(conta);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async findAll(req, res, next) {
        try {
            const { range, sort, filter } = req.query;
            let offset;
            let limit;
            let where = {
                deleted_at: {
                    [Op.is]: null
                }
            };

            if (typeof range !== "undefined") {
                offset = JSON.parse(range)[0];
                limit = (JSON.parse(range)[1] + 1) - offset;
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

            // filter: {"id":[2]}

            const contas = await Conta.findAndCountAll({
                where,
                offset,
                limit,
                order,
            });

            if (!limit) {
                limit = contas.count
            }

            res.set({
                "Content-Type": "application/json",
                "Content-Range": `contas ${limit}/${contas.count}`
            });

            return res.json(contas.rows);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async findByPk(req, res, next) {
        try {
            const { id } = req.params;
            const conta = await Conta.findByPk(id);

            return res.json(conta);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async findAvaliacoesDia(req, res, next) {
        try {
            const { range, sort, filter } = req.query;
            let offset;
            let limit;

            const date = moment().format("YYYY-MM-DD");

            let where = {
                data: date,
                avaliado_em: { [Op.is]: null },
                erro_em: { [Op.is]: null },
                deleted_at: { [Op.is]: null }
            };

            if (typeof range !== "undefined") {
                offset = JSON.parse(range)[0];
                limit = (JSON.parse(range)[1] + 1) - offset;
            } else {
                offset = null;
                limit = null;
            }

            if (typeof sort !== "undefined") {
                order = [JSON.parse(sort)];
            } else {
                order = null;
            }

            // let newWhere = {}
            if (typeof filter !== "undefined") {
                let jsonFilter = JSON.parse(filter)
                console.log(jsonFilter)

                where = Object.assign({}, where, jsonFilter)
                console.log (where)
            } else {
                var filterQuery = null;
            }

            const avaliacoes = await Avaliacao.findAndCountAll({
                include: [{
                    association: 'agendamento',
                    include: ['empresa']
                }],
                where,
                offset,
                limit,
                order,
            });

            resData = []
            avaliacoes.rows.forEach(function (avaliacaoRow) {
                tempData = JSON.parse(JSON.stringify(avaliacaoRow))
                tempData.nome_empresa = avaliacaoRow.agendamento.empresa.nome
                resData.push(tempData)
            });

            if (!limit) {
                limit = avaliacoes.count
            }

            res.set({
                "Content-Type": "application/json",
                "Content-Range": `avaliacoes ${limit}/${avaliacoes.count}`
            });

            return res.json(resData);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async update(req, res, next) {
        try {
            const { email, senha } = req.body;
            const id = req.params.id;

            await Conta.update(
                { email, senha, ativo: 1 }, { where: { id } }
            );

            const conta = await Conta.findByPk(id);

            return res.json(conta);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const conta = await Conta.update({ ativo: false, deleted_at: moment() }, {
                where: {
                    id,
                }
            });

            return res.json(conta);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },
}
