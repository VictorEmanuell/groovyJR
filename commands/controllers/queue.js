"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queue = void 0;
const easy_embed_pages_1 = __importDefault(require("easy-embed-pages"));
const utils_1 = __importDefault(require("../../utils"));
class Queue {
    async execute(servers, msg) {
        if (servers[msg.guild.id].fila.size < 1) {
            msg.channel.send(await utils_1.default.embed_1('Nenhuma musica na fila de reprodução!', ''));
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
            i++;
        });
        const separar = (list, limit) => {
            var originalList = [];
            var loop = Number((list.length / limit).toFixed(0)) + (!!(list.length % limit) ? 1 : 0);
            for (var index = 0, position = limit; index < loop; index++, position += limit) {
                var grup = list.slice(index * limit, position);
                if (grup.length)
                    originalList.push({ fields: grup });
            }
            ;
            return originalList;
        };
        let pages = await separar(array, 10);
        const embedQueue = new easy_embed_pages_1.default(msg.channel, {
            pages,
            color: '#6F1471',
            title: "GroovyJR",
            description: "Fila de reprodução:"
        });
        embedQueue.start();
    }
}
exports.queue = new Queue();
