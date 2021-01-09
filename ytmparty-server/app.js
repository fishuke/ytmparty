const nanoid = require('nanoid');
const io = require('socket.io')({
    cors: {
        origin: "chrome-extension://oononiaicnkfdebjkpfabepkggkneeep",
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
        const rooms = io.sockets.adapter.rooms;

        console.log(rooms);
        console.log(rooms.get(roomID));
        if (rooms.get(roomID)){
            console.log(rooms.get(roomID).size);
        }


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
        console.log('seeked');
        socket.broadcast.emit('seeked', to);
    });

    socket.on('nextTrack', (data) => {
        console.log('nextTrack');
        socket.broadcast.emit('seeked', data);
    });
});

io.listen(3000, bootstrap);

function bootstrap() {
    console.log('listening on *:3000');
}
