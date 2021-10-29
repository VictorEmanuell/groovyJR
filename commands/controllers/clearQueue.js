"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearQueue = void 0;
const utils_1 = __importDefault(require("../../utils"));
const leave_1 = require("./leave");
class ClearQueue {
    async execute(servers, msg) {
        leave_1.leave.execute(servers, msg);
        msg.channel.send(await utils_1.default.embed_1('A fila de reprodução foi limpa!', ''));
    }
}
exports.clearQueue = new ClearQueue();
