class Leave {
    async execute(servers: CommandsTypes.Servers, msg: CommandsTypes.Message) {
        servers[msg.guild.id].connection = null;
        servers[msg.guild.id].dispatcher = null;
        servers[msg.guild.id].playingNow = false;
        servers[msg.guild.id].volume = 100;
        servers[msg.guild.id].fila.clear();
        msg.member.voice.channel.leave();
    }
}

export const leave = new Leave();