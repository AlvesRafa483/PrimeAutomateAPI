const moment = require('moment/moment');
const Segmento = require('../models/Segmento');
const {Op, where} = require('sequelize');

module.exports = {
    async create(req, res, next) {
        try {
            const { segmento } = req.body;
            const _segmento = await Segmento.create({ segmento, ativo: true });

            return res.json(_segmento);
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
          
            // filter: {"id":[2]}

            const segmentos = await Segmento.findAndCountAll({
                where,
                offset,
                limit,
                order,
            });

            if (!limit) {
                limit = segmentos.count
            }

            res.set({
                "Content-Type": "application/json",
                "Content-Range": `segmentos ${limit}/${segmentos.count}`
            });

            return res.json(segmentos.rows);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async findByPk(req, res, next) {
        try {
            const { id } = req.params;
            const segmento = await Segmento.findByPk(id);

            return res.json(segmento);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async update(req, res, next) {
        try {
            const {segmento, ativo } = req.body;
            const id = req.params.id;

            await Segmento.update(
                { segmento, ativo}, {where: {id}}
            );

            const _segmento = await Segmento.findByPk(id);

            return res.json(_segmento);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const _segmento = await Segmento.update({ ativo: false, deleted_at: moment() }, {
                where: {
                    id,
                }
            });

            return res.json(_segmento);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },
}
