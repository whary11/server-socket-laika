module.exports = async io => {
    let auths = {}

    io.on('connection', socket => {

        socket.on('new_auth', data => {


            auths[socket.id + '' + data.nickname] = {
                user: data,
                socket
            }


            let users_auth = []

            for (const key in auths) {
                // auths[key].socket.emit()
                if (key != socket.id + '' + data.nickname) {
                    users_auth.push({
                            user: auths[key].user,
                            token: key
                        })
                        // auths[key].socket.emit('new_user', 'Alguien se ha conectado') // emitir evento a los usuarios conecatdos
                }

            }

            for (const key in auths) {
                if (key != socket.id + '' + data.nickname) {
                    auths[key].socket.emit('new_user', users_auth) // emitir evento a los usuarios conecatdos
                }

            }

            socket.emit('isAuth', { auth: true, users_auth })






        })
    })


}