const Conn = require('../models/Conn')
module.exports = async io => {
    let DB = new Conn();
    let sockets_connec = {}

    io.on('connection', socket => {
        console.log(socket.id);
        socket.on('Order', async data => {
            let orders = await DB.getOrdersActive(data.from)
                // let result = await DB.isUser(data.from) // Verifica si el usuario existe en la db

            console.log(orders[0]);

            if (orders.length > 0) {


                console.info('Usuario activo para la orden.', data)

                sockets_connec[data.from] = socket
                let messages = await DB.getMessageOrder(orders[0].order_id)
                    // console.log(message);

                socket.emit('welcome', messages)
                    // sockets_conknec[data.to] = socket
                socket.emit('your_order', { // Se devuelve la orden al sockect que se acaba de conectar, este evento es sólo para pruebas porque cada sokect debe enviar la información sobre la orden y en este lado sólo validamos.
                    order: orders[0]
                })

                // consultar y enviar mensajes al cliente conectado


                if (sockets_connec[data.to]) { //Verificar si la otra parte está conectada
                    // Mensaje de bienvenida

                } else {
                    console.log('Usuario "to" desconectado, pero se deben giardar los mensajes para cuando el esté disponible.');
                }
            } else {
                console.log('Cuando llega a este punto el usuario que no tiene acceso al chat.');
            }
        })









        socket.on('new_message', async msg => {
            console.log(msg);
            // Insertar mensaje en db

            let id = await DB.getId(msg.from)

            console.log(id);
            let data = {
                order_id: msg.order_id,
                domiciliary_id: null,
                customer_id: null,
                message: msg.message,
                image_url: ''
            }
            if (msg.role == 'CUSTOMER') {
                data.customer_id = id
            } else if (msg.role == 'DOMICILIARY') {
                data.domiciliary_id = id
            }

            DB.saveOrder(data)


            console.log(data);


            if (sockets_connec[msg.to]) { ///Verificar si el sockect a quien se le va a enviar el mensaje está conectado.
                sockets_connec[msg.to].emit('new_message', { message: msg.message, id: msg.from }) //Envio de mensaje al otro usuario de la orden, tener en cuenta que el usuario que no se haya conectado, no exitirá en el arreglo
            }
        })
    })
}