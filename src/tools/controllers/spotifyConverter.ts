import { getTracks } from 'spotify-url-info';

import Ytm from 'youtube-music-api';
const api = new Ytm();
api.initalize();

export default async (data: string) => {
    const result = await getTracks(data);

    let tracks: ToolsTypes.Tracks = [];

    for (let item of result) {
        let search = await api.search(item.name, 'song');

        tracks.push({
            id: search.content[0].videoId,
            title: search.content[0].name,
            channel: search.content[0].artist.name,
            thumb: search.content[0].thumbnails[0].url
        });
    }

    return tracks;
}