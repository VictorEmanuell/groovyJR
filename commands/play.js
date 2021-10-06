const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const ytpl = require('ytpl');

const tools = require('../tools/tools');
const utils = require('../utils/utils');

const Ytm = require('youtube-music-api');
const api = new Ytm();
api.initalize();

module.exports = async (servers, msg) => {
    let whatToPlay = msg.content.slice(4);

    if (whatToPlay.length === 0 || whatToPlay === '') {
        msg.channel.send(await utils.embed('Digita algo misera!', ''));
        return;
    }

    await tools.checkConnection(servers, msg);

    if (ytpl.validateID(whatToPlay)) {
        let playList = await ytpl(whatToPlay);

        await playList.items.forEach((values) => {
            servers[msg.guild.id].fila.set(values.title, {
                id: values.id,
                title: values.title,
                channel: values.author.name,
                thumb: values.thumbnails[0].url
            })
        });

        tools.playMusic(servers, msg);
        return;
    }

    if (ytdl.validateURL(whatToPlay)) {
        let videoId = await ytdl.getURLVideoID(whatToPlay);
        let infos = await ytdl.getBasicInfo(videoId);

        servers[msg.guild.id].fila.set(infos.videoDetails.title, {
            id: infos.videoDetails.videoId,
            title: infos.videoDetails.title,
            channel: infos.videoDetails.ownerChannelName,
            thumb: infos.videoDetails.thumbnails[0].url
        });

        tools.playMusic(servers, msg);
    } else {
        api.search(whatToPlay, 'song').then(async result => {
            servers[msg.guild.id].fila.set(result.content[0].name, {
                id: result.content[0].videoId,
                title: result.content[0].name,
                channel: result.content[0].artist.name,
                thumb: result.content[0].thumbnails[0].url
            });

            tools.playMusic(servers, msg);

            if (servers[msg.guild.id].playingNow === true) {
                const embed = new Discord.MessageEmbed()
                    .setColor([111, 20, 113])
                    .setAuthor('GroovyJR')
                    .setDescription(`Adicionado a fila: `)
                    .addField(`${result.content[0].name}`, `${result.content[0].artist.name}`);

                msg.channel.send(await embed);
            }
        })

    }
}