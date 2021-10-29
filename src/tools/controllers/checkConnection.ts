export class CheckConnection {
    async checkConnection(servers: ToolsTypes.Servers, msg: ToolsTypes.Message) {
        if (servers[msg.guild.id].connection === null) {
            try {
                servers[msg.guild.id].connection = await msg.member.voice.channel.join();
            }
            catch (err) {
                console.log('ERRO AO ENTRAR NO CANAL DE VOZ, QUE MERDA ACONTECEU?');
                console.log(err);
            }
        }
    }
}