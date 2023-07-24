module.exports = {
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'prime2b',
    define: {
        timestamps: true,
        underscored: true,
        dialectOptions: {
            useUTC: false, 
          },
          timezone: '-03:00'
    }
}