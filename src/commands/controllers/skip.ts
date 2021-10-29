import utils from "../../utils";
import tools from '../../tools';

import { leave } from './leave';

class Skip {
    async execute(servers: CommandsTypes.Servers, msg: CommandsTypes.Message) {
        if (!msg.member.voice.channel) {
            msg.channel.send(await utils.embed_1('Entre em um canal de voz misera!', ''));
            return;
        } else {
            if (servers[msg.guild.id].fila.size <= 1) {
                leave.execute(servers, msg);
            } else {
                servers[msg.guild.id].playingNow = false;
                let playingNow = servers[msg.guild.id].fila.values().next().value;
                servers[msg.guild.id].fila.delete(playingNow.title)

                tools.playMusic(servers, msg);
            }
        }
    }
}

export const skip = new Skip();