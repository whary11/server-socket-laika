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

    async getMessageOrder(order_id) {
        let result = await this.sequelize.query(`SELECT  custo.email,   om.order_id, om.customer_id, om.domiciliary_id, om.message, om.image_url  FROM laikapp.order_messages om

        inner join users custo on custo.id = om.customer_id or custo.id = om.domiciliary_id
        ##inner join users domi on domi.id = om.domiciliary_id or om.domiciliary_id = null
        
        where order_id = ${order_id}
        `, {
            type: this.sequelize.QueryTypes.SELECT
        })



        // console.log(result)

        let messages = []
        result.map(m => {
                messages.push({
                    order_id: m.order_id,
                    message: m.message,
                    image_url: m.image_url,
                    id: m.email
                })
            })
            // console.log(messages);

        return messages
    }


    async saveOrder(message) {
        let result = await this.sequelize.query(`
        INSERT INTO
            order_messages (
            order_id,
            customer_id,
            domiciliary_id,
            message,
            image_url) VALUES (:order_id, :customer_id, :domiciliary_id, :message, :image_url)
                    `, {
            replacements: {
                order_id: message.order_id,
                customer_id: message.customer_id,
                domiciliary_id: message.domiciliary_id,
                message: message.message,
                image_url: message.image_url
            },
            // type: this.sequelize.QueryTypes.SELECT
        })





        console.log(result);

    }

    async getId(email) {

        let id = await this.sequelize.query(`
        SELECT id FROM users where email="${email}";
                    `, {

            type: this.sequelize.QueryTypes.SELECT
        })
        return id[0].id

    }


    async getOrdersActive(email) {
        let result = await this.sequelize.query(`
                    select us.id domiciliary_id, uss.id customer_id, us.fullname domiciliary_name, 
                    uss.fullname customer_name, uss.email customer_email, st.name status, 
                    us.email domiciliary_email, ord.invoice_number, ord.created_at, ord.id order_id from orders ord
                    inner join users us on us.id = ord.domiciliary_id
                    inner join users uss on uss.id = ord.user_id
                    inner join statuses st on st.id = ord.status_id
                    where 
                    us.email = :email or uss.email = :email and
                    DATE_FORMAT(ord.created_at, "%d/%m/%Y") = :start_date
                    `, {
            replacements: {
                statusname: 5,
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