import 'dotenv/config';

import Discord from "discord.js";
import tools from './tools';

const client = new Discord.Client();
const servers: IndexTypes.Servers = [];

tools.initialize(client, servers);

client.login(process.env.TOKEN_DISCORD);