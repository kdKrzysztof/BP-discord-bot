import notifier from "./components/getApi.js"
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
    let ListOfQuotes = ['Join "Profit Sell Trade"!', 'Made by Krzysiek#5558', 'Ready to false ping!', 'Waiting for new rares!']
    let random = 0
    // const randomNumber = (min, max) => {
    //     return Math.floor(Math.random() * (max - min + 1) + min)
    // }

    setInterval(() => {
        // let random = randomNumber(0, ListOfQuotes.length - 1)
        random = random + 1

        if (random === ListOfQuotes.length) {
            random = 0
        }

        console.log(random)
        console.log(ListOfQuotes[random])

        client.user.setActivity(ListOfQuotes[random]); 
    }, 20000);
    console.log('logged in')
})