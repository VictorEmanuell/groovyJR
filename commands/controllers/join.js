"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.join = void 0;
class Join {
    async execute(servers, msg) {
        try {
            servers[msg.guild.id].connection = await msg.member.voice.channel.join();
        }
        catch (err) {
            console.log('ERRO AO ENTRAR NO CANAL DE VOZ, QUE MERDA ACONTECEU?');
            console.log(err);
        }
    }
}
exports.join = new Join();
