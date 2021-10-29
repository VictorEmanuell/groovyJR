class Stop {
    async execute(servers: CommandsTypes.Servers, msg: CommandsTypes.Message | CommandsTypes.VoiceState) {
        if (servers[msg.guild.id].playingNow && !servers[msg.guild.id].dispatcher.paused) {
            servers[msg.guild.id].dispatcher.pause();
        }
    }
}

export const stop = new Stop();