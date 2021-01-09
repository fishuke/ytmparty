const cors = require("cors");
const app = require('express')();
const http = require('http').createServer(app);
const nanoid = require('nanoid');
const io = require('socket.io')(http, {
    cors: {
        origin: "chrome-extension://oononiaicnkfdebjkpfabepkggkneeep",
        credentials: true
    }
});

// noinspection JSCheckFunctionSignatures
app.use(cors())

app.get('/', (req, res) => {
    res.send('hello world!');
});

io.on('connect', (socket) => {
    console.log('connected');
})

io.on('connection', (socket) => {
    console.log(socket.id + 'connected.');
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
    console.log('a user connected');
});

http.listen(3000, bootstrap);

function bootstrap() {
    console.log('listening on *:3000');
}
