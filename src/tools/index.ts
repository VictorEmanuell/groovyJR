import { Mixin } from 'ts-mixer';

import initialize from './controllers/initialize';
import checkConnection from './controllers/checkConnection';
import fetchUserConnection from './controllers/fetchUserConnection';
import spotifyConverter from './controllers/spotifyConverter';
import { playMusic } from './controllers/playMusic';

export default {
    initialize,
    checkConnection,
    fetchUserConnection,
    spotifyConverter,
    playMusic
}