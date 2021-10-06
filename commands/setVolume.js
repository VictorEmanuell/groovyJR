const utils = require('../utils/utils');

module.exports = async (servers, msg, selected) => {
    if (servers[msg.guild.id].playingNow) {
        if (selected <= 500) {
            servers[msg.guild.id].dispatcher.setVolume(selected / 100);
            servers[msg.guild.id].volume = selected;
            msg.channel.send(await utils.embed('Ajustes', `Volume definido em: ${selected}`));
        } else {
            msg.channel.send(await utils.embed('Ajustes', `Quer estourar os tímpanos?!!`));
        }
    } else {
        msg.channel.send(await utils.embed('Ajustes', `Não tem nada tocando porra!!`));
    }
}