"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Initialize = void 0;
const utils_1 = __importDefault(require("../../utils"));
const stop_1 = require("../../commands/controllers/stop");
const resume_1 = require("../../commands/controllers/resume");
const help_1 = require("../../commands/controllers/help");
const commands_1 = __importDefault(require("../../commands"));
const prefixo = process.env.PREFIX;
const botId = process.env.BOT_ID;
class Initialize {
    async initialize(client, servers) {
        client.on('ready', async () => {
            const guilds = await client.guilds.cache.map(guild => guild.id);
            await guilds.forEach((guildId) => {
                servers[guildId] = {
                    connection: null,
                    dispatcher: null,
                    fila: new Map(),
                    playingNow: false,
                    volume: 100,
                    filter: []
                };
            });
            client.user.setActivity('Se bugar é pq tá no beta carai!');
            console.log("Online!");
        });
        client.on('guildCreate', (guild) => {
            servers[guild.id] = {
                connection: null,
                dispatcher: null,
                fila: new Map(),
                playingNow: false,
                volume: 100,
                filter: []
            };
        });
        client.on('voiceStateUpdate', async (voice) => {
            if (voice.id != botId)
                return;
            if (!voice.guild.me.voice.channel) {
                if (servers[voice.guild.id].playingNow === true) {
                    servers[voice.guild.id].connection = null;
                    servers[voice.guild.id].dispatcher = null;
                    servers[voice.guild.id].playingNow = false;
                    servers[voice.guild.id].volume = 100;
                    servers[voice.guild.id].fila.clear();
                }
                return;
            }
            if (voice.serverMute === null && voice.id === botId)
                return;
            else {
                if (voice.guild.voice.serverMute === false && servers[voice.guild.id].playingNow === true && voice.id === botId) { //unmute
                    resume_1.resume.execute(servers, voice);
                }
                if (voice.guild.voice.serverMute === true && servers[voice.guild.id].playingNow === true && voice.id === botId) { //mute
                    stop_1.stop.execute(servers, voice);
                }
            }
        });
        client.on('message', async (msg) => {
            // Filter
            if (!msg.guild)
                return;
            if (!msg.content.startsWith(prefixo))
                return;
            // Help
            if (msg.content === prefixo + 'help') {
                help_1.help.execute(msg);
                return;
            }
            // Ping
            if (msg.content === prefixo + 'ping') {
                msg.channel.send(await utils_1.default.embed_1(`Latência da API: ${Math.round(client.ws.ping)}ms`, ''));
                return;
            }
            if (!msg.member.voice.channel) {
                msg.channel.send(await utils_1.default.embed_1('Entre em um canal de voz misera!', ''));
                return;
            }
            // Commands
            (0, commands_1.default)(servers, msg);
        });
    }
}
exports.Initialize = Initialize;
