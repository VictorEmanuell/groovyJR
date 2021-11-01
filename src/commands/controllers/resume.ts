export default {
    execute: async (servers: CommandsTypes.Servers, msg: CommandsTypes.Message | CommandsTypes.VoiceState) => {
        if (servers[msg.guild.id].playingNow && servers[msg.guild.id].dispatcher.paused) {
            servers[msg.guild.id].dispatcher.resume();
            servers[msg.guild.id].dispatcher.pause();
            servers[msg.guild.id].dispatcher.resume();
        }
    }
}