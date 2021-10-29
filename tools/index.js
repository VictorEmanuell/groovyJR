"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mixer_1 = require("ts-mixer");
const initialize_1 = require("./controllers/initialize");
const checkConnection_1 = require("./controllers/checkConnection");
const playMusic_1 = require("./controllers/playMusic");
const fetchUserConnection_1 = require("./controllers/fetchUserConnection");
class Tools extends (0, ts_mixer_1.Mixin)(initialize_1.Initialize, checkConnection_1.CheckConnection, playMusic_1.PlayMusic, fetchUserConnection_1.FetchUserConnection) {
    constructor() {
        super(...arguments);
        this.methods = [
            'initialize',
            'checkConnection',
            'playMusic',
            'fetchUserConnection'
        ];
    }
}
exports.default = new Tools();
