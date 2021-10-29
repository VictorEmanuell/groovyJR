"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.skip = void 0;
const utils_1 = __importDefault(require("../../utils"));
const tools_1 = __importDefault(require("../../tools"));
const leave_1 = require("./leave");
class Skip {
    async execute(servers, msg) {
        if (!msg.member.voice.channel) {
            msg.channel.send(await utils_1.default.embed_1('Entre em um canal de voz misera!', ''));
            return;
        }
        else {
            if (servers[msg.guild.id].fila.size <= 1) {
                leave_1.leave.execute(servers, msg);
            }
            else {
                servers[msg.guild.id].playingNow = false;
                let playingNow = servers[msg.guild.id].fila.values().next().value;
                servers[msg.guild.id].fila.delete(playingNow.title);
                tools_1.default.playMusic(servers, msg);
            }
        }
    }
}
exports.skip = new Skip();
