const Conn = require('../models/Conn')
module.exports = async io => {
    let DB = new Conn();

    let sockets_connec = {}

    io.on('connection', socket => {
        console.log(socket.id);
        socket.on('Order', async data => {
            let result = await DB.isUser(data.from) // Verifica si el usuario existe en la db
            if (result) {
                sockets_connec[data.from] = socket
                // sockets_conknec[data.to] = socket
                if (sockets_connec[data.to]) {
                    sockets_connec[data.to].emit('new_message', {
                        msg: `${data.from}, quiere chatear contigo.`
                    })
                } else {
                    console.log('Usuario desconectado, pero se deben giardar los mensajes para cuando el esté disponible.');
                }

            }
        })
        // socket.on('new_message', (msg) => {

        // })
    })
}