import notifier from "./components/getRareData.js"
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
    let ListOfQuotes = ['Join "[?]"!', 'Made by Krzysiek#5558', 'Ready to false ping!', 'Waiting for new rares!']
    let random = 0
    setInterval(() => {
        random = random + 1
        
        if (random === ListOfQuotes.length) {
            random = 0
        }
        
        client.user.setActivity(ListOfQuotes[random]); 
    }, 20000);
    console.log('logged in')
})






// const randomNumber = (min, max) => {
//     return Math.floor(Math.random() * (max - min + 1) + min)
// }

// let random = randomNumber(0, ListOfQuotes.length - 1)