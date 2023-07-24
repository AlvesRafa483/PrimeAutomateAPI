const {Model, DataTypes} = require('sequelize');

 class Conta extends Model {
    static init(sequelize) {
        super.init({
            email: DataTypes.STRING(100),
            senha: DataTypes.STRING(500),
            ativo: DataTypes.BOOLEAN,
            deleted_at: DataTypes.DATE
        }, {
            sequelize,
            modelName: 'contas',
            freezeTableName: true
        })
    }
}

module.exports = Conta;