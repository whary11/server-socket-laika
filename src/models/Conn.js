const Sequelize = require('sequelize');

class Conn {
    constructor(sequelize) {
        this.sequelize = new Sequelize('laikapp', 'dev', 'laika2019', {
            host: 'developer.c401c5lcer4y.us-east-2.rds.amazonaws.com',
            dialect: 'mysql'
        });
    }
    async getUsers() {
        let result = await this.sequelize.query('select * from users limit 1', {
            type: this.sequelize.QueryTypes.SELECT
        })
        return result
    }

    async isUser(email) {
        let result = await this.sequelize.query('select * from users where email = :email limit 1', {
            replacements: {
                email
            },
            type: this.sequelize.QueryTypes.SELECT
        })
        if (result.length > 0) {
            return true
        }
        return false
    }
}

module.exports = Conn