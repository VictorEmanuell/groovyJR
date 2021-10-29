import Discord from 'discord.js';

class Help {
    async execute(msg: CommandsTypes.Message) {
        const embed = new Discord.MessageEmbed()
            .setColor([111, 20, 113])
            .setAuthor('GroovyJR')
            .setDescription(`Esses são os comando disponíveis: `)
            .addField('--join', 'Conecta o bot no canal de voz que o autor da mensagem está.')
            .addField('--leave', 'Desconecta o bot do canal de voz que o autor da mensagem está.')
            .addField('--p', 'Pesquisa a música reproduz a primeira encontrada.\nTambém pode ser usado com links de músicas e playlists.')
            .addField('--s', 'Exibe os 5 primeiros resultados e aguarda a escolha por reação.\nTambém pode ser usado com links de músicas e playlists.')
            .addField('--stop', 'Pausa a reprodução da música.')
            .addField('--resume', 'Continua a reprodução da música.')
            .addField('--skip', 'Pula para a próxima música.\nSe não houver mais músicas na fila o bot desconecta.')
            .addField('--v', 'Exibe o volume atual da reprodução.')
            .addField('--v 45', 'Define um volume de reprodução: 0-150')
            .addField('--queue', 'Exibe a fila de reprodução.\nVocê pode navegar entre as páginas por meio de reações com emotes.')
            .addField('-->', 'Baseado na enumeração da fila de reprodução, você pode pular para a música desejada.\nEx.: --> 25')
            .addField('--clear', 'Limpa a fila de reprodução.')
            .addField('--random', 'Embaralha a fila de reprodução.')
            .addField('--help', 'Bom, você deve saber para que serve este comando. Não eh?!');

        msg.channel.send(await embed);
    }
}

export const help = new Help();