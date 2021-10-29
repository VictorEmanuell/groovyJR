"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const tools_1 = __importDefault(require("../../tools"));
const utils_1 = __importDefault(require("../../utils"));
class Filter {
    async execute(servers, msg) {
        if (!servers[msg.guild.id].connection) {
            return msg.channel.send(await utils_1.default.embed_1('Não tá tocando nada!!!!', ''));
        }
        const nameFilters = [
            " Remover filtros",
            "BassBoost",
            "8D",
            "VaporWave",
            "NightCore",
            "Phaser",
            "Tremolo",
            "Vibrato",
            "Surround",
            "Pulsator",
        ];
        const filters = [
            "remove",
            'bass=g=10,dynaudnorm=f=100,asubboost',
            'apulsator=hz=0.08',
            'aresample=48000,asetrate=48000*0.8',
            'aresample=48000,asetrate=48000*1.25',
            'aphaser=in_gain=0.4',
            'tremolo',
            'vibrato=f=6.5',
            'surround',
            'apulsator=hz=1', //pulsator
        ];
        // constroi a msg Embed
        const embed = new discord_js_1.default.MessageEmbed()
            .setColor([111, 20, 113])
            .setAuthor('GroovyJR')
            .setDescription('Escolha o filtro: ');
        // adiciona campos para cada resultado da lista
        for (let i in nameFilters) {
            embed.addField(`${parseInt(i) === 0 ? '❌' : parseInt(i)} - ${nameFilters[i]}`, '▬▬▬▬▬▬▬▬▬▬▬▬');
        }
        msg.channel.send(embed)
            .then((embedMessage) => {
            const reactsEmojis = ['❌', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
            // escolhe filtro por emoji
            for (let i = 0; i < reactsEmojis.length; i++) {
                embedMessage.react(reactsEmojis[i]);
            }
            const filter = (reaction, user) => {
                return reactsEmojis.includes(reaction.emoji.name)
                    && user.id === msg.author.id;
            };
            embedMessage.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(async (collected) => {
                const reaction = collected.first();
                const idOptionSelected = reactsEmojis.indexOf(reaction.emoji.name);
                let seek;
                if (filters[idOptionSelected] === 'remove') {
                    servers[msg.guild.id].filter.length = 0;
                    servers[msg.guild.id].dispatcher.pause();
                    servers[msg.guild.id].playingNow = false;
                    seek = servers[msg.guild.id].dispatcher.streamTime / 1000;
                    tools_1.default.playMusic(servers, msg, seek);
                }
                else {
                    servers[msg.guild.id].filter.length = 0;
                    servers[msg.guild.id].dispatcher.pause();
                    servers[msg.guild.id].playingNow = false;
                    servers[msg.guild.id].filter.push(filters[idOptionSelected]);
                    seek = servers[msg.guild.id].dispatcher.streamTime / 1000;
                    tools_1.default.playMusic(servers, msg, seek);
                }
            }).catch(async (error) => {
                msg.channel.send(await utils_1.default.embed_1('Você não escolheu porra nenhuma por que?!', ''));
            });
        });
    }
}
exports.filter = new Filter();
