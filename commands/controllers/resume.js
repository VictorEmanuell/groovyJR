"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resume = void 0;
class Resume {
    async execute(servers, msg) {
        if (servers[msg.guild.id].playingNow && servers[msg.guild.id].dispatcher.paused) {
            servers[msg.guild.id].dispatcher.resume();
            servers[msg.guild.id].dispatcher.pause();
            servers[msg.guild.id].dispatcher.resume();
        }
    }
}
exports.resume = new Resume();
