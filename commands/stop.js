module.exports = async (servers, msg) => {
    if (servers[msg.guild.id].playingNow && !servers[msg.guild.id].dispatcher.paused) {
        servers[msg.guild.id].dispatcher.pause();
    }
}