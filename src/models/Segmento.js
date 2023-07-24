const {Model, DataTypes} = require('sequelize');

 class Segmento extends Model {
    static init(sequelize) {
        super.init({
            segmento: DataTypes.STRING(100),
            ativo: DataTypes.BOOLEAN,
            deleted_at: DataTypes.DATE
        }, {
            sequelize,
            modelName: 'segmentos',
            freezeTableName: true
        })
    }
}

module.exports = Segmento;