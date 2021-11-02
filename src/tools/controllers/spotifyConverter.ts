import { getTracks } from 'spotify-url-info';

import Ytm from 'youtube-music-api';
const api = new Ytm();
api.initalize();

export default async (data: string) => {
    const result = await getTracks(data);

    let tracks: ToolsTypes.Tracks = [];

    result.forEach(async item => {
        await api.search(item.name, 'song').then(async result => {
            tracks.push({
                id: result.content[0].videoId,
                title: result.content[0].name,
                channel: result.content[0].artist.name,
                thumb: result.content[0].thumbnails[0].url
            });
        });
    });

    return tracks;
}