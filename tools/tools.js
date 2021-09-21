const Discord = require('discord.js');
const ytdl = require("ytdl-core");

const utils = require('../utils/utils');

const config = require('../config.json');

class tools {
    playMusic = async (servers, msg) => {
        setTimeout(async () => {
            if (servers[msg.guild.id].playingNow === false) {
                const playing = await servers[msg.guild.id].fila.values().next().value;

                const embed = new Discord.MessageEmbed()
                    .setColor([111, 20, 113])
                    .setAuthor('GroovyJR')
                    .setDescription(`Tocando agora: `)
                    .addField(playing.title, playing.channel);

                msg.channel.send(await embed);

                servers[msg.guild.id].playingNow = true;
                servers[msg.guild.id].dispatcher = servers[msg.guild.id].connection.play(ytdl(playing.id, config.YTDL));

                const finish = async (servers, msg) => {
                    servers[msg.guild.id].dispatcher.on('finish', () => {
                        servers[msg.guild.id].fila.delete(playing.title);
                        servers[msg.guild.id].playingNow = false;
                        if (servers[msg.guild.id].fila.size > 0) {
                            this.playMusic(servers, msg);
                        }
                        else {
                            servers[msg.guild.id].dispatcher = null
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