const ytdl = require("ytdl-core");
const config = require('../config.json');

class tools {
    playMusic = async (servers, msg) => {
        setTimeout(async () => {
            if (servers.server.playingNow === false) {
                const playing = await servers.server.fila.values().next().value;
                servers.server.playingNow = true;
                servers.server.dispatcher = servers.server.connection.play(ytdl(playing.id, config.YTDL));

                servers.server.dispatcher.on('finish', () => {
                    servers.server.fila.delete(playing.title);
                    servers.server.playingNow = false;
                    if (servers.server.fila.size > 0) {
                        this.playMusic(servers);
                    }
                    else {
                        servers.server.dispatcher = null
                    }
                });
            }
        }, 1000)
    }
}

module.exports = new tools();