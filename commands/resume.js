module.exports = async (servers, msg) => {
    if (servers[msg.guild.id].playingNow && servers[msg.guild.id].dispatcher.paused) {
        servers[msg.guild.id].dispatcher.resume();
        servers[msg.guild.id].dispatcher.pause();
        servers[msg.guild.id].dispatcher.resume();
    }
}