import utils from '../../utils';

import leave from './leave';

export default {
    execute: async (servers: CommandsTypes.Servers, msg: CommandsTypes.Message) => {
        leave.execute(servers, msg);

        msg.channel.send(await utils.embed_1('A fila de reprodução foi limpa!', ''));
    }
}