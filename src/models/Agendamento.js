const {Model, DataTypes} = require('sequelize');

 class Agendamento extends Model {
    static init(sequelize) {
        super.init({
            empresa_id: DataTypes.INTEGER,
            data_inicial: DataTypes.DATE,
            data_final: DataTypes.DATE,
            qtd_avaliacoes: DataTypes.INTEGER,
            qtd_comentarios: DataTypes.INTEGER,
            ativo: DataTypes.BOOLEAN,
            deleted_at: DataTypes.DATE
        }, {
            sequelize,
            modelName: 'agendamentos',
            freezeTableName: true
        })
    }
}

module.exports = Agendamento;