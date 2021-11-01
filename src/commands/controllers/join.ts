export default {
    execute: async (servers: CommandsTypes.Servers, msg: CommandsTypes.Message) => {
        try {
            servers[msg.guild.id].connection = await msg.member.voice.channel.join();
        }
        catch (err) {
            console.log('ERRO AO ENTRAR NO CANAL DE VOZ, QUE MERDA ACONTECEU?');
            console.log(err);
        }
    }
}