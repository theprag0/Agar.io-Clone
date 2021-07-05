const express = require('express'),
    app = express(),
    socketio = require('socket.io'),
    helmet = require('helmet');

app.use(express.static(__dirname + '/public'));
app.use(helmet());

const expressServer = app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log('Listening on port 3000...')
});

const io = socketio(expressServer);

app.get('/', (req, res) => res.render('/index.html'));

module.exports = {app, io};

