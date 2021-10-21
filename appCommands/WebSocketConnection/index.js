const WebSocket = require('ws');
const appCommands = require('../../appCommands');

module.exports = async (servers, client) => {
    const wsConnect = () => {
        const ws = new WebSocket(`ws://${process.env.WS_URL}`);
        let ping = null;

        ws.on('open', () => {
            console.log(('Connected to server'));
            clearInterval(interval);
            ping = setInterval(() => {
                ws.ping();
            }, 300000);
        });

        ws.on('error', () => {
            if (ping === null) {
                clearInterval(ping);
            }
            clearInterval(interval);
            return interval = setInterval(wsConnect, 2000);
        });

        ws.on('close', () => {
            if (ping === null) {
                clearInterval(ping);
            }
            clearInterval(interval);
            return interval = setInterval(wsConnect, 2000);
        });

        ws.on('message', async (msg) => {
            let data = JSON.parse(msg.toString());

            appCommands(servers, client, data);
        });
    }

    let interval = setInterval(wsConnect, 2000);
}