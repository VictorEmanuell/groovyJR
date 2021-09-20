require('dotenv').config();

const Discord = require("discord.js");
const embedPages = require('easy-embed-pages');
const ytdl = require("ytdl-core");
const ytpl = require('ytpl');
const google = require("googleapis");

const tools = require('../tools/tools');

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
        this.stop(servers);
        servers.server.fila.clear();
        servers.server.connection = null;
        servers.server.dispatcher = null;
        msg.member.voice.channel.leave();
    }

    play = async (servers, msg) => {
        let whatToPlay = msg.content.slice(4);

        if (whatToPlay.length === 0) {
            msg.channel.send('Digita algo misera');
        }

        if (servers.server.connection === null) {
            try {
                servers.server.connection = await msg.member.voice.channel.join();
            }
            catch (err) {
                console.log('ERRO AO ENTRAR NO CANAL DE VOZ, QUE MERDA ACONTECEU?');
                console.log(err);
            }
        }

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
            }, function (err, resultado) {
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
            msg.channel.send('Digita algo misera');
        }

        if (servers.server.connection === null) {
            try {
                servers.server.connection = await msg.member.voice.channel.join();
            }
            catch (err) {
                console.log('ERRO AO ENTRAR NO CANAL DE VOZ, QUE MERDA ACONTECEU?');
                console.log(err);
            }
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
            }, function (err, resultado) {
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

                            embedMessage.awaitReactions(filter, { max: 1, time: 40000, errors: ['time'] })
                                .then((collected) => {
                                    const reaction = collected.first();
                                    const idOptionSelected = reactsEmojis.indexOf(reaction.emoji.name);
                                    msg.channel.send(`Você escolheu ${listResults[idOptionSelected].tituloVideo} 
                                de ${listResults[idOptionSelected].nomeCanal}`)

                                    servers.server.fila.set(listResults[idOptionSelected].tituloVideo, {
                                        id: listResults[idOptionSelected].id,
                                        title: listResults[idOptionSelected].tituloVideo,
                                        channel: listResults[idOptionSelected].nomeCanal
                                    });
                                    tools.playMusic(servers, msg);

                                }).catch((error) => {
                                    msg.reply('Você não escolheu porra nenhuma por que?!');
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
            msg.channel.send("Entre em um canal de voz misera!");
            return;
        } else {
            if (servers.server.fila.size <= 1) {
                this.stop(servers);
                servers.server.fila.clear();
            } else {
                servers.server.playingNow = false;
                let playingNow = servers.server.fila.values().next().value;
                servers.server.fila.delete(playingNow.title)

                this.queue(servers, msg);

                tools.playMusic(servers, msg);
            }
        }
    }

    queue = async (servers, msg) => {
        let size = servers.server.fila.size;
        let i = 1;

        if (size < 1) {
            msg.channel.send(
                new Discord.MessageEmbed()
                    .setColor([111, 20, 113])
                    .setAuthor('GroovyJR')
                    .setTitle('Nenhuma musica na fila de reprodução!')
            );

            return;
        }

        let array = [];
        let position = 1;

        await servers.server.fila.forEach((values) => {
            array.push({
                name: `${position}:  ${values.title} ${position === 1 ? '[TOCANDO AGORA]' : ''}`,
                value: values.channel,
                inline: false
            });
            position++
        })

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

    clearQueue = (servers, msg) => {
        this.stop(servers);
        servers.server.fila.clear();
        servers.server.playingNow = false;

        msg.channel.send(
            new Discord.MessageEmbed()
                .setColor([111, 20, 113])
                .setAuthor('GroovyJR')
                .setTitle('A fila de reprodução foi limpa!')
        );
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