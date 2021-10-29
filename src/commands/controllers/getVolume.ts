import utils from '../../utils';

class GetVolume {
    async execute(servers: CommandsTypes.Servers, msg: CommandsTypes.Message) {
        if (servers[msg.guild.id].playingNow) {
            let volume = await servers[msg.guild.id].dispatcher.volume;
            msg.channel.send(await utils.embed_1('Ajustes', `O volume atual é: ${volume * 100}`));
        } else {
            msg.channel.send(await utils.embed_1('Ajustes', `Quer saber volume de quê? Não tem nada tocando, desgraça!!`));
        }
    }
}

export const getVolume = new GetVolume();