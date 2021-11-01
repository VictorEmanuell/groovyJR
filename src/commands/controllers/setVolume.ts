import utils from "../../utils";

export default {
    execute: async (servers: CommandsTypes.Servers, msg: CommandsTypes.Message, selected: CommandsTypes.Selected) => {
        if (servers[msg.guild.id].playingNow) {
            if (selected <= 500) {
                servers[msg.guild.id].dispatcher.setVolume(selected / 100);
                servers[msg.guild.id].volume = selected;
                msg.channel.send(await utils.embed_1('Ajustes', `Volume definido em: ${selected}`));
            } else {
                msg.channel.send(await utils.embed_1('Ajustes', `Quer estourar os tímpanos?!!`));
            }
        } else {
            msg.channel.send(await utils.embed_1('Ajustes', `Não tem nada tocando porra!!`));
        }
    }
}