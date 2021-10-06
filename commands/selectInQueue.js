const tools = require('../tools/tools');

const queue = require('./queue');

module.exports = async (servers, msg, selected) => {
    let i = 1;
    let removeQueue = [];

    await servers[msg.guild.id].fila.forEach((values) => {
        if (i < selected) {
            removeQueue.push(values.title);
            i++
        }
    });

    await removeQueue.forEach((values) => {
        servers[msg.guild.id].fila.delete(values);
    });

    servers[msg.guild.id].dispatcher = null;
    servers[msg.guild.id].playingNow = false;

    queue(servers, msg);

    tools.playMusic(servers, msg);
}