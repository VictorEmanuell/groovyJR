import { Mixin } from 'ts-mixer';

import { Initialize } from './controllers/initialize';
import { CheckConnection } from './controllers/checkConnection';
import { PlayMusic } from './controllers/playMusic';
import { FetchUserConnection } from './controllers/fetchUserConnection';

class Tools extends Mixin(Initialize, CheckConnection, PlayMusic, FetchUserConnection) {
    methods: ToolsTypes.Methods = [
        'initialize',
        'checkConnection',
        'playMusic',
        'fetchUserConnection'
    ]
}

export default new Tools();