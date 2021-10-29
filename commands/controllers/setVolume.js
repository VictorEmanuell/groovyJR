"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVolume = void 0;
const utils_1 = __importDefault(require("../../utils"));
class SetVolume {
    async execute(servers, msg, selected) {
        if (servers[msg.guild.id].playingNow) {
            if (selected <= 500) {
                servers[msg.guild.id].dispatcher.setVolume(selected / 100);
                servers[msg.guild.id].volume = selected;
                msg.channel.send(await utils_1.default.embed_1('Ajustes', `Volume definido em: ${selected}`));
            }
            else {
                msg.channel.send(await utils_1.default.embed_1('Ajustes', `Quer estourar os tímpanos?!!`));
            }
        }
        else {
            msg.channel.send(await utils_1.default.embed_1('Ajustes', `Não tem nada tocando porra!!`));
        }
    }
}
exports.setVolume = new SetVolume();
