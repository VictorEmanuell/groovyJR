import Discord from 'discord.js';

export class Embed {
    async embed_1(title: string, description: string) {

        let embed = new Discord.MessageEmbed()
            .setColor([111, 20, 113])
            .setAuthor('GroovyJR')
            .setTitle(title)
            .setDescription(description);

        return embed;
    }
}