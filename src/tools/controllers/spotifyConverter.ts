import { getTracks } from 'spotify-url-info';

import Ytm from 'youtube-music-api';
const api = new Ytm();
api.initalize();

export default async (data: string) => {
    const getSpotify = await getTracks(data);

    // Set promises

    let promises = [];

    for (let item of getSpotify) {
        let promise = new Promise(async (resolve, reject) => {
            let getYoutube = await api.search(item.name, 'song');

            resolve(getYoutube);
        });

        promises.push(promise);
    }

    // Resolve promises and return the tracks

    let tracks: ToolsTypes.Tracks = [];

    await Promise.all(promises).then(results => {
        for (let track of results) {
            tracks.push({
                id: track.content[0].videoId,
                title: track.content[0].name,
                channel: track.content[0].artist.name,
                thumb: track.content[0].thumbnails[0].url
            });
        }
    });

    return tracks;
}