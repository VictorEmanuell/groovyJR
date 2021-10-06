const utils = require('../utils/utils');

module.exports = async (servers, msg) => {
    if (servers[msg.guild.id].playingNow) {
        let volume = await servers[msg.guild.id].dispatcher.volume;
        msg.channel.send(await utils.embed('Ajustes', `O volume atual é: ${volume * 100}`));
    } else {
        msg.channel.send(await utils.embed('Ajustes', `Quer saber volume de quê? Não tem nada tocando, desgraça!!`));
    }
}