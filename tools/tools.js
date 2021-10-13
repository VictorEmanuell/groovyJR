const Discord = require('discord.js');
const ytdl = require("ytdl-core");

const config = require('../config.json');

class tools {
    playMusic = async (servers, msg) => {
        setTimeout(async () => {
            if (servers[msg.guild.id].playingNow === false) {
                const playing = await servers[msg.guild.id].fila.values().next().value;

                const embed = new Discord.MessageEmbed()
                    .setColor([111, 20, 113])
                    .setAuthor('GroovyJR')
                    .setTitle('> Ir para YouTube')
                    .setURL(`https://www.youtube.com/watch?v=${playing.id}`)
                    .setDescription(`Tocando agora: `)
                    .addField(playing.title, playing.channel)
                    .setThumbnail(playing.thumb);

                msg.channel.send(await embed);

                let music = await ytdl(playing.id, config.YTDL);

                servers[msg.guild.id].playingNow = true;
                servers[msg.guild.id].dispatcher = await servers[msg.guild.id].connection.play(music);
                servers[msg.guild.id].dispatcher.setVolume(servers[msg.guild.id].volume / 100);

                const finish = async (servers, msg) => {
                    servers[msg.guild.id].dispatcher.on('finish', () => {
                        servers[msg.guild.id].fila.delete(playing.title);
                        servers[msg.guild.id].playingNow = false;
                        if (servers[msg.guild.id].fila.size > 0) {
                            this.playMusic(servers, msg);
                        }
                        else {
                            setTimeout(() => {
                                servers[msg.guild.id].dispatcher = null;
                                servers[msg.guild.id].playingNow = false;
                                servers[msg.guild.id].connection = null;
                                msg.member.voice.channel.leave();
                            }, 5000);
                        }
                    });
                }

                finish(servers, msg);
            }
        }, 1000)
    }

    checkConnection = async (servers, msg) => {
        if (servers[msg.guild.id].connection === null) {
            try {
                servers[msg.guild.id].connection = await msg.member.voice.channel.join();
            }
            catch (err) {
                console.log('ERRO AO ENTRAR NO CANAL DE VOZ, QUE MERDA ACONTECEU?');
                console.log(err);
            }
        }
    }
}

module.exports = new tools();