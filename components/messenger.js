import DiscordJS, { ApplicationCommandManager, GuildApplicationCommandManager, GuildChannel, GuildMember, Intents, Message, MessageEmbed, Role } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.login(process.env.TOKEN)

const Messenger = (category, name, credits, bits, url, creator, img) => {
    const guildID = '988141673257271386'
    const roleID_CS = '990648751221788744'
    const roleID_PST = '1041330624578981970'
    // const guild = client.guilds.cache.get(guildID)
    // const devRoleID = '988144372732268544'

    const channel = client.channels.cache.get('988173210057052210')
    const channelPST = client.channels.cache.get('1041328338272264202')
    
    const embedData = new MessageEmbed()
        .setColor(0xDC143C)
        .setAuthor({ name: category})
        .setTitle(name)
        .setURL(url)
        .setThumbnail(img)
        .addFields(
            {
                name: 'Creator',
                value: creator
            },
            {
                name: 'Credits',
                value: credits,
                inline: true 
            },
            {
                name: 'Bits',
                value: bits,
                inline: true 
            }
        )
        .setTimestamp()
    channel.send({content: "<@&" + roleID_CS + '>', embeds: [embedData]})
    channelPST.send({content: "<@&" + roleID_PST + '>', embeds: [embedData]})
}


export default Messenger