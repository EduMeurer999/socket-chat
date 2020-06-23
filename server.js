const net = require('net');
var conections = [];
var cont = 0;
next = false;
c = false;
msg = false;
var id;
net.createServer((socket) => {
    socket.on('data', (data) => {
        let str = data.toString();
        if (str == 'end') {
            socket.destroy();
        } else {
            if (str == 'msg' || next) {
                next = true;
                if (c) {
                    if (msg) {
                        text = str;
                        if (text == 'close') {
                            msg = false;
                            c = false;
                            id = undefined;
                            next = false;
                        } else {
                            conections.map(conn => {
                                if (conn.id == id) {
                                    conn.socket.write(text);
                                }
                            })
                        }

                    } else {
                        socket.write("Escreva sua mensagem: ");
                        id = parseInt(str);
                        conections.map(conn => {
                            if (conn.id == id) {
                                conn.socket.write("Outro cliente deseja se conectar com você: Aceitar? S ou N: ");
                            }
                        });
                    }
                } else {
                    c = true;
                    socket.write("Informe o id da conexão: ");
                }
            } else {
                socket.write("Você não está conectado a nenhum cliente");
            }
        }
    });
    socket.on('close', () => {
        console.log("Cliente saiu");
    });
}).listen(1234, () => {
    console.log("Rodando na porta 1234");
}).on('connection', (_socket) => {
    cont++;
    conections.push({ id: cont, socket: _socket, next: [false, false], acceptConnection: false });
    _socket.write("Id: " + cont);
    conn = conections[cont];
    socket = conections[cont].socket;
    socket.on('data', (data) => {
        let str = data.toString();
        if (str == 'msg' || conn.next[0]) {
            socket.write("Informe o id da conexão:  ");
            conn.next[0] = true;
            if (next[1]) {

            } else {
                let id = parseInt(str);
                conections[id].socket.write("O cliente com id " + cont + " Quer se conectar com você: aceitar? S/N ");
                conections[id].socket.write('connect?');

                next[1] = true;
            }

        }

    });
    socket.on('close', () => {
        socket.write("Desconectado d servidor");
        socket.end();
    })
})