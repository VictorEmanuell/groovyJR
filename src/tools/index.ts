import { Mixin } from 'ts-mixer';

import initialize from './controllers/initialize';
import checkConnection from './controllers/checkConnection';
import fetchUserConnection from './controllers/fetchUserConnection';
import { PlayMusic } from './controllers/playMusic';

const playMusic = new PlayMusic().playMusic;

export default {
    initialize,
    checkConnection,
    fetchUserConnection,
    playMusic
}