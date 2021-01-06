const cors = require("cors");
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
            methods: ["GET", "POST"]
    }
});

app.use(cors())

app.get('/', (req, res) => {
    res.send('hello world!');
});

io.on('connection', (socket) => {
    socket.join('fishuke');
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
    });
    console.log('a user connected');
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
