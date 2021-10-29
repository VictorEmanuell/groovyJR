class Resume {
    async execute(servers: CommandsTypes.Servers, msg: CommandsTypes.Message | CommandsTypes.VoiceState) {
        if (servers[msg.guild.id].playingNow && servers[msg.guild.id].dispatcher.paused) {
            servers[msg.guild.id].dispatcher.resume();
            servers[msg.guild.id].dispatcher.pause();
            servers[msg.guild.id].dispatcher.resume();
        }
    }
}

export const resume = new Resume();