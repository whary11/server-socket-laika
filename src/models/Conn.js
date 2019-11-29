const Sequelize = require('sequelize');
const {
    db
} = require('../../config')


console.log(now());
class Conn {
    constructor(sequelize) {
        this.sequelize = new Sequelize(db.dbname, 'dev', 'laika2019', {
            host: db.host,
            dialect: 'mysql'
        });
    }
    close() {
        this.sequelize.close()
    }
    async getUsers() {
        let result = await this.sequelize.query('select * from users limit 1', {
            type: this.sequelize.QueryTypes.SELECT
        })
        this.close()
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


    async getOrdersActive(email) {
        let result = await this.sequelize.query(`select us.fullname domiciliary_name, uss.fullname customer_name, uss.fullname customer_email, st.name status, us.email domiciliary_email, ord.invoice_number from orders ord

                    inner join users us on us.id = ord.domiciliary_id
                    inner join users uss on uss.id = ord.user_id
                    inner join statuses st on st.id = ord.status_id

                    where st.name = :statusname and
                    us.email = :email or uss.email = :email and
                    DATE_FORMAT(ord.created_at, "%Y/%m/%d") = CURDATE()
                    
                    `, {
            replacements: {
                statusname: 'Creado',
                email,
                start_date: now()
            },
            type: this.sequelize.QueryTypes.SELECT
        })

        return result
    }
}

module.exports = Conn

function now() {
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();

    dd = addZero(dd);
    mm = addZero(mm);

    return dd + '/' + mm + '/' + yyyy;
}

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}