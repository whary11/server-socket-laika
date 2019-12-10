const os = require('os');
const ifaces = os.networkInterfaces();
const path = require('path');
const express = require('express');
const app = express();
const SocketIO = require('socket.io')
const chat = require('./controllers/Chat');
const internal_chat = require('./controllers/InternalChat')



//pm2 start src/server.js
//pm2 stop

//Iniciar el servicio para que se ejecute siempre 
//pm2 startup systemd
//sudo systemctl start pm2-lraga

//Conocer el estado de ejecusión de la aplicación.
//sudo systemctl status pm2-lraga   ///lraga es el nombre que en nuestro caso le asignó a la aplicación.


// var morgan = require('morgan')
// app.use( morgan())


// Definimos el puerto en el objeto app 
app.set('port', process.env.PORT || 3000)


//archivos estáticos
app.use(express.static(path.join(__dirname, '../public/')))

// VIstas
app.set('views', path.join(__dirname, 'views'));
//Motor
app.set('view engine', 'ejs');
app.get('/laika', (req, res) => {
    res.render('laika');
})

app.get('/customer', (req, res) => {
    res.render('customer');
})

app.get('/domiciliary', (req, res) => {
    res.render('domiciliary');
})



// Inicializar servidor
const server = app.listen(app.get('port'), () => {
    // console.log(`Servidor corriendo en el puerto ${app.get('port')}`)


    Object.keys(ifaces).forEach(function(ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function(iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                console.log(ifname + ':' + alias, iface.address);
            } else {
                // this interface has only one ipv4 adress
                console.log(`Aplicación corriendo en: http://${iface.address}:${app.get('port')}`);
            }
            ++alias;
        });
    });
});

//Rutas web
// route_web(app)



///asterisk

// asterisk()





///// Eventos del socket
const io = SocketIO.listen(server)
    // Estos procesos se delegaron a la ruta socket/socket-mobile.js
chat(io)

internal_chat(io)