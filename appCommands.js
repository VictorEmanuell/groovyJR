const {
    appPlay
} = require('./appCommands/export/export');

module.exports = async (servers, client, data) => {
    switch (data.message) {
        case 'play':
            appPlay(servers, client, data);
            break;
    }
}