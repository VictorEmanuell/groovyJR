const Discord = require("discord.js");

const tools = require('../tools/tools');

const stop = require('./stop');
const queue = require('./queue');

module.exports = async (servers, msg) => {
    let random = [];

    let queueShuffle = servers[msg.guild.id].fila

    await queueShuffle.forEach((values) => {
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

    stop(servers, msg);
    queueShuffle.clear();

    await random.forEach((values) => {
        queueShuffle.set(values.title, {
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

    queue(servers, msg);
}