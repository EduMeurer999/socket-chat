const express = require('express');
const path = require('path');
const fs = require('fs');

const privateKey = fs.readFileSync(path.resolve(__dirname, 'https', 'server.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, 'https', 'server.crt'), 'utf8');
const ca = fs.readFileSync(path.resolve(__dirname, 'https', 'ca.pem'), 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
}


const app = express();
const server = require('https').createServer(credentials, app);
const io = require('socket.io')(server);




app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
})

let messages = [];

io.on('connection', socket => {
    console.log("Socket conectado: " + socket.id);
    socket.emit('previousMessages', messages)
    socket.on('sendMessage', (data) => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    })
})
server.listen(3000);