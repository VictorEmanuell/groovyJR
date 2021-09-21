require('dotenv').config();

const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const ytpl = require('ytpl');
const google = require("googleapis");
const embedPages = require('easy-embed-pages');

const tools = require('../tools/tools');
const utils = require('../utils/utils');

const youtube = new google.youtube_v3.Youtube({
    version: 'v3',
    auth: process.env.G_KEY
});

class commands {
    join = async (servers, msg) => {
        try {
            servers[msg.guild.id].connection = await msg.member.voice.channel.join();
        }
        catch (err) {
            console.log('ERRO AO ENTRAR NO CANAL DE VOZ, QUE MERDA ACONTECEU?');
            console.log(err);
        }
    }

    leave = async (servers, msg) => {
        servers[msg.guild.id].connection = null;
        servers[msg.guild.id].dispatcher = null;
        servers[msg.guild.id].playingNow = false;
        servers[msg.guild.id].fila.clear();
        msg.member.voice.channel.leave();
    }

    play = async (servers, msg) => {
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
                    channel: values.author.name
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
                channel: infos.videoDetails.ownerChannelName
            });

            console.log('Adicionado: ' + whatToPlay);
            tools.playMusic(servers, msg);
        } else {
            youtube.search.list({
                q: whatToPlay,
                part: 'snippet',
                fields: 'items(id(videoId),snippet(title, channelTitle))',
                type: 'video'
            }, async function (err, resultado) {
                if (err) {
                    console.log(err);
                }
                if (resultado) {
                    const listResults = [];

                    // organiza os resultados da pesquisa
                    for (let i in resultado.data.items) {
                        const itemMaker = {
                            'tituloVideo': resultado.data.items[i].snippet.title,
                            'nomeCanal': resultado.data.items[i].snippet.channelTitle,
                            'id': resultado.data.items[i].id.videoId
                        }
                        listResults.push(itemMaker);
                    }

                    servers[msg.guild.id].fila.set(listResults[0].tituloVideo, {
                        id: listResults[0].id,
                        title: listResults[0].tituloVideo,
                        channel: listResults[0].nomeCanal
                    });

                    tools.playMusic(servers, msg);

                    if (servers[msg.guild.id].playingNow === true) {
                        const embed = new Discord.MessageEmbed()
                        .setColor([111, 20, 113])
                        .setAuthor('GroovyJR')
                        .setDescription(`'Adicionado a fila: `)
                        .addField(`${listResults[0].tituloVideo}`, `${listResults[0].nomeCanal}`);
                    
                        msg.channel.send(await embed);
                    }
                }
            });
        }
    }

    search = async (servers, msg) => {
        let whatToPlay = msg.content.slice(4);

        if (whatToPlay.length === 0) {
            msg.channel.send(await utils.embed('Digita algo misera!', ''));
        }

        await tools.checkConnection(servers, msg);

        if (ytpl.validateID(whatToPlay)) {
            let playList = await ytpl(whatToPlay);

            await playList.items.forEach((values) => {
                servers[msg.guild.id].fila.set(values.title, {
                    id: values.id,
                    title: values.title,
                    channel: values.author.name
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
                channel: infos.videoDetails.ownerChannelName
            });

            console.log('Adicionado: ' + whatToPlay);
            tools.playMusic(servers, msg);
        } else {
            youtube.search.list({
                q: whatToPlay,
                part: 'snippet',
                fields: 'items(id(videoId),snippet(title, channelTitle))',
                type: 'video'
            }, async function (err, resultado) {
                if (err) {
                    console.log(err);
                }
                if (resultado) {
                    const listResults = [];

                    // organiza os resultados da pesquisa
                    for (let i in resultado.data.items) {
                        const itemMaker = {
                            'tituloVideo': resultado.data.items[i].snippet.title,
                            'nomeCanal': resultado.data.items[i].snippet.channelTitle,
                            'id': resultado.data.items[i].id.videoId
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
                                    msg.channel.send(await utils.embed(
                                        `Você escolheu ${listResults[idOptionSelected].tituloVideo}`,
                                        `${listResults[idOptionSelected].nomeCanal}`
                                    ));

                                    servers[msg.guild.id].fila.set(listResults[idOptionSelected].tituloVideo, {
                                        id: listResults[idOptionSelected].id,
                                        title: listResults[idOptionSelected].tituloVideo,
                                        channel: listResults[idOptionSelected].nomeCanal
                                    });

                                    tools.playMusic(servers, msg);

                                }).catch(async (error) => {
                                    msg.channel.send(await utils.embed('Você não escolheu porra nenhuma por que?!', ''));
                                    console.log(error);
                                });
                        });
                }
            });
        }
    }

    stop = async (servers, msg) => {
        if (servers[msg.guild.id].playingNow === false) {
            return;
        }
        servers[msg.guild.id].dispatcher.pause();
    }

    resume = async (servers, msg) => {
        if (servers[msg.guild.id].playingNow === false) {
            return;
        }
        servers[msg.guild.id].dispatcher.resume();
    }

    skip = async (servers, msg) => {
        if (!msg.member.voice.channel) {
            msg.channel.send(await utils.embed('Entre em um canal de voz misera!', ''));
            return;
        } else {
            if (servers[msg.guild.id].fila.size <= 1) {
                this.leave(servers, msg);
            } else {
                servers[msg.guild.id].playingNow = false;
                let playingNow = servers[msg.guild.id].fila.values().next().value;
                servers[msg.guild.id].fila.delete(playingNow.title)

                tools.playMusic(servers, msg);
            }
        }
    }

    queue = async (servers, msg) => {
        if (servers[msg.guild.id].fila.size < 1) {
            msg.channel.send(await utils.embed('Nenhuma musica na fila de reprodução!', ''));
            return;
        }

        let array = [];
        let i = 1;

        await servers[msg.guild.id].fila.forEach((values) => {
            array.push({
                name: `${i}:  ${values.title} ${i === 1 ? '[TOCANDO AGORA]' : ''}`,
                value: values.channel,
                inline: false
            });
            i++
        });

        const separar = (list, limit) => {
            var originalList = [];

            var loop = Number((list.length / limit).toFixed(0)) + (!!(list.length % limit) ? 1 : 0);

            for (var index = 0, position = limit; index < loop; index++, position += limit) {
                var grup = list.slice(index * limit, position);
                if (grup.length) originalList.push({ fields: grup });
            };

            return originalList;
        };

        let pages = await separar(array, 10);

        const embedQueue = new embedPages(msg.channel, {
            pages,
            color: '#6F1471',
            title: "GroobyJR",
            description: "Fila de reprodução:"
        });

        embedQueue.start()
    }

    selectInQueue = async (servers, msg, selected) => {
        let i = 1;
        let removeQueue = [];

        await servers[msg.guild.id].fila.forEach((values) => {
            if (i < selected) {
                removeQueue.push(values.title);
                i++
            }
        });

        await removeQueue.forEach((values) => {
            servers[msg.guild.id].fila.delete(values);
        });

        servers[msg.guild.id].dispatcher = null;
        servers[msg.guild.id].playingNow = false;

        this.queue(servers, msg);

        tools.playMusic(servers, msg);
    }

    clearQueue = async (servers, msg) => {
        this.leave(servers, msg);

        msg.channel.send(await utils.embed('A fila de reprodução foi limpa!', ''));
    }

    random = async (servers, msg) => {
        let random = [];

        let queue = servers[msg.guild.id].fila

        await queue.forEach((values) => {
            random.push(values)
        });

        function shuffle(array) {
            let currentIndex = array.length, randomIndex;

            // While there remain elements to shuffle...
            while (currentIndex != 0) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                // And swap it with the current element.
                [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
            }

            return array;
        }

        await shuffle(random);

        this.stop(servers, msg);
        queue.clear();

        await random.forEach((values) => {
            queue.set(values.title, {
                id: values.id,
                title: values.title,
                channel: values.channel
            });
        });

        servers[msg.guild.id].playingNow = false;

        tools.playMusic(servers, msg);

        msg.channel.send(
            new Discord.MessageEmbed()
                .setColor([111, 20, 113])
                .setAuthor('GroovyJR')
                .setTitle('Fila de reprodução embaralhada!')
        );

        this.queue(servers, msg);
    }
}

module.exports = new commands();