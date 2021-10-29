"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stop = void 0;
class Stop {
    async execute(servers, msg) {
        if (servers[msg.guild.id].playingNow && !servers[msg.guild.id].dispatcher.paused) {
            servers[msg.guild.id].dispatcher.pause();
        }
    }
}
exports.stop = new Stop();
