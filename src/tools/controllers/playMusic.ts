import Discord from 'discord.js';
import ytdl from 'discord-ytdl-core';

export class PlayMusic {
    async playMusic(servers: ToolsTypes.Servers, msg: ToolsTypes.Message, seek?: number) {
        if (servers[msg.guild.id].playingNow === false) {
            const playing = await servers[msg.guild.id].fila.values().next().value;

            let ytdlOptions: ToolsTypes.YtdlOptions = {
                opusEncoded: true,
                encoderArgs: servers[msg.guild.id].filter.length > 0 ? ['-af', ...servers[msg.guild.id].filter] : []
            }

            if (seek) {
                ytdlOptions = {
                    opusEncoded: true,
                    encoderArgs: servers[msg.guild.id].filter.length > 0 ? ['-af', ...servers[msg.guild.id].filter] : [],
                    seek
                }
            }

            const embed = new Discord.MessageEmbed()
                .setColor([111, 20, 113])
                .setAuthor('GroovyJR')
                .setTitle('> Ir para YouTube')
                .setURL(`https://www.youtube.com/watch?v=${playing.id}`)
                .setDescription(`Tocando agora: `)
                .addField(playing.title, playing.channel)
                .setThumbnail(playing.thumb);

            msg.channel.send(await embed);

            let music = await ytdl(playing.id, ytdlOptions);

            servers[msg.guild.id].playingNow = true;
            servers[msg.guild.id].dispatcher = await servers[msg.guild.id].connection.play(music, { type: 'opus' });
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
    }
}