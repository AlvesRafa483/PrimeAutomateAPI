const Comentario = require('../models/Comentario');
const {Op} = require('sequelize');
const moment = require('moment');

module.exports = {
    async create(req, res, next) {
        try {
            const { segmento_id, texto } = req.body;

            const textoIsJson = () => {
                try {
                    return JSON.parse(texto);
                } catch (e) {
                    return false;
                }
            }
            
            let created
            if (textoIsJson()) {
                let comentarios = textoIsJson().comentarios;
                console.log(comentarios)

                comentarios.forEach((comentario, index) => {
                    comentarios[index].segmento_id = segmento_id
                    comentarios[index].ativo = 1
                });
    
                const bulkCreated = await Comentario.bulkCreate(comentarios);
                created = bulkCreated[0]
            }else{
                created = await Comentario.create({ segmento_id, texto, ativo: 1});
            }

            return res.json(created);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async bulkCreate(req, res, next) {
        try {
            const { comentarios, segmento_id } = req.body;

            comentarios.forEach((comentario, index) => {
                comentarios[index].segmento_id = segmento_id
            });

            const created = await Comentario.bulkCreate(comentarios);

            return res.json(created);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async findAll(req, res, next) {
        try {
            const {range, sort} = req.query;
            const offset = JSON.parse(range)[0]
            const limit = (JSON.parse(range)[1]+1) - offset

            const comentarios = await Comentario.findAndCountAll({
                where: {
                    deleted_at: {
                        [Op.is]: null
                    }
                },
                offset,
                limit,
                order: [JSON.parse(sort)]
            });
            
            res.set({
                "Content-Type": "application/json",
                "Content-Range": `comentarios ${limit}/${comentarios.count}`
            });

            return res.json(comentarios.rows);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async findByPk(req, res, next) {
        try {
            const {id} = req.params
            const comentario = await Comentario.findByPk(id);

            return res.json(comentario);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async update(req, res, next) {
        try {
            const id = req.params.id
            const { segmento_id, texto } = req.body;
            await Comentario.update({ segmento_id, texto, ativo: 1}, {where: {id}});

            const comentario = await Comentario.findByPk(id);
            return res.json(comentario);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const comentario = await Comentario.update({ ativo: false, deleted_at: moment() }, {
                where: {
                    id,
                }
            });

            return res.json(comentario);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },
}
