//////////////////////////////////////////////////////////////////////////////////////
// Local types
//////////////////////////////////////////////////////////////////////////////////////

declare namespace LocalTypes {
    import Discord from 'discord.js';

    interface ServerObject {
        connection: null | Discord.VoiceConnection;
        dispatcher: null | Discord.StreamDispatcher;
        fila: object;
        playingNow: boolean;
        volume: number;
        filter: string[];
    }
}

//////////////////////////////////////////////////////////////////////////////////////
// Index
//////////////////////////////////////////////////////////////////////////////////////

declare namespace IndexTypes {
    type Servers = undefined | LocalTypes.ServerObject[];
}

//////////////////////////////////////////////////////////////////////////////////////
// Tools
//////////////////////////////////////////////////////////////////////////////////////

declare namespace ToolsTypes {
    import Discord from 'discord.js';

    type DiscordClient = Discord.Client;
    type Servers = LocalTypes.ServerObject[];
    type Message = Discord.Message;

    interface YtdlOptions {
        opusEncoded: boolean;
        encoderArgs: string[];
        seek?: number;
    }

    type Methods = [
        'initialize',
        'checkConnection',
        'playMusic',
        'fetchUserConnection'
    ]

    interface ITracks {
        id: string;
        title: string;
        channel: string;
        thumb: string;
    }

    type Tracks = ITracks[];
}

//////////////////////////////////////////////////////////////////////////////////////
// Utils
//////////////////////////////////////////////////////////////////////////////////////

declare namespace UtilsTypes {
    type Methods = [
        'embed_1'
    ]
}

//////////////////////////////////////////////////////////////////////////////////////
// Commands
//////////////////////////////////////////////////////////////////////////////////////

declare namespace CommandsTypes {
    import Discord from 'discord.js';

    type Servers = LocalTypes.ServerObject[];
    type Message = Discord.Message;
    type VoiceState = Discord.VoiceState;
    type Selected = number;
}