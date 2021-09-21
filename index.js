require('dotenv').config();

const Discord = require("discord.js");
const commands = require('./commands/commands');
const utils = require('./utils/utils');

const client = new Discord.Client();

const prefixo = process.env.PREFIX;

const botId = process.env.BOT_ID;

const servers = {
    server: {
        connection: null,
        dispatcher: null,
        fila: new Map(),
        playingNow: false
    },
};

client.on("ready", () => {
    client.user.setActivity('Se bugar é pq tá no beta carai!');
    console.log("Online!");
});

client.on('voiceStateUpdate', (voice) => {
    if (voice.id != botId) return;

    if (!voice.guild.me.voice.channel) {
        if (servers.server.playingNow === true) {
            servers.server.connection = null;
            servers.server.dispatcher = null;
            servers.server.playingNow = false;
            servers.server.fila.clear();
        }
        return;
    }

    if (voice.serverMute === null && voice.id === botId) return;
    else {
        if (voice.serverMute === false && servers.server.playingNow === true && voice.id === botId) {//mute
            commands.stop(servers);
        }

        if (voice.serverMute === true && servers.server.playingNow === true && voice.id === botId) {//unmute
            commands.resume(servers);
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
        commands.stop(servers);
    }

    if (msg.content === prefixo + "resume") {           //--resume
        commands.resume(servers);
    }

    if (msg.content === prefixo + "skip") {             //--skip
        commands.skip(servers, msg);
    }

    if (msg.content === prefixo + "queue") {            //--queue
        commands.queue(servers, msg);
    }

    if (msg.content === prefixo + "clear") {            //--clear
        commands.clearQueue(servers, msg);
    }

    if (msg.content === prefixo + "random") {           //--random
        commands.random(servers, msg);
    }

});

client.login(process.env.TOKEN_DISCORD);