import tools from '../../tools';

import { queue } from './queue';

class SelectInQueue {
    async execute(servers: CommandsTypes.Servers, msg: CommandsTypes.Message, selected: CommandsTypes.Selected) {
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

        queue.execute(servers, msg);

        tools.playMusic(servers, msg);
    }
}

export const selectInQueue = new SelectInQueue();