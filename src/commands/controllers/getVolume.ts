import utils from '../../utils';

export default {
    execute: async (servers: CommandsTypes.Servers, msg: CommandsTypes.Message) => {
        if (servers[msg.guild.id].playingNow) {
            let volume = await servers[msg.guild.id].dispatcher.volume;
            msg.channel.send(await utils.embed_1('Ajustes', `O volume atual é: ${volume * 100}`));
        } else {
            msg.channel.send(await utils.embed_1('Ajustes', `Quer saber volume de quê? Não tem nada tocando, desgraça!!`));
        }
    }
}