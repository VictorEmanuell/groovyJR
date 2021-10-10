const axios = require('axios');

const embed = require('../utils/utils');

module.exports = async (msg) => {
    await axios.delete(`https://api.heroku.com/apps/${process.env.APP_ID}/dynos`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.heroku+json; version=3',
            'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
    });

    msg.channel.send(await embed('Ajustes', 'Bot reiniciado!'));
}