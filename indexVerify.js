import DiscordJS, { ApplicationCommandManager, GuildApplicationCommandManager, GuildChannel, GuildMember, Intents, Message, MessageEmbed, Role, MessageActionRow, MessageButton} from 'discord.js'
import getProfileData from './components/getProfileData.js'
import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose"

dotenv.config()

const app = express();
const dbpass = process.env.DBPASS

mongoose.connect(dbpass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`listening on: ${process.env.PORT}`)
        })
        console.log('connected to database')
    })
    .catch((err) => {
        console.log(err)
    })

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
            if (interaction.isCommand()) {
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
                )
                if(!userRole){
                    const user = client.users.cache.get(interaction.member.user.id)
                    await user.send("Type this random number in your profile's bio: " + randomNumber)
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
                
                    const collector = interaction.channel.createMessageComponentCollector({filter, time:timeOut})
                    
                    collector.on('collect', async i => {

                        const data = await getProfileData(username)

                        if (data[0].startsWith(randomNumber) || data[0].endsWith(randomNumber)){
                            try{
                                await interaction.member.setNickname(data[1])
                            } catch {
                                console.log('no perms')
                                return
                            }
                            await interaction.member.roles.add(verifiedRole)
                            await i.deferUpdate()
                            await user.send('Your account has been verified!')
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
        })
    console.log('logged in')
    }
)
        
        

// const randomNumber = (min, max) => {
//     return Math.floor(Math.random() * (max - min + 1) + min)
// }

// let random = randomNumber(0, ListOfQuotes.length - 1)