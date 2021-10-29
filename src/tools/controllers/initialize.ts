import utils from '../../utils';

import { stop } from '../../commands/controllers/stop';
import { resume } from '../../commands/controllers/resume';
import { help } from '../../commands/controllers/help';

import commands from '../../commands';

const prefixo = process.env.PREFIX;
const botId = process.env.BOT_ID;

export class Initialize {
    async initialize(client: ToolsTypes.DiscordClient, servers: ToolsTypes.Servers) {
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
                }
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
            }
        });

        client.on('voiceStateUpdate', async (voice) => {
            if (voice.id != botId) return;

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

            if (voice.serverMute === null && voice.id === botId) return;
            else {
                if (voice.guild.voice.serverMute === false && servers[voice.guild.id].playingNow === true && voice.id === botId) {//unmute
                    resume.execute(servers, voice);
                }

                if (voice.guild.voice.serverMute === true && servers[voice.guild.id].playingNow === true && voice.id === botId) {//mute
                    stop.execute(servers, voice)
                }
            }
        });

        client.on('message', async (msg) => {

            //Filter

            if (!msg.guild) return;

            if (!msg.content.startsWith(prefixo)) return;

            if (msg.content === prefixo + "help") {             //--help
                help.execute(msg);
                return;
            }

            if (!msg.member.voice.channel) {
                msg.channel.send(await utils.embed_1('Entre em um canal de voz misera!', ''));
                return;
            }

            //Commands

            commands(servers, msg);
        });
    }
}