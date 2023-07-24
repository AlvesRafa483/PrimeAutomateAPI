const {Model, DataTypes} = require('sequelize');

 class Empresa extends Model {
    static init(sequelize) {
        super.init({
            segmento_id: DataTypes.INTEGER,
            nome: DataTypes.STRING(100),
            url: DataTypes.STRING(500),
            ativo: DataTypes.BOOLEAN,
            deleted_at: DataTypes.DATE
        }, {
            sequelize,
            modelName: 'empresas',
            freezeTableName: true
        })
    }
}

module.exports = Empresa;