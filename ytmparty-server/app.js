const nanoid = require('nanoid');
const express = require("express");

const PORT = process.env.PORT || 3000;
const server = express()
    .use((req, res) => res.send('Hello World!'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = require('socket.io')(server, {
    cors: {
        origins: ["chrome-extension://oononiaicnkfdebjkpfabepkggkneeep", "chrome-extension://nlmcoiggngjmnocabgbgmojmclamjcel"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log(socket.id + ' connected.');

    socket.on('createRoom', () => {
        console.log('createRoom');
        const roomID = nanoid.nanoid(8);
        socket.join(roomID);
        console.log('joinedRoom ' + roomID);
        socket.emit('joinedRoom', roomID);
    })

    socket.on('joinRoom', (roomID) => {
        if (!io.sockets.adapter.rooms.get(roomID)) {
            return socket.emit('error', 'Room doesnt exist.');
        }

        socket.join(roomID);

        socket.emit('joinedRoom', roomID);
    })

    socket.on('leaveRoom', () => {
        socket.leaveAll();
    })

    socket.on('pause', () => {
        console.log('pause');
        socket.broadcast.emit('pause');
    });

    socket.on('play', () => {
        console.log('play');
        socket.broadcast.emit('play');
    });

    socket.on('seeked', (to) => {
        console.log('seeked ' + to);
        socket.broadcast.emit('seeked', to);
    });

    socket.on('nextTrack', (data) => {
        console.log('nextTrack');
        socket.broadcast.emit('nextTrack', data);
    });

    socket.on('advertisement', () => {
        console.log('advertisement');
        socket.broadcast.emit('advertisement');
    });
});

io.listen(process.env.port || 3000, bootstrap);

function bootstrap() {
    console.log(`listening on *:${process.env.port || 3000}`);
}
