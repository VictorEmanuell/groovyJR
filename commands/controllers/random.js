"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const tools_1 = __importDefault(require("../../tools"));
const stop_1 = require("./stop");
const queue_1 = require("./queue");
class Random {
    async execute(servers, msg) {
        let random = [];
        let queueShuffle = servers[msg.guild.id].fila;
        await queueShuffle.forEach((values) => {
            random.push(values);
        });
        function shuffle(array) {
            let currentIndex = array.length, randomIndex;
            // While there remain elements to shuffle...
            while (currentIndex != 0) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                // And swap it with the current element.
                [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
            }
            return array;
        }
        await shuffle(random);
        stop_1.stop.execute(servers, msg);
        queueShuffle.clear();
        await random.forEach((values) => {
            queueShuffle.set(values.title, {
                id: values.id,
                title: values.title,
                channel: values.channel
            });
        });
        servers[msg.guild.id].playingNow = false;
        tools_1.default.playMusic(servers, msg);
        msg.channel.send(new discord_js_1.default.MessageEmbed()
            .setColor([111, 20, 113])
            .setAuthor('GroovyJR')
            .setTitle('Fila de reprodução embaralhada!'));
        queue_1.queue.execute(servers, msg);
    }
}
exports.random = new Random();
