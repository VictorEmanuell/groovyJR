const utils = require('../utils/utils');

const leave = require('./leave');

module.exports = async (servers, msg) => {
    
    leave(servers, msg);

    msg.channel.send(await utils.embed('A fila de reprodução foi limpa!', ''));
}