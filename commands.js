require('dotenv').config();

const prefixo = process.env.PREFIX;

const {
    join,
    leave,
    play,
    search,
    stop,
    resume,
    skip,
    getVolume,
    setVolume,
    queue,
    selectInQueue,
    clearQueue,
    random,
    restart
} = require('./commands/export/export');

module.exports = (servers, msg) => {

    switch (msg.content) {
        case prefixo + 'join':
            join(servers, msg);
            break;
        case prefixo + 'leave':
            leave(servers, msg);
            break;
        case prefixo + 'stop':
            stop(servers, msg);
            break;
        case prefixo + 'resume':
            resume(servers, msg);
            break;
        case prefixo + 'skip':
            skip(servers, msg);
            break;
        case prefixo + 'v':
            getVolume(servers, msg);
            break;
        case prefixo + 'queue':
            queue(servers, msg);
            break;
        case prefixo + 'clear':
            clearQueue(servers, msg);
            break;
        case prefixo + 'random':
            random(servers, msg);
            break;
        case prefixo + 'restart':
            restart(msg);
            break;
    }

    if (msg.content.startsWith(prefixo + "p ")) {        //--p <link>
        play(servers, msg);
    }

    if (msg.content.startsWith(prefixo + "s ")) {       //--s <keyword>
        search(servers, msg);
    }

    if (msg.content.startsWith(prefixo + "v ")) {       //--v 50
        let selected = Number(msg.content.slice(4));
        setVolume(servers, msg, selected);
    }

    if (msg.content.startsWith(prefixo + "> ")) {       //-->
        let selected = Number(msg.content.slice(4));
        selectInQueue(servers, msg, selected);
    }
}