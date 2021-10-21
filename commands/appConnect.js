const Discord = require('discord.js');

module.exports = async (msg) => {

    let userData = {
        discordId: msg.author.id,
        username: msg.author.username,
        avatar: msg.author.avatar
    };

    let embed = new Discord.MessageEmbed()
        .setTitle('Baixe o App do GroovyJR')
        .setURL('https://api.groovyjr.tk/downloadApp')
        .setDescription('Este é seu QR Code de autenticação no app do GroovyJR.\n\nEscanei através do app para controlar o bot por lá.')
        .setThumbnail(msg.author.avatarURL())
        // .setImage(`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${JSON.stringify(userData)}`)
        .setImage('https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl={%22discordId%22:%22842453627669839894%22,%22username%22:%22Crazy%20Man%22,%22avatar%22:%22e113e0c903afe281527c252c058405b7%22}')
        .setTimestamp()
        .setFooter('Obrigado por usar o GroovyJR!')

    msg.author.send(await embed);
    msg.author.send('```' + JSON.stringify(userData) + '```');
}