"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckConnection = void 0;
class CheckConnection {
    async checkConnection(servers, msg) {
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
exports.CheckConnection = CheckConnection;
