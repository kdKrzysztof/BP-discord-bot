import { default as axios } from "axios"
import { JSDOM } from "jsdom"
import cors from 'cors-anywhere'
import dotenv from 'dotenv'
dotenv.config()
import Messenger from './messenger.js'

var host = process.env.HOST
var port = process.env.PORT

cors.createServer({
    originWhitelist: [],
}).listen(port, host, () => {
    console.log('Running CORS Anywhere on ' + host + ':' + port)
})

const getApi = async (a) => {
    const resp = await axios.get(`http://localhost:8080/${a}`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    },
    console.log("sent resp")
    )
    return resp.data
}

const BP_API_RARES = `https://www.brickplanet.com/shop/search?featured=0&rare=1&type=0&search=&sort_by=5&page=1`

let name
let creator
let priceCredits
let priceBits
let isFree
let category
let oldRare
let ItemLink
let itemRaresList = []
let ItemRaresImgList = []

const Rares = setInterval(async () => {

    itemRaresList = []
    ItemRaresImgList = []

    const data = await getApi(BP_API_RARES)
    
    let dom = new JSDOM(`${data}`)
    
    dom.window.document.querySelectorAll('a').forEach(e => {
            itemRaresList.push(e.href)
    })
    
    dom.window.document.querySelectorAll('img').forEach(e => {
        ItemRaresImgList.push(e.src)
    })

    priceCredits = dom.window.document.getElementsByClassName('d-flex flex-column gap-1 text-center text-sm my-2')[0].children[0]
    priceBits = dom.window.document.getElementsByClassName('d-flex flex-column gap-1 text-center text-sm my-2')[0].children[1]
    name = dom.window.document.getElementsByClassName('d-block truncate text-decoration-none fw-semibold text-light mb-1')[0].textContent
    category = dom.window.document.getElementsByClassName('tabs flex-column')[0].children[0].textContent.trim()
    category = category.slice(0, category.length - 1)

    if (priceBits) {
        priceBits = priceBits.textContent
    } else {
        priceBits = '0'
    }

    if (priceCredits) {
        if (priceCredits.textContent === 'Free'){
            isFree = true
            priceCredits = '0'
        } else {
            priceCredits = priceCredits.textContent
        }
    }

    creator = dom.window.document.querySelector('.text-info').textContent.trim()
    
    if (oldRare === itemRaresList[0]) {return}
    oldRare = itemRaresList[0]
    
    ItemLink = itemRaresList[0].replace(":8080", "")

    console.log(`${ItemLink}, \n Name: ${name} \n Creator: ${creator}, \n Credits: ${priceCredits}, \n Bits: ${priceBits}`)
    
    itemRaresList = []
    
    if (creator !== "BrickPlanet") { return }
    
    Messenger(category, name, priceCredits, priceBits, ItemLink, creator, ItemRaresImgList[0])
}, 3000);


export default Rares