"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embed = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
class Embed {
    async embed_1(title, description) {
        let embed = new discord_js_1.default.MessageEmbed()
            .setColor([111, 20, 113])
            .setAuthor('GroovyJR')
            .setTitle(title)
            .setDescription(description);
        return embed;
    }
}
exports.Embed = Embed;
