"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mixer_1 = require("ts-mixer");
const embed_1 = require("./controllers/embed");
class Utils extends (0, ts_mixer_1.Mixin)(embed_1.Embed) {
    constructor() {
        super(...arguments);
        this.methods = [
            'embed_1'
        ];
    }
}
exports.default = new Utils();
