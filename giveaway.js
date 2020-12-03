// MAKE SURE TO PASTE YOUR ID FOR THE GIVEAWAY CHANNEL! I have placed a comment next to it so you can find it easily :)

const Discord = require('discord.js')
const ms = require('ms')

module.exports = {
    name: 'giveaway',
    description: 'Start a giveaway for the server members!',
    minArgs: 0,
    maxArgs: 0,
    category: 'Fun',
    requiredPermissions: ['ADMINISTRATOR'],
    callback: async (message, args) => {
        const bot = message.client.user.id
        const author = message.author.id
        const author1 = message.author
        const authorName = message.author.tag
        const filter = m => m.author.id === message.author.id
        const embedTitle = 'Giveaway!'
        let embedDescription = ['What would you like to give away?', 'How long will the giveaway last?']
        let embedFooter = ["10 Words Maximum!", "Example: '5 minutes // 5m', '3 days // 3d', '2 weeks // 2w'"]
        let title = ''
        let description = ''
        let footer = ''
        let time
        let giveawayMembers = []
        for (i = 0; i < embedDescription.length; i++) {
            const Embed = new Discord.MessageEmbed()
                .setTitle(embedTitle)
                .setDescription(embedDescription[i])
                .setColor(3426654)
                .setFooter(embedFooter[i])
            message.channel.send(Embed)
            try {
                msg = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: '60000',
                    errors: ['time']
                });
            } catch (ex) {
                message.channel.send("You have not provided an answer within 60 seconds. please type \"!giveaway\" to try again.");
                break;
            }
            if (msg.first().content.toLowerCase().trim() === 'cancel') {
                message.channel.send('Cancelled!')
                break;
            } else {
                const args = msg.first().content
                const argsSplit = args.trim().split(' ')
                if (i == 0) {
                    if (argsSplit.length > 10) {
                        message.channel.send('Incorrect Syntax! Too many arguments, please retry.')
                        break;
                    } else {
                        title = msg.first().content
                    }
                } else if (i == 1) {
                    if (argsSplit.length > 2) {
                        message.channel.send('Incorrect Syntax! Too many arguments, please retry.')
                        break;
                    } else {
                        let milliseconds = ms(args)
                        if (!milliseconds) {
                            message.channel.send('Incorrect Syntax! Please give a correct time!')
                        } else {
                            if (milliseconds < 60000 || milliseconds > 1209600000) {
                                return message.channel.send('Giveaways must be at least 1 minute long and may not take over 2 weeks!')
                            } else {
                                time = ms(milliseconds, {
                                    long: true
                                })
                                message.channel.send(`Success! The giveaway will now be ${time} long!`)
                                const Embed = new Discord.MessageEmbed()
                                    .setTitle(`New giveaway: ${title}`)
                                    .setDescription(`Time remaining: ${time}`)
                                    .setFooter('Bot created by Bqre#0001', '\nhttps://i.imgur.com/trvzFSz.png')
                                    .setAuthor(`Giveaway by: ${message.author.tag}`, message.author.displayAvatarURL({
                                        format: "png",
                                        dynamic: true
                                    }))
                                    .setThumbnail('https://i.imgur.com/BFPl9WB.png')
                                    .setColor(3426654)
                                message.reply('Is the following message correct? React with:\n✔ for Yes!\n❌ to Cancel')
                                message.channel.send(Embed).then(message => {
                                    message.react('✔')
                                        .then(() => message.react('❌'))
                                    const filter2 = (reaction, user) => {
                                        return ['✔', '❌'].includes(reaction.emoji.name) && user.id === author;
                                    };

                                    message.awaitReactions(filter2, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                        })
                                        .then(collected => {
                                            const reaction = collected.first();

                                            if (reaction.emoji.name === '✔') {
                                                const giveawayChannel = message.guild.channels.cache.get('channelId') // The ID of the Channel giveaways will be sent to!
                                                giveawayChannel.send(Embed).then(message => {
                                                    message.react('🎁')
                                                    const filter2 = (reaction, user) => {
                                                        return reaction.emoji.name === '🎁' && user.id != bot;
                                                    };

                                                    const collector = message.createReactionCollector(filter2, {
                                                        time: milliseconds
                                                    });
                                                    collector.on('collect', (reaction, user) => {
                                                        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
                                                        giveawayMembers.push(user)
                                                    })
                                                    var giveawayTimer = setInterval(function () {
                                                        milliseconds = milliseconds - 10000
                                                        time = ms(milliseconds, {
                                                            long: true
                                                        })
                                                        if (milliseconds != 0) {
                                                            const EmbedUpdated = new Discord.MessageEmbed()
                                                                .setTitle(`New giveaway: ${title}`)
                                                                .setDescription(`Time remaining: ${time}`)
                                                                .setFooter('Bot created by Bqre#0001', '\nhttps://i.imgur.com/trvzFSz.png')
                                                                .setAuthor(`Giveaway by: ${authorName}`, author1.displayAvatarURL({
                                                                    format: "png",
                                                                    dynamic: true
                                                                }))
                                                                .setThumbnail('https://i.imgur.com/BFPl9WB.png')
                                                                .setColor(3426654)
                                                            message.edit(EmbedUpdated)
                                                        } else {
                                                            if (giveawayMembers.length < 2) {
                                                                const EmbedUpdated2 = new Discord.MessageEmbed()
                                                                .setTitle('🎁 GIVEAWAY ENDED! 🎁')
                                                                .setDescription(`Unfortunately, not enough people have entered, therefore the giveaway was closed.`)
                                                                .setAuthor(`Giveaway by: ${authorName}`, author1.displayAvatarURL({
                                                                    format: "png",
                                                                    dynamic: true
                                                                }))
                                                                .setThumbnail('https://i.imgur.com/Et8UgIB.png')
                                                                .setColor(3426654)
                                                            message.edit(EmbedUpdated2)
                                                                giveawayMembers = []
                                                                clearInterval(giveawayTimer)
                                                            } else {
                                                                const randomIndex = Math.floor(Math.random() * giveawayMembers.length)
                                                                const winner = giveawayMembers[randomIndex]
                                                                const EmbedUpdated2 = new Discord.MessageEmbed()
                                                                    .setTitle('🎁 GIVEAWAY ENDED! 🎁')
                                                                    .setDescription(`Winner: ${winner}!!`)
                                                                    .setFooter('Thanks everyone for participating!')
                                                                    .setAuthor(`Giveaway by: ${authorName}`, author1.displayAvatarURL({
                                                                        format: "png",
                                                                        dynamic: true
                                                                    }))
                                                                    .setThumbnail('https://i.imgur.com/BFPl9WB.png')
                                                                    .setColor(3426654)
                                                                message.edit(EmbedUpdated2)
                                                                message.channel.send(`The winner of the ${title} giveaway is ${winner}! Congratulations! 🥳`)
                                                                giveawayMembers = []
                                                                clearInterval(giveawayTimer)
                                                            }
                                                        }
                                                    }, 10000);
                                                })
                                            } else if (reaction.emoji.name === '❌') {
                                                return message.channel.send('Cancelled.')
                                            }
                                        })
                                })
                            }
                        }
                    }
                }
            }
        }
    }
}