import play from "./controllers/play";
import search from "./controllers/search";
import join from "./controllers/join";
import leave from "./controllers/leave";
import stop from "./controllers/stop";
import resume from "./controllers/resume";
import skip from "./controllers/skip";
import getVolume from "./controllers/getVolume";
import setVolume from "./controllers/setVolume";
import queue from "./controllers/queue";
import selectInQueue from "./controllers/selectInQueue";
import clearQueue from "./controllers/clearQueue";
import random from "./controllers/random";
import filter from "./controllers/filter";

const prefixo = process.env.PREFIX;

export default (servers: CommandsTypes.Servers, msg: CommandsTypes.Message) => {
    switch (msg.content) {
        case prefixo + 'join':
            join.execute(servers, msg);
            break;
        case prefixo + 'leave':
            leave.execute(servers, msg);
            break;
        case prefixo + 'stop':
            stop.execute(servers, msg);
            break;
        case prefixo + 'resume':
            resume.execute(servers, msg);
            break;
        case prefixo + 'skip':
            skip.execute(servers, msg);
            break;
        case prefixo + 'v':
            getVolume.execute(servers, msg);
            break;
        case prefixo + 'queue':
            queue.execute(servers, msg);
            break;
        case prefixo + 'clear':
            clearQueue.execute(servers, msg);
            break;
        case prefixo + 'random':
            random.execute(servers, msg);
            break;
        case prefixo + 'eq':
            filter.execute(servers, msg);
            break;
    }

    if (msg.content.startsWith(prefixo + "p ")) {        //--p <link>
        play.execute(servers, msg);
    }

    if (msg.content.startsWith(prefixo + "s ")) {       //--s <keyword>
        search.execute(servers, msg);
    }

    if (msg.content.startsWith(prefixo + "v ")) {       //--v 50
        let selected = Number(msg.content.slice(4));
        setVolume.execute(servers, msg, selected);
    }

    if (msg.content.startsWith(prefixo + "> ")) {       //-->
        let selected = Number(msg.content.slice(4));
        selectInQueue.execute(servers, msg, selected);
    }
}