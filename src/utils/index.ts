import { Mixin } from 'ts-mixer';

import { Embed } from './controllers/embed';

class Utils extends Mixin(Embed) {
    methods: UtilsTypes.Methods = [
        'embed_1'
    ]
}

export default new Utils();