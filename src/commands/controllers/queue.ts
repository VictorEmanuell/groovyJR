import embedPages from 'easy-embed-pages';
import utils from '../../utils';

class Queue {
    async execute(servers: CommandsTypes.Servers, msg: CommandsTypes.Message) {
        if (servers[msg.guild.id].fila.size < 1) {
            msg.channel.send(await utils.embed_1('Nenhuma musica na fila de reprodução!', ''));
            return;
        }

        let array = [];
        let i = 1;

        await servers[msg.guild.id].fila.forEach((values) => {
            array.push({
                name: `${i}:  ${values.title} ${i === 1 ? '[TOCANDO AGORA]' : ''}`,
                value: values.channel,
                inline: false
            });
            i++
        });

        const separar = (list, limit) => {
            var originalList = [];

            var loop = Number((list.length / limit).toFixed(0)) + (!!(list.length % limit) ? 1 : 0);

            for (var index = 0, position = limit; index < loop; index++, position += limit) {
                var grup = list.slice(index * limit, position);
                if (grup.length) originalList.push({ fields: grup });
            };

            return originalList;
        };

        let pages = await separar(array, 10);

        const embedQueue = new embedPages(msg.channel, {
            pages,
            color: '#6F1471',
            title: "GroovyJR",
            description: "Fila de reprodução:"
        });

        embedQueue.start()
    }
}

export const queue = new Queue();