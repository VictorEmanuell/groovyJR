const Discord = require('discord.js');

class utils {

    embed = async (title, description) => {

        let embed = new Discord.MessageEmbed()
            .setColor([111, 20, 113])
            .setAuthor('GroovyJR')
            .setTitle(title)
            .setDescription(description);

        return embed;
    }

    checkConnection = async (servers, msg) => {
        if (servers.server.connection === null) {
            try {
                servers.server.connection = await msg.member.voice.channel.join();
            }
            catch (err) {
                console.log('ERRO AO ENTRAR NO CANAL DE VOZ, QUE MERDA ACONTECEU?');
                console.log(err);
            }
        }
    }
}

module.exports = new utils();