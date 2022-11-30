import DiscordJS, { ApplicationCommandManager, GuildApplicationCommandManager, GuildChannel, GuildMember, Intents, Message, MessageEmbed, Role, MessageActionRow, MessageButton, Collection} from 'discord.js'
import getProfileData from './components/getProfileData.js'
import dotenv from 'dotenv';
import mongoose from "mongoose"
import app from './routes/routes.js'
import fetchHandler from './components/fetchHandler.js'

dotenv.config()

const dbpass = process.env.DBPASS

mongoose.connect(dbpass, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
        console.log('connected to database')
        app.listen(process.env.PORT, () => {
            console.log(`listening on: ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log(err)
    })

const random = () => {
    return Math.floor(Math.random() * 100000000 + 1000000000)
}

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.login(process.env.TOKEN)

client.on('ready', () => {
    const guildID = '988141673257271386'
    const guild = client.guilds.cache.get(guildID)
    const timeOut = 60000
    
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
            try {
                if (interaction.isCommand() && interaction.commandName === 'verify') {

                    const verifiedRole = '988144280596004984'
                    const userRole = interaction.member._roles.find(e => e == verifiedRole)
                    const { commandName, options } = interaction
                    const randomNumber = random()
                    
                    let username = (options.getString('username')).toLowerCase().trim()
                    
                    console.log(commandName + ': ' + username)
                    
                    
                    const button = new MessageActionRow().addComponents(
                        new MessageButton()
                        .setLabel('Verify')
                        .setStyle('PRIMARY')
                        .setCustomId('VERIFY')
                    ); 

                    if(!userRole){

                        const discordID = client.users.cache.get(interaction.member.user.id)

                        let findUser = await fetchHandler.findDiscordAccount(discordID)

                        if (findUser === true) {
                            await interaction.reply({
                                content: `Your discord account is already verified. Use: **/unlink** command to unlink your discord account from already verified brickplanet username`,
                                components: [],
                                ephemeral: true,
                                fetchReply: true,
                            })
                            return
                        }
                        
                        try {
                            await discordID.send("Type this random number in your profile's bio: " + randomNumber)
                        } catch {}

                        await interaction.reply({
                            content: `Please put this number at start or end of your profile's bio: ${randomNumber}`,
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

                    const filter = i => i.customId === 'VERIFY' && i.user.id === discordID.id
                    
                    const collector = interaction.channel.createMessageComponentCollector({filter, time:timeOut})
                    
                    collector.on('collect', async i => {
                        
                        let findBpAcc = fetchHandler.findBpUsername(username)
                        if (findBpAcc === true) {
                            
                        }

                        const data = await getProfileData(username)
                        
                        
                        if (data[0].startsWith(randomNumber) || data[0].endsWith(randomNumber)){
                            fetchHandler.createUser(username, discordID)
                            
                            try{
                                await interaction.member.setNickname(data[1])
                            } catch {
                                console.log('no perms')
                                return
                            }
                            
                            await interaction.member.roles.add(verifiedRole)
                            await i.deferUpdate()

                            try {
                                await discordID.send('Your account has been verified!')
                            } catch {}

                        } else {
                            interaction.editReply({
                                content: 'Incorrect verification code in BIO. Please redo the interaction.',
                                components: [],
                                ephemeral: true
                            })
                        }
                    })
                } else {
                    await interaction.reply(
                        {
                            content: 'Your account is already verfied',
                            components: [],
                            ephemeral: true,
                        }
                        )
                        interaction.deferred
                    }
                }
                } catch (err) {
                    console.log(err)
                }
            })
            console.log('logged in')
        }
        )
        
        
        
        // const randomNumber = (min, max) => {
            //     return Math.floor(Math.random() * (max - min + 1) + min)
            // }
            
            // let random = randomNumber(0, ListOfQuotes.length - 1)