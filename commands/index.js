"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const play_1 = require("./controllers/play");
const search_1 = require("./controllers/search");
const join_1 = require("./controllers/join");
const leave_1 = require("./controllers/leave");
const stop_1 = require("./controllers/stop");
const resume_1 = require("./controllers/resume");
const skip_1 = require("./controllers/skip");
const getVolume_1 = require("./controllers/getVolume");
const setVolume_1 = require("./controllers/setVolume");
const queue_1 = require("./controllers/queue");
const selectInQueue_1 = require("./controllers/selectInQueue");
const clearQueue_1 = require("./controllers/clearQueue");
const random_1 = require("./controllers/random");
const filter_1 = require("./controllers/filter");
const prefixo = process.env.PREFIX;
exports.default = (servers, msg) => {
    switch (msg.content) {
        case prefixo + 'join':
            join_1.join.execute(servers, msg);
            break;
        case prefixo + 'leave':
            leave_1.leave.execute(servers, msg);
            break;
        case prefixo + 'stop':
            stop_1.stop.execute(servers, msg);
            break;
        case prefixo + 'resume':
            resume_1.resume.execute(servers, msg);
            break;
        case prefixo + 'skip':
            skip_1.skip.execute(servers, msg);
            break;
        case prefixo + 'v':
            getVolume_1.getVolume.execute(servers, msg);
            break;
        case prefixo + 'queue':
            queue_1.queue.execute(servers, msg);
            break;
        case prefixo + 'clear':
            clearQueue_1.clearQueue.execute(servers, msg);
            break;
        case prefixo + 'random':
            random_1.random.execute(servers, msg);
            break;
        case prefixo + 'eq':
            filter_1.filter.execute(servers, msg);
            break;
    }
    if (msg.content.startsWith(prefixo + "p ")) { //--p <link>
        play_1.play.execute(servers, msg);
    }
    if (msg.content.startsWith(prefixo + "s ")) { //--s <keyword>
        search_1.search.execute(servers, msg);
    }
    if (msg.content.startsWith(prefixo + "v ")) { //--v 50
        let selected = Number(msg.content.slice(4));
        setVolume_1.setVolume.execute(servers, msg, selected);
    }
    if (msg.content.startsWith(prefixo + "> ")) { //-->
        let selected = Number(msg.content.slice(4));
        selectInQueue_1.selectInQueue.execute(servers, msg, selected);
    }
};
