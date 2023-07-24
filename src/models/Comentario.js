
const {Model, DataTypes} = require('sequelize');

 class Comentario extends Model {
    static init(sequelize) {
        super.init({
            segmento_id: DataTypes.INTEGER,
            texto: DataTypes.STRING(500),
            ativo: DataTypes.BOOLEAN,
            deleted_at: DataTypes.DATE
        }, {
            sequelize,
            modelName: 'comentarios',
            freezeTableName: true
        })
    }
}

module.exports = Comentario;