module.exports = async (servers, msg) => {
    servers[msg.guild.id].connection.finally();
    servers[msg.guild.id].connection = null;
    servers[msg.guild.id].dispatcher = null;
    servers[msg.guild.id].playingNow = false;
    servers[msg.guild.id].volume = 100;
    servers[msg.guild.id].fila.clear();
    msg.member.voice.channel.leave();
}