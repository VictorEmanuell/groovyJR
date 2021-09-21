require('dotenv').config();

const Discord = require("discord.js");
const commands = require('./commands/commands');
const utils = require('./utils/utils');

const client = new Discord.Client();

const prefixo = process.env.PREFIX;
const botId = process.env.BOT_ID;

const servers = [];

client.on("ready", async () => {
    const guilds = await client.guilds.cache.map(guild => guild.id);

    await guilds.forEach((guildId) => {
        servers[guildId] = {
            connection: null,
            dispatcher: null,
            fila: new Map(),
            playingNow: false
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
        playingNow: false
    }
});

client.on('voiceStateUpdate', async (voice) => {
    if (voice.id != botId) return;

    if (!voice.guild.me.voice.channel) {
        if (servers[voice.guild.id].playingNow === true) {
            servers[voice.guild.id].connection = null;
            servers[voice.guild.id].dispatcher = null;
            servers[voice.guild.id].playingNow = false;
            servers[voice.guild.id].fila.clear();
        }
        return;
    }

    if (voice.serverMute === null && voice.id === botId) return;
    else {
        if (voice.serverMute === false && servers[voice.guild.id].playingNow === true && voice.id === botId) {//mute
            commands.stop(servers, voice);
        }

        if (voice.serverMute === true && servers[voice.guild.id].playingNow === true && voice.id === botId) {//unmute
            commands.resume(servers, voice);
        }
    }
});

client.on("message", async (msg) => {

    //Filter

    if (!msg.guild) return;

    if (!msg.content.startsWith(prefixo)) return;

    if (!msg.member.voice.channel) {
        msg.channel.send(await utils.embed('Entre em um canal de voz misera!', ''));
        return;
    }

    //Commands

    if (msg.content === prefixo + "join") {             //--join
        commands.join(servers, msg);
    }

    if (msg.content === prefixo + "leave") {            //--leave
        commands.leave(servers, msg);
    }

    if (msg.content.startsWith(prefixo + "p")) {        //--p <link>
        commands.play(servers, msg);
    }

    if (msg.content.startsWith(prefixo + "s ")) {       //--s <keyword>
        commands.search(servers, msg);
    }

    if (msg.content === prefixo + "stop") {             //--stop
        commands.stop(servers, msg);
    }

    if (msg.content === prefixo + "resume") {           //--resume
        commands.resume(servers, msg);
    }

    if (msg.content === prefixo + "skip") {             //--skip
        commands.skip(servers, msg);
    }

    if (msg.content === prefixo + "queue") {            //--queue
        commands.queue(servers, msg);
    }

    if (msg.content.startsWith(prefixo + "> ")) {       //--queue
        let selected = Number(msg.content.slice(4));
        commands.selectInQueue(servers, msg, selected);
    }

    if (msg.content === prefixo + "clear") {            //--clear
        commands.clearQueue(servers, msg);
    }

    if (msg.content === prefixo + "random") {           //--random
        commands.random(servers, msg);
    }

    if (msg.content === prefixo + "help") {
        commands.help(servers, msg);
    }
});

client.login(process.env.TOKEN_DISCORD);