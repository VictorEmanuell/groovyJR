require('dotenv').config();

const fs = require('fs');
const Discord = require("discord.js");
const commands = require('./commands.js');
const utils = require('./utils/utils');

const client = new Discord.Client();

const prefixo = process.env.PREFIX;
const botId = process.env.BOT_ID;

const { stop, resume, help, appConnect } = require('./commands/export/export');

const servers = [];

client.on('ready', async () => {
    const guilds = await client.guilds.cache.map(guild => guild.id);

    await guilds.forEach((guildId) => {
        servers[guildId] = {
            connection: null,
            dispatcher: null,
            fila: new Map(),
            playingNow: false,
            volume: 100
        }
    });

    client.user.setActivity('Se bugar é pq tá no beta carai!');
    // client.user.setAvatar(fs.readFileSync('./assets/groovy-jr-avatar.png'));

    console.log("Online!");
});

client.on('guildCreate', (guild) => {
    servers[guild.id] = {
        connection: null,
        dispatcher: null,
        fila: new Map(),
        playingNow: false,
        volume: 100
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
            resume(servers, voice);
        }

        if (voice.guild.voice.serverMute === true && servers[voice.guild.id].playingNow === true && voice.id === botId) {//mute
            stop(servers, voice)
        }
    }
});

client.on('message', async (msg) => {

    //Filter

    if (!msg.guild) return;

    if (!msg.content.startsWith(prefixo)) return;

    if (msg.content === prefixo + "help") {             //--help
        help(msg);
        return;
    }

    if (msg.content === prefixo + "app") {             //--app
        appConnect(msg);
        return;
    }

    if (!msg.member.voice.channel) {
        msg.channel.send(await utils.embed('Entre em um canal de voz misera!', ''));
        return;
    }

    //Commands

    commands(servers, msg, client);
});

// App commands from WebSocket API

require('./appCommands/WebSocketConnection/index')(servers, client);

client.login(process.env.TOKEN_DISCORD);