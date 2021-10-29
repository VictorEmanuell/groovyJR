"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const ytpl_1 = __importDefault(require("ytpl"));
const tools_1 = __importDefault(require("../../tools"));
const utils_1 = __importDefault(require("../../utils"));
const youtube_music_api_1 = __importDefault(require("youtube-music-api"));
const api = new youtube_music_api_1.default();
api.initalize();
class Search {
    async execute(servers, msg) {
        let whatToPlay = msg.content.slice(4);
        if (whatToPlay.length === 0) {
            msg.channel.send(await utils_1.default.embed_1('Digita algo misera!', ''));
        }
        await tools_1.default.checkConnection(servers, msg);
        if (ytpl_1.default.validateID(whatToPlay)) {
            let playList = await (0, ytpl_1.default)(whatToPlay);
            await playList.items.forEach((values) => {
                servers[msg.guild.id].fila.set(values.title, {
                    id: values.id,
                    title: values.title,
                    channel: values.author.name,
                    thumb: values.thumbnails[0].url
                });
            });
            tools_1.default.playMusic(servers, msg);
            return;
        }
        if (ytdl_core_1.default.validateURL(whatToPlay)) {
            let videoId = await ytdl_core_1.default.getURLVideoID(whatToPlay);
            let infos = await ytdl_core_1.default.getBasicInfo(videoId);
            servers[msg.guild.id].fila.set(infos.videoDetails.title, {
                id: infos.videoDetails.videoId,
                title: infos.videoDetails.title,
                channel: infos.videoDetails.ownerChannelName,
                thumb: infos.videoDetails.thumbnails[0].url
            });
            tools_1.default.playMusic(servers, msg);
        }
        else {
            await api.search(whatToPlay, 'song').then(async (result) => {
                const listResults = [];
                // organiza os resultados da pesquisa
                for (let i in result.content) {
                    if (Number(i) > 4)
                        break;
                    const itemMaker = {
                        'thumb': result.content[i].thumbnails[0].url,
                        'tituloVideo': result.content[i].name,
                        'nomeCanal': result.content[i].artist.name,
                        'id': result.content[i].videoId
                    };
                    listResults.push(itemMaker);
                }
                // constroi a msg Embed
                const embed = new discord_js_1.default.MessageEmbed()
                    .setColor([111, 20, 113])
                    .setAuthor('GroovyJR')
                    .setDescription('Escolha sua música de 1-5');
                // adiciona campos para cada resultado da lista
                for (let i in listResults) {
                    embed.addField(`${parseInt(i) + 1}: ${listResults[i].tituloVideo}`, listResults[i].nomeCanal);
                }
                msg.channel.send(embed)
                    .then((embedMessage) => {
                    const reactsEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
                    // escolhe musica por emoji
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
                        msg.channel.send(await utils_1.default.embed_1(`Você escolheu ${listResults[idOptionSelected].tituloVideo}`, `${listResults[idOptionSelected].nomeCanal}`));
                        servers[msg.guild.id].fila.set(listResults[idOptionSelected].tituloVideo, {
                            id: listResults[idOptionSelected].id,
                            title: listResults[idOptionSelected].tituloVideo,
                            channel: listResults[idOptionSelected].nomeCanal,
                            thumb: listResults[idOptionSelected].thumb
                        });
                        tools_1.default.playMusic(servers, msg);
                    }).catch(async (error) => {
                        msg.channel.send(await utils_1.default.embed_1('Você não escolheu porra nenhuma por que?!', ''));
                    });
                });
            });
        }
    }
}
exports.search = new Search();
