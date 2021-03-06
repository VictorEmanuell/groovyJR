export class FetchUserConnection {
    async fetchUserConnection(client, data) {
        let user = {
            guildId: null,
            connected: null
        }

        for (let guild of client.guilds.cache) {
            if (guild[1].voiceStates.cache.size > 0) {
                for (let voiceState of guild[1].voiceStates.cache) {
                    if (voiceState[1].id === data.user.discordId) {
                        if (!voiceState[1].channelID) {
                            user.guildId = guild[1].id;
                            user.connected = false;

                            return user;
                        } else {
                            user.guildId = guild[1].id;
                            user.connected = true;

                            return { ...user, channelId: voiceState[1].channelID };
                        }
                    }
                }
            } else {
                return null;
            }
        }
    }
}