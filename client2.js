const rd = require('readline');
const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function newConnection() {
    console.log("Deseja se conectar novamente?");
    rl.on('line', (input) => {
        if (input == "s" || input == "S") {
            connectServer();
        } else {
            process.exit(process.pid);
        }
    });
}


function connectServer() {
    let client = new net.Socket();
    client.connect(1234, '127.0.0.1', () => {
        console.log('conectado');
        rl.on('line', (input) => {
            client.write(input);
        });
        client.on('data', (data) => {
            let str = data.toString();
            console.log(str);
        });
        client.on('end', () => {
            console.log('conexão encerrada!');
        })
    }).on('close', () => {
        newConnection();
    })
}
connectServer();
