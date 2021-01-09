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
        if(socket.rooms.get(roomID).size === 0){
            return socket.emit(error, 'Room not found or empty');
        }
        socket.join(roomID);
        socket.emit('joinedRoom', roomID);
    })

    socket.on('message', (msg) => {
        console.log('message: ' + msg);
    });
});

io.listen(3000, bootstrap);

function bootstrap() {
    console.log('listening on *:3000');
}
