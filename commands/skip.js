const tools = require('../tools/tools');
const utils = require('../utils/utils');

const leave = require('./leave');

module.exports = async (servers, msg) => {
    if (!msg.member.voice.channel) {
        msg.channel.send(await utils.embed('Entre em um canal de voz misera!', ''));
        return;
    } else {
        if (servers[msg.guild.id].fila.size <= 1) {
            leave(servers, msg);
        } else {
            servers[msg.guild.id].playingNow = false;
            let playingNow = servers[msg.guild.id].fila.values().next().value;
            servers[msg.guild.id].fila.delete(playingNow.title)

            tools.playMusic(servers, msg);
        }
    }
}