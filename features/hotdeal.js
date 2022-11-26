import getApi from '../components/getApi.js'
import {parse} from 'node-html-parser'
import dotenv from 'dotenv'
import DiscordJS, {Intents} from 'discord.js'
dotenv.config()


let oldDeal = 0

const hotdeal = async (data) => {
    try {
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
        
            root.querySelectorAll('.card.position-relative.h-100').forEach(e => {
                let price
                try {
                    price = e.querySelector('.text-credits').innerText.trim().replace(/,/, '')
                } catch (err) {}
                let url = e.childNodes[1].attributes['href']
                let snipeName = e.childNodes[3].childNodes[1].childNodes[3].childNodes[1].innerText.trim()
                let dealImage =  e.childNodes[1].getElementsByTagName('img')[0].attributes['src']

                if (price === undefined || url === undefined) {return}

                if (price != oldDeal || price < oldDeal) {
                    if(price <= 2){
                        oldDeal = price
                        console.log(`Snipe: ${snipeName}, \n url: ${url}, \n price: ${price}`)
                    }
                }
            })
        } catch (err) {
            console.log(err)
        }
    }
    
    export default hotdeal
    
    