const { Model, DataTypes } = require('sequelize');

class Avaliacao extends Model {
    static init(sequelize) {
        super.init({
            agendamento_id: DataTypes.INTEGER,
            conta_id: DataTypes.INTEGER,
            item: DataTypes.STRING(45),
            data: DataTypes.DATEONLY,
            comentario: DataTypes.TEXT,
            avaliado_em: DataTypes.DATE,
            erro_em: DataTypes.DATE,
            mensagem: DataTypes.STRING(200),
            deleted_at: DataTypes.DATE,
        }, {
            sequelize,
            modelName: 'avaliacoes',
            freezeTableName: true
        })
    }
}

module.exports = Avaliacao;