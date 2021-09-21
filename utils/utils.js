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
}

module.exports = new utils();