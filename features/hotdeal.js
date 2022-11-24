import getApi from '../components/getApi.js'
import {parse} from 'node-html-parser'
import dotenv from 'dotenv'
import DiscordJS, {Intents} from 'discord.js'
dotenv.config()

var host = process.env.HOST
var port = process.env.PORT

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.login(process.env.TOKEN)

const BP_API_RARES = `https://www.brickplanet.com/shop/search?featured=0&rare=1&type=0&search=&sort_by=5&page=1`
const data = await getApi(BP_API_RARES)

let root = parse(data, {
    lowerCaseTagName: false,
    comment: false,
    blockTextElements: {
        script: false,
        noscript: false,
        style: false,
        pre: true,
    }
})

console.log(root)

