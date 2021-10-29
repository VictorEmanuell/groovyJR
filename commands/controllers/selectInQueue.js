"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectInQueue = void 0;
const tools_1 = __importDefault(require("../../tools"));
const queue_1 = require("./queue");
class SelectInQueue {
    async execute(servers, msg, selected) {
        let i = 1;
        let removeQueue = [];
        await servers[msg.guild.id].fila.forEach((values) => {
            if (i < selected) {
                removeQueue.push(values.title);
                i++;
            }
        });
        await removeQueue.forEach((values) => {
            servers[msg.guild.id].fila.delete(values);
        });
        servers[msg.guild.id].dispatcher = null;
        servers[msg.guild.id].playingNow = false;
        queue_1.queue.execute(servers, msg);
        tools_1.default.playMusic(servers, msg);
    }
}
exports.selectInQueue = new SelectInQueue();
