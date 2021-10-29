"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = __importDefault(require("discord.js"));
const tools_1 = __importDefault(require("./tools"));
const client = new discord_js_1.default.Client();
const servers = [];
tools_1.default.initialize(client, servers);
client.login(process.env.TOKEN_DISCORD);
