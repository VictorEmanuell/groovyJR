"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leave = void 0;
class Leave {
    async execute(servers, msg) {
        servers[msg.guild.id].connection = null;
        servers[msg.guild.id].dispatcher = null;
        servers[msg.guild.id].playingNow = false;
        servers[msg.guild.id].volume = 100;
        servers[msg.guild.id].fila.clear();
        msg.member.voice.channel.leave();
    }
}
exports.leave = new Leave();
