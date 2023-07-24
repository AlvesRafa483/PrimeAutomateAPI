const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const { Op } = require('sequelize');
const Agendamento = require('../models/Agendamento');
const Conta = require('../models/Conta');
const Empresa = require('../models/Empresa');
const Comentarios = require('../models/Comentario');
const Avaliacao = require('../models/Avaliacao');
const moment = require('moment/moment');
const connection = require('../database');

module.exports = {
    async create(req, res, next) {
        try {
            const { empresa_id, data_inicial, data_final, qtd_avaliacoes, qtd_comentarios } = req.body;

            // Selecionar contas de e-mail para avaliacoes
            const contas = await connection.query("SELECT * FROM contas WHERE id NOT IN (SELECT contas.id FROM contas INNER JOIN avaliacoes ON avaliacoes.conta_id = contas.id INNER JOIN agendamentos ON avaliacoes.agendamento_id = agendamentos.id WHERE agendamentos.empresa_id = "+empresa_id+")", { type: QueryTypes.SELECT });

            // const contas = await Conta.findAll({
            //     order: Sequelize.literal('rand()'),
            //     limit: qtd_avaliacoes,
            //     attributes: ["id"],
            // })


            if (contas.length < qtd_avaliacoes) {
                return res.status(500).send({
                    error: "Não há contas de e-mail suficientes para esta operação!"
                })
            }

            // Selecionar comentarios
            const empresa = await Empresa.findByPk(empresa_id);

            if (!empresa) {
                return res.status(500).send({
                    error: "empresa_id inválido!"
                })
            }

            const segmento_id = empresa.segmento_id;
            const comentarios = await Comentarios.findAll({
                where: {
                    segmento_id,
                    [Op.and]: { deleted_at: null }
                },
                order: Sequelize.literal('rand()'),
                limit: qtd_comentarios
            })

            if (comentarios.length < qtd_comentarios) {
                return res.status(500).send({
                    error: "Não há comentários suficientes para esta operação!"
                })
            }

            if (qtd_avaliacoes < qtd_comentarios) {
                return res.status(500).send({
                    error: "O número de comentários não pode ser maior que o número de avaliações!"
                })
            }

            // Cálculo de avaliacoes por dia
            const dias = moment(data_final).diff(moment(data_inicial), 'days');
            const divisor = Math.floor(qtd_avaliacoes / dias);
            const resto = qtd_avaliacoes % dias;

            // Cálculo de comentários a cada X avaliações
            const comentDivisor = Math.floor(qtd_avaliacoes / qtd_comentarios);

            //Primeiro periodo
            const p1 = {
                qtd_av: divisor + 1,
                qtd_dias: resto
            }

            //Segundo periodo
            const p2 = {
                qtd_av: divisor,
                qtd_dias: dias - resto
            }

            // // Criar dados de avaliacoes para posterior insercao de resgistros
            var avaliacoes = [];
            var idx = 0;
            for (var dia = 0; dia < dias; dia++) {
                while (dia < p1.qtd_dias) {
                    for (j = 0; j < p1.qtd_av; j++) {
                        avaliacoes[idx] = {
                            item: idx + 1 + "/" + qtd_avaliacoes,
                            empresa_id,
                            conta_id: contas[idx].id,
                            comentario: ((idx + 1) % comentDivisor == 0 && (idx + 1) / comentDivisor <= comentarios.length) ? comentarios[((idx + 1) / comentDivisor) - 1].texto : null,
                            data: moment(data_inicial).add(dia, 'days').format("YYYY-MM-DD HH:mm:ss"),
                        }
                        idx++;
                    }
                    dia++;
                }

                while (dia < dias) {
                    for (j = 0; j < p2.qtd_av; j++) {
                        //console.log(comentarios[((idx+1)/comentDivisor)-1]);
                        avaliacoes[idx] = {
                            item: idx + 1 + "/" + qtd_avaliacoes,
                            de: qtd_avaliacoes,
                            empresa_id,
                            conta_id: contas[idx].id,
                            comentario: ((idx + 1) % comentDivisor == 0 && (idx + 1) / comentDivisor <= comentarios.length) ? comentarios[((idx + 1) / comentDivisor) - 1].texto : null,
                            data: moment(data_inicial).add(dia, 'days').format("YYYY-MM-DD HH:mm:ss"),
                        }
                        idx++;
                    }
                    dia++;
                }
            }

            //Criar registro do agendamento
            const agendamento = await Agendamento.create({ empresa_id, data_inicial, data_final, qtd_avaliacoes, qtd_comentarios, ativo: 1 });
            const agendamentoId = agendamento.id;

            avaliacoes.forEach(function (ag, i) {
                avaliacoes[i].agendamento_id = agendamentoId;
            })

            //Criar registros das avaliacoes
            avaliacoes = JSON.parse(JSON.stringify(avaliacoes))
            // res.send(avaliacoes);
            const agAvaliacoes = await Avaliacao.bulkCreate(avaliacoes, { ignoreDuplicates: true });

            return res.json(agendamento);
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

            const agendamentos = await Agendamento.findAndCountAll({
                where,
                offset,
                limit,
                order,
                include: ['empresa']
            });

            if (!limit) {
                limit = agendamentos.count
            }

            res.set({
                "Content-Type": "application/json",
                "Content-Range": `empresas ${limit}/${agendamentos.count}`
            });

            return res.json(agendamentos.rows);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async findByPk(req, res, next) {
        try {
            const { id } = req.params
            const agendamento = await Agendamento.findByPk(id);

            return res.json(agendamento);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const agendamento = await Agendamento.update({ ativo: false, deleted_at: moment() }, {
                where: {
                    id,
                }
            });

            return res.json(agendamento);
        } catch (error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },
}
