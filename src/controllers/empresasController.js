const Empresa = require('../models/Empresa');
const {Op} = require('sequelize');
const moment = require('moment/moment');

module.exports = {
    async create(req, res, next) {
        try {
            const { segmento_id, nome, url } = req.body;
            const empresa = await Empresa.create({ segmento_id, nome, url, ativo: 1 });

            return res.json(empresa);
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

            const empresas = await Empresa.findAndCountAll({
                where,
                offset,
                limit,
                order,
            });

            if (!limit) {
                limit = empresas.count
            }

            res.set({
                "Content-Type": "application/json",
                "Content-Range": `empresas ${limit}/${empresas.count}`
            });

            return res.json(empresas.rows);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async findByPk(req, res, next) {
        try {
            const {id} = req.params;
            const empresa = await Empresa.findByPk(id);

            return res.json(empresa);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const empresa = await Empresa.update({ ativo: false, deleted_at: moment() }, {
                where: {
                    id,
                }
            });

            return res.json(empresa);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async update(req, res, next) {
        try {
            const id = req.params.id;
            const { segmento_id, nome, url } = req.body;
            await Empresa.update({ segmento_id, nome, url }, {where: {id}});

            const empresa = await Empresa.findByPk(id);

            return res.json(empresa);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    }
}
