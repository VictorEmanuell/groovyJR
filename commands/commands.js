require('dotenv').config();

const Discord = require("discord.js");
const embedPages = require('easy-embed-pages');
const ytdl = require("ytdl-core");
const ytpl = require('ytpl');
const google = require("googleapis");

const tools = require('../tools/tools');
const utils = require('../utils/utils');

const prefixo = process.env.PREFIX;

const youtube = new google.youtube_v3.Youtube({
    version: 'v3',
    auth: process.env.G_KEY
});

class commands {
    join = async (servers, msg) => {
        try {
            servers.server.connection = await msg.member.voice.channel.join();
        }
        catch (err) {
            console.log('ERRO AO ENTRAR NO CANAL DE VOZ, QUE MERDA ACONTECEU?');
            console.log(err);
        }
    }

    leave = async (servers, msg) => {
        servers.server.connection = null;
        servers.server.dispatcher = null;
        servers.server.playingNow = false;
        servers.server.fila.clear();
        msg.member.voice.channel.leave();
    }

    play = async (servers, msg) => {
        let whatToPlay = msg.content.slice(4);

        if (whatToPlay.length === 0 || whatToPlay === '') {
            msg.channel.send(await utils.embed('Digita algo misera!', ''));
            return;
        }

        utils.checkConnection(servers, msg);

        if (ytpl.validateID(whatToPlay)) {
            let playList = await ytpl(whatToPlay);

            await playList.items.forEach((values) => {
                servers.server.fila.set(values.title, {
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

            servers.server.fila.set(infos.videoDetails.title, {
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

                    servers.server.fila.set(listResults[0].tituloVideo, {
                        id: listResults[0].id,
                        title: listResults[0].tituloVideo,
                        channel: listResults[0].nomeCanal
                    });

                    tools.playMusic(servers, msg);

                    // constroi a msg Embed
                    const embed = new Discord.MessageEmbed()
                        .setColor([111, 20, 113])
                        .setAuthor('GroovyJR')
                        .setDescription(`${servers.server.playingNow === true ? 'Adicionado a fila:' : 'Tocando...'}`)
                        .addField(`${listResults[0].tituloVideo}`, `${listResults[0].nomeCanal}`);

                    msg.channel.send(embed);
                }
            });
        }
    }

    search = async (servers, msg) => {
        let whatToPlay = msg.content.slice(4);

        if (whatToPlay.length === 0) {
            msg.channel.send(await utils.embed('Digita algo misera!', ''));
        }

        utils.checkConnection(servers, msg);

        if (ytpl.validateID(whatToPlay)) {
            let playList = await ytpl(whatToPlay);

            await playList.items.forEach((values) => {
                servers.server.fila.set(values.title, {
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

            servers.server.fila.set(infos.videoDetails.title, {
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
                                .then((collected) => {
                                    const reaction = collected.first();
                                    const idOptionSelected = reactsEmojis.indexOf(reaction.emoji.name);
                                    msg.channel.send(await utils.embed(
                                        `Você escolheu ${listResults[idOptionSelected].tituloVideo}`,
                                        `${listResults[idOptionSelected].nomeCanal}`
                                    ));

                                    servers.server.fila.set(listResults[idOptionSelected].tituloVideo, {
                                        id: listResults[idOptionSelected].id,
                                        title: listResults[idOptionSelected].tituloVideo,
                                        channel: listResults[idOptionSelected].nomeCanal
                                    });

                                    tools.playMusic(servers, msg);

                                }).catch((error) => {
                                    msg.channel.send(await utils.embed('Você não escolheu porra nenhuma por que?!', ''));
                                    console.log(error);
                                });
                        });
                }
            });
        }
    }

    stop = async (servers) => {
        if (servers.server.playingNow === false) {
            return;
        }
        servers.server.dispatcher.pause();
    }

    resume = async (servers) => {
        if (servers.server.playingNow === false) {
            return;
        }
        servers.server.dispatcher.resume();
    }

    skip = async (servers, msg) => {
        if (!msg.member.voice.channel) {
            msg.channel.send(await utils.embed('Entre em um canal de voz misera!', ''));
            return;
        } else {
            if (servers.server.fila.size <= 1) {
                this.leave(servers, msg);
            } else {
                servers.server.playingNow = false;
                let playingNow = servers.server.fila.values().next().value;
                servers.server.fila.delete(playingNow.title)

                tools.playMusic(servers, msg);
            }
        }
    }

    queue = async (servers, msg) => {
        async function queueOnly(servers, msg) {
            if (servers.server.fila.size < 1) {
                msg.channel.send(await utils.embed('Nenhuma musica na fila de reprodução!', ''));
                return;
            }

            let array = [];
            let i = 1;

            await servers.server.fila.forEach((values) => {
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

        queueOnly(servers, msg);

        const filter = m => m.author.id === msg.author.id;

        const collector = new Discord.MessageCollector(msg.channel, filter, {
            time: 40000
        })

        collector.on('collect', async m => {
            if (m.content.startsWith(prefixo)) {
                let selected = Number(m.content.slice(2));

                if (selected) {
                    let i = 1;
                    let removeQueue = [];

                    await servers.server.fila.forEach((values) => {
                        if (i < selected) {
                            removeQueue.push(values.title);
                            i++
                        }
                    });

                    await removeQueue.forEach((values) => {
                        servers.server.fila.delete(values);
                    });

                    console.log(removeQueue)

                    servers.server.dispatcher = null;
                    servers.server.playingNow = false;

                    queueOnly(servers, msg);

                    tools.playMusic(servers, msg);
                }
            }
        })
    }

    clearQueue = (servers, msg) => {
        this.leave(servers, msg);

        msg.channel.send(await utils.embed('A fila de reprodução foi limpa!', ''));
    }

    random = async (servers, msg) => {
        let random = [];

        let queue = servers.server.fila

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

        this.stop(servers);
        queue.clear();

        await random.forEach((values) => {
            queue.set(values.title, {
                id: values.id,
                title: values.title,
                channel: values.channel
            });
        });

        servers.server.playingNow = false;

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