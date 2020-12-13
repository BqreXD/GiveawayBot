const Discord = require('discord.js')

module.exports = (client, message) => {
    const logsChannel = message.guild.channels.cache.get('787092208541106176')
    let reason;

    const swears = ['fuck', 'shit']
    swears.forEach(swear => {
        if (message.content.toLowerCase().includes(swear)) {
            reason = '**Swearing**'
            message.delete()
            const Embed = new Discord.MessageEmbed()
            .setTitle(`Message Removed - ${message.author.tag}`)
            .setDescription(`The bot has automatically deleted ${message.author.tag}'s message for ${reason}\n\n**Message Content**: ${message.content}\n**Channel**: ${message.channel}`)
            .setAuthor('Automatic Moderation', client.user.displayAvatarURL())
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp()
            .setColor('RED')
            logsChannel.send(Embed)
        }
    })
}
