"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVolume = void 0;
const utils_1 = __importDefault(require("../../utils"));
class GetVolume {
    async execute(servers, msg) {
        if (servers[msg.guild.id].playingNow) {
            let volume = await servers[msg.guild.id].dispatcher.volume;
            msg.channel.send(await utils_1.default.embed_1('Ajustes', `O volume atual é: ${volume * 100}`));
        }
        else {
            msg.channel.send(await utils_1.default.embed_1('Ajustes', `Quer saber volume de quê? Não tem nada tocando, desgraça!!`));
        }
    }
}
exports.getVolume = new GetVolume();
