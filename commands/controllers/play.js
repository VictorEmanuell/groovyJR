"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.play = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const ytpl_1 = __importDefault(require("ytpl"));
const tools_1 = __importDefault(require("../../tools"));
const utils_1 = __importDefault(require("../../utils"));
const youtube_music_api_1 = __importDefault(require("youtube-music-api"));
const api = new youtube_music_api_1.default();
api.initalize();
class Play {
    async execute(servers, msg) {
        let whatToPlay = msg.content.slice(4);
        if (whatToPlay.length === 0 || whatToPlay === '') {
            msg.channel.send(await utils_1.default.embed_1('Digita algo misera!', ''));
            return;
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
                servers[msg.guild.id].fila.set(result.content[0].name, {
                    id: result.content[0].videoId,
                    title: result.content[0].name,
                    channel: result.content[0].artist.name,
                    thumb: result.content[0].thumbnails[0].url
                });
                tools_1.default.playMusic(servers, msg);
                if (servers[msg.guild.id].playingNow === true) {
                    const embed = new discord_js_1.default.MessageEmbed()
                        .setColor([111, 20, 113])
                        .setAuthor('GroovyJR')
                        .setDescription(`Adicionado a fila: `)
                        .addField(`${result.content[0].name}`, `${result.content[0].artist.name}`);
                    msg.channel.send(await embed);
                }
            });
        }
    }
}
exports.play = new Play();
