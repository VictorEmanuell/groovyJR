const axios = require('axios');

const utils = require('../utils/utils');

module.exports = async (msg) => {
    await axios.delete(`https://api.heroku.com/apps/${process.env.APP_ID}/dynos`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.heroku+json; version=3',
            'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
    });

    msg.channel.send(await utils.embed('Ajustes', 'Bot reiniciado!'));
}