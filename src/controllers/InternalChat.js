module.exports = async io => {
    let auths = {}

    io.on('connection', socket => {
        socket.on('new_auth', data => {
            auths[socket.id + '' + data.nickname] = {
                user: data,
                socket
            }

            console.log(auths[socket.id + '' + data.nickname].user)
            let users_auth = []

            for (const key in auths) { //recorrer objeto para seleccionar los usarios a los cuales se les enviará el sockect con el nuevo usuario conecatdo
                if (key != socket.id + '' + data.nickname) {
                    users_auth.push({
                        user: auths[key].user,
                        token: key
                    })
                    auths[key].socket.emit('new_user', {
                        user: auths[socket.id + '' + data.nickname].user,
                        token: socket.id + '' + data.nickname
                    }) // emitir evento a los usuarios conecatdos

                }

            }
            socket.emit('isAuth', {
                auth: true,
                users_auth
            }) //al usuario conectado se le envian los usuarios conecatdos excepto él 






        })
    })


}