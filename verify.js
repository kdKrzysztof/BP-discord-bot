import DiscordJS, { ApplicationCommandManager, GuildApplicationCommandManager, GuildChannel, GuildMember, Intents, Message, MessageEmbed, Role, MessageActionRow, MessageButton} from 'discord.js'
import dotenv from 'dotenv'
import getProfileData from './components/getProfileData.js'
import { JSDOM } from "jsdom"
dotenv.config()

const random = () => {
    return Math.floor(Math.random() * 100000000 + 999999999)
}

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.login(process.env.TOKEN)

client.on('ready', () => {
    const verifiedRole = '988144280596004984'
    const guildID = '988141673257271386'
    const guild = client.guilds.cache.get(guildID)
    const timeOut = 15000

    
    let commands

    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: 'verify',
        description: 'Verify your brickplanet account',
        options: [
            // {
            //     name: 'verify',
            //     description: 'Type your brickplanet account ID',
            //     required: true,
            //     type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            // },
            {
                name: 'username',
                description: 'Type your brickplanet account username',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    })
    
    
    const button = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId('verify-button')
        .setLabel('Verify')
        .setStyle('PRIMARY')
        .setCustomId('VERIFY')
        )
        
    client.on('interactionCreate', async (interaction) => {
            if (interaction.isCommand()) {
                const userRole = interaction.member._roles.find(e => e == verifiedRole)
                const { commandName, options } = interaction

                let username = (options.getString('username')).toLowerCase().trim()
                // let userID = options.getNumber('verify').toString().trim()

                console.log(commandName + ' :' + username)


                const button = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setLabel('Verify')
                    .setStyle('PRIMARY')
                    .setCustomId('VERIFY')
                )
                if(!userRole){
                    const user = client.users.cache.get(interaction.member.user.id)
                    await user.send("Type this random number in your profile's bio: " + random())
                    await interaction.reply({
                        content: 'Click when you will change your profiles BIO to verify',
                        components: [button],
                        ephemeral: true,
                        fetchReply: true,
                    })
                        .then (msg => {
                            setTimeout(() => {
                                interaction.editReply({
                                    content: 'times up',
                                    components: [],
                                    ephemeral: true
                                })
                            }, timeOut);
                        })
                        .catch(msg => {
                            console.log('error')
                        })

                    const filter = i => i.customId === 'VERIFY' && i.user.id === user.id
                
                    const collector = interaction.channel.createMessageComponentCollector({filter, time:15000})
                    
                    collector.on('collect', async i => {
                        console.log('button clicked')

                        const data = await getProfileData(username)
                        console.log(data)

                        await interaction.followUp({
                                content: 'you clicked a button! nice',
                                ephemeral: true
                            })
                        
                    })
                } else {
                    await interaction.reply(
                        {
                            content: 'Your account is already verfied',
                            ephemeral: true,
                        }
                    )
                }
            }
        })
    console.log('logged in')
    }
)
        
        

// const randomNumber = (min, max) => {
//     return Math.floor(Math.random() * (max - min + 1) + min)
// }

// let random = randomNumber(0, ListOfQuotes.length - 1)