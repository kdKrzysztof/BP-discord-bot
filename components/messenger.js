import DiscordJS, { ApplicationCommandManager, GuildApplicationCommandManager, GuildChannel, GuildMember, Intents, Message, MessageEmbed, Role, MessageActionRow, MessageButton } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.login(process.env.TOKEN)

const guildID = '988141673257271386'
const roleID_CS1 = '990648751221788744'
const roleID_CS2 = '990195296443203635'
const roleID_PST1 = '1046068325450526811'
const roleID_PST2 = '1046126207600705548'
// const guild = client.guilds.cache.get(guildID)
// const devRoleID = '988144372732268544'
// const channelPST = client.channels.cache.get('1046067225590771772')
let oldRare = ''

const RareMessenger = (category, name, credits, bits, isFree, url, stock, img) => {

    if (name === oldRare || name === undefined) {return}

    oldRare = name

    const channelCS = client.channels.cache.get('988173210057052210')
    const channelPST = client.channels.cache.get('1046067225590771772') // rare notifs
    let embedData = new MessageEmbed()
        .setColor(0xDC143C)
        .setAuthor({ name: category})
        .setTitle(name)
        .setURL(url)
        .setThumbnail(img)
        // .addFields(
        //         {
        //             name: 'Creator',
        //             value: creator
        //         },
        //     )
        .setTimestamp()
    if (bits === undefined && credits === undefined && isFree !== undefined) {
        // embedData.setAuthor({name: 'Free'}) ###### deprecated
        return
    }
    if (credits !== undefined) {
        embedData.addFields(
            {
                name: 'Credits',
                value: credits,
                inline: true 
            }
        )
    }
    if (bits !== undefined) {
        embedData.addFields(
            {
                name: 'Bits',
                value: bits,
                inline: true 
            }
        )    
    }
    if (stock !== undefined) {
        const fixedStock = stock.replace('remaining', ' ')
        embedData.addFields(
            {
                name: 'Stock',
                value: fixedStock,
                inline: true 
            }
        )
    }
    let linkButton = new MessageActionRow().addComponents(
        new MessageButton()
        .setLabel('Link')
        .setStyle('LINK')
        .setURL(url)
    )
    channelCS.send({content: "<@&" + roleID_CS1 + '>', embeds: [embedData], components: [linkButton]})
    // channelPST.send({content: "<@&" + roleID_PST1 + '>', embeds: [embedData], components: [linkButton]})
}

const DealMessenger = (name, price, img, url) => {
    const channelCS = client.channels.cache.get('1046123019589910638') // snipe notifs on christophers lounge
    const channelPST = client.channels.cache.get('1046120755957596250') // snipe notifs on PST

    if (name === undefined || url === undefined) { return }

    let embedData = new MessageEmbed()
        .setColor(0xDC143C)
        .setAuthor({ name: 'New snipe!'})
        .setTitle(name)
        .setURL(url)
        .setThumbnail(img)
        .addFields(
            {
                name: 'Credits: ',
                value: price
            }
        )
        .setTimestamp()

    let linkButton = new MessageActionRow().addComponents(
        new MessageButton()
        .setLabel('Link')
        .setStyle('LINK')
        .setURL(url)
    )


    channelCS.send({content: "<@&" + roleID_CS2 + '>', embeds: [embedData], components: [linkButton]})
    // channelPST.send({content: "<@&" + roleID_PST2 + '>', embeds: [embedData], components: [linkButton]})
}


export {
    DealMessenger,
    RareMessenger
}