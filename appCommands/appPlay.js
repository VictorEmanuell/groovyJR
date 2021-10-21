const ytdl = require("ytdl-core");
const config = require('../config.json');

const { fetchUserConnection } = require('../tools/tools');

module.exports = async (servers, client, data) => {

    const user = await fetchUserConnection(client, data);

    if (user && user.connected) {
        if (!servers[user.guildId].playingNow) {
            let music = await ytdl(data.musicId, config.YTDL);

            servers[user.guildId].playingNow = true;
            servers[user.guildId].dispatcher = await servers[user.guildId].connection.play(music);
            servers[user.guildId].dispatcher.setVolume(servers[user.guildId].volume / 100);
        }
    }
}