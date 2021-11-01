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

        if (whatToPlay.length === 0) {
            msg.channel.send(await utils.embed_1('Digita algo misera!', ''));
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
            await api.search(whatToPlay, 'song').then(async result => {
                const listResults = [];

                // organiza os resultados da pesquisa
                for (let i in result.content) {
                    if (Number(i) > 4) break;

                    const itemMaker = {
                        'thumb': result.content[i].thumbnails[0].url,
                        'tituloVideo': result.content[i].name,
                        'nomeCanal': result.content[i].artist.name,
                        'id': result.content[i].videoId
                    }
                    listResults.push(itemMaker);
                }

                // constroi a msg Embed
                const embed = new Discord.MessageEmbed()
                    .setColor([111, 20, 113])
                    .setAuthor('GroovyJR')
                    .setDescription('Escolha sua música de 1-5');


                // adiciona campos para cada resultado da lista
                for (let i in listResults) {
                    embed.addField(
                        `${parseInt(i) + 1}: ${listResults[i].tituloVideo}`,
                        listResults[i].nomeCanal
                    );
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
                        }

                        embedMessage.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
                            .then(async (collected) => {
                                const reaction = collected.first();
                                const idOptionSelected = reactsEmojis.indexOf(reaction.emoji.name);
                                msg.channel.send(await utils.embed_1(
                                    `Você escolheu ${listResults[idOptionSelected].tituloVideo}`,
                                    `${listResults[idOptionSelected].nomeCanal}`
                                ));

                                servers[msg.guild.id].fila.set(listResults[idOptionSelected].tituloVideo, {
                                    id: listResults[idOptionSelected].id,
                                    title: listResults[idOptionSelected].tituloVideo,
                                    channel: listResults[idOptionSelected].nomeCanal,
                                    thumb: listResults[idOptionSelected].thumb
                                });

                                tools.playMusic(servers, msg);

                            }).catch(async (error) => {
                                msg.channel.send(await utils.embed_1('Você não escolheu porra nenhuma por que?!', ''));
                            });
                    });
            })
        }
    }
}