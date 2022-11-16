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

client.on('ready', () => {
    const guildID = '988141673257271386'
    const guild = client.guilds.cache.get(guildID)
    const devRoleID = '988144372732268544'
    
    // guild.commands.set([]) //deleting all commands, after tagging this code, every existing command will return to normal

    let commands
    
    
    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }
    
    commands?.create({
        name: 'post-guidelines',
        description: '[create server guidelines]',
        options: [
            {
                name: 'number',
                description: 'select which part of message',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            }
        ]
    })
    

    //----------------------------------------------------------------------------
    //embeds for commands


    const embedTitleImageRules = new MessageEmbed()
        .setImage(`https://cdn.discordapp.com/attachments/988447812171759638/988448653070983218/BVTserverguidelines.png`)

    const embedTitleImageInfo = new MessageEmbed()
        .setImage(`https://cdn.discordapp.com/attachments/988447812171759638/988480819884605460/projectinfo.png`)
    
    const embedDescrption = new MessageEmbed()
        .setDescription(`
            You must verify before you can post messages. To verify type ?verify in #verify \n\n
            Please review the guidelines above. Guidelines are enforced by moderators and reviewed on a case-by-case basis \n\n
            --------------------------
        `)
        .setFields({
            name: `1) Prohibited practices:`, 
            value: `Trading items for real-world currency within this server, buying/selling/trading "poisoned" items, trading items you bought with real-world currency or stole, trading/selling groups or in-game items, “middle-manning”, organizing mass LPPing, impersonating users, sharking, or scamming (in any form). Keep discussions of these topics or other topics that break the Buildaverse TOS to a minimum. These rules also apply to your Discord status and "about me" section as server members can see them.`
        },
        {
            name: `2) Doxing is prohibited.`,
            value: `No sharing the personal information of yourself or others (emails, passwords, cookies, IP, etc.).`
        },
        {
            name: `3) Hate speech is prohibited.`,
            value: `No bigotry, racism, LGBTQphobia, sexism, or hate speech (including slurs or variations of slurs, abusing the spoiler system to joke about these slurs is also not tolerated).`
        },
        {
            name: `4) Avoid controversial topics:`,
            value: `Politics, religion, illegal activities etc.`
        },
        {
            name: `5) Respect others.`,
            value: `No arguing, flaming, excessively swearing, or harassing users.`
        },
        {
            name: `6) Do not link or advertise:`,
            value: `Games, groups, third party sites, other discord servers, or other services.`
        },
        {
            name: `7) No NSFW/inappropriate content:`,
            value: `Gore, nudity, animal abuse, etc.`
        },
        {
            name: `8) No spamming, getting others to spam, or pinging staff for no reason.`,
            value: `This includes but is not limited to image chains, posting the same thing repeatedly, copypastas.`
        },
        {
            name: `9) Use channels properly and do not disrupt the flow of lounge channels.`,
            value: `Please check channel descriptions for additional information.`
        },
        {
            name: `10) No usage of languages other than English.`,
            value: `This rule may be changed in future, as we get to hire non-english moderators.`
        },
        {
            name: `11) Follow the Discord TOS.`,
            value: `We are not responsible for anything that happens to your account,`
        })
        .setFooter({
            text: `**Members that violate server rules repeatedly will be permanently banned!**`
        })

    const embedInformation = new MessageEmbed()
        .setDescription(`Hello, my name's Christopher. I've started this project to improve my programing skills, by creating websites, bots, notifiers, etc.
            Maybe in the future I will merge with other trading group, that has better knowledge about how to maintain this type of community. It might be a hard task, but I'll try my best to make this project something I could be proud of. 
        `)

//----------------------------------------------------------------------------

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand) {
            return
        }

        //checking if person that uses the command has perms to do so
        const devRole = interaction.member._roles.find(e => e == devRoleID)

        const { commandName, options } = interaction
        
        switch ( commandName ) {
            case "post-guidelines":   //first command
                const number = options.getNumber('number')
                if (number == 1 && devRole) {
                    await interaction.channel.send({ embeds: [embedTitleImageRules]})
                    await interaction.channel.send({ embeds: [embedDescrption]})
                    // await interaction.reply({
                    //     content: `${commandName} ${number} been used`,
                    //     ephemeral: true,
                    // })
                } if (number == 2 && devRole) {
                    await interaction.channel.send({ embeds: [embedTitleImageInfo]})
                    await interaction.channel.send({ embeds: [embedInformation]})
                    await interaction.reply({
                        content: `${commandName} ${number} been used`,
                        ephemeral: true,
                    })
                } else {
                    await interaction.reply({
                            content: `You don't have permission to use this command`,
                            ephemeral: true,
                    })
                    return
                }
                break;
            default: return
        }
    })


    console.log('ready ready')
    
})
