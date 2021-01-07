const cors = require("cors");
const app = require('express')();
const http = require('http').createServer(app);
const nanoid = require('nanoid');
const io = require('socket.io')(http, {
    cors: {
        origin: "https://music.youtube.com",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// noinspection JSCheckFunctionSignatures
app.use(cors())

app.get('/', (req, res) => {
    res.send('hello world!');
});

io.on('connection', (socket) => {
    socket.on('createRoom', () => {

        const id = nanoid(10);
        console.log(socket);
        console.log(socket.id);
        socket.join(socket.id);
    })

    socket.on('joinRoom', (msg) => {
        socket.join(msg);
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
