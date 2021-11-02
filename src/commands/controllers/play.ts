import Discord from 'discord.js';
import ytdl from 'ytdl-core';
import ytpl from 'ytpl';

import tools from '../../tools';
import utils from '../../utils';

import Ytm from 'youtube-music-api';
const api = new Ytm();
api.initalize();

export default {
    execute: async (servers: CommandsTypes.Servers, msg: CommandsTypes.Message) => {
        let whatToPlay = msg.content.slice(4);

        if (whatToPlay.length === 0 || whatToPlay === '') {
            msg.channel.send(await utils.embed_1('Digita algo misera!', ''));
            return;
        }

        await tools.checkConnection(servers, msg);

        if (whatToPlay.startsWith('https://open.spotify.com/')) {
            msg.channel.send(await utils.embed_1('Player', 'Convertendo de Spotify para YouTube...'));

            let tracks = await tools.spotifyConverter(whatToPlay);

            tracks.forEach(track => {
                servers[msg.guild.id].fila.set(track.title, {
                    id: track.id,
                    title: track.title,
                    channel: track.channel,
                    thumb: track.thumb
                });
            });

            msg.channel.send(await utils.embed_1('Player', 'Sucesso!'));

            tools.playMusic(servers, msg);

            return;
        }

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
            await api.search(whatToPlay, 'song').then(async result => {
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
}